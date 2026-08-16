import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { createWCOrder } from "@/lib/woocommerce-orders";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      fullName,
      company,
      email,
      phone,
      country,
      address,
      orderNotes,
      items,
    } = body;

    if (!fullName || !email || !items || items.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Build items HTML table
    const itemsHtml = items
      .map(
        (item: { name: string; categoryName: string; moq: string; leadTime: string; quantity: number }) => `
        <tr style="border-bottom:1px solid #e2e8f0;">
          <td style="padding:10px 12px;font-weight:600;color:#0f172a;">${item.name}</td>
          <td style="padding:10px 12px;color:#64748b;">${item.categoryName}</td>
          <td style="padding:10px 12px;color:#64748b;">${item.moq}</td>
          <td style="padding:10px 12px;color:#64748b;">${item.leadTime}</td>
          <td style="padding:10px 12px;text-align:center;font-weight:700;color:#277a4e;">${item.quantity}</td>
        </tr>`
      )
      .join("");

    const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><title>New Quote Request</title></head>
    <body style="margin:0;padding:0;background:#f8f9fb;font-family:'Google Sans',Arial,sans-serif;">
      <div style="max-width:680px;margin:32px auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 4px 24px rgba(0,0,0,0.07);">
        
        <!-- Header -->
        <div style="background:linear-gradient(135deg,#123524 0%,#277a4e 100%);padding:32px 36px;">
          <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:800;letter-spacing:-0.5px;">📦 New Quote Request</h1>
          <p style="margin:8px 0 0;color:#a7f3d0;font-size:13px;">Parcela® Custom Packaging — Sales Inquiry</p>
        </div>

        <!-- Customer Details -->
        <div style="padding:28px 36px 0;">
          <h2 style="margin:0 0 16px;font-size:14px;font-weight:800;text-transform:uppercase;letter-spacing:0.12em;color:#277a4e;">Customer Information</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:6px 0;width:140px;color:#64748b;font-size:13px;font-weight:600;">Full Name</td>
              <td style="padding:6px 0;color:#0f172a;font-size:13px;font-weight:700;">${fullName}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#64748b;font-size:13px;font-weight:600;">Company</td>
              <td style="padding:6px 0;color:#0f172a;font-size:13px;">${company || "—"}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#64748b;font-size:13px;font-weight:600;">Email</td>
              <td style="padding:6px 0;"><a href="mailto:${email}" style="color:#277a4e;font-size:13px;font-weight:700;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#64748b;font-size:13px;font-weight:600;">Phone</td>
              <td style="padding:6px 0;color:#0f172a;font-size:13px;">${phone || "—"}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#64748b;font-size:13px;font-weight:600;">Country</td>
              <td style="padding:6px 0;color:#0f172a;font-size:13px;">${country || "—"}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#64748b;font-size:13px;font-weight:600;">Address</td>
              <td style="padding:6px 0;color:#0f172a;font-size:13px;">${address || "—"}</td>
            </tr>
          </table>
        </div>

        <!-- Divider -->
        <div style="margin:24px 36px;border-top:1px solid #e2e8f0;"></div>

        <!-- Order Items -->
        <div style="padding:0 36px;">
          <h2 style="margin:0 0 16px;font-size:14px;font-weight:800;text-transform:uppercase;letter-spacing:0.12em;color:#277a4e;">Requested Products (${items.length} item${items.length > 1 ? "s" : ""})</h2>
          <table style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;">
            <thead>
              <tr style="background:#f8f9fb;">
                <th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.1em;color:#64748b;">Product</th>
                <th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.1em;color:#64748b;">Category</th>
                <th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.1em;color:#64748b;">MOQ</th>
                <th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.1em;color:#64748b;">Lead Time</th>
                <th style="padding:10px 12px;text-align:center;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.1em;color:#64748b;">Qty</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>
        </div>

        <!-- Order Notes -->
        ${
          orderNotes
            ? `
        <div style="padding:24px 36px 0;">
          <h2 style="margin:0 0 10px;font-size:14px;font-weight:800;text-transform:uppercase;letter-spacing:0.12em;color:#277a4e;">Special Notes / Requirements</h2>
          <div style="background:#f8f9fb;border:1px solid #e2e8f0;border-radius:10px;padding:14px 16px;color:#334155;font-size:13px;line-height:1.6;">${orderNotes}</div>
        </div>`
            : ""
        }

        <!-- Footer -->
        <div style="padding:28px 36px;margin-top:24px;background:#f8f9fb;border-top:1px solid #e2e8f0;text-align:center;">
          <p style="margin:0;color:#94a3b8;font-size:12px;">This quote request was submitted via <strong style="color:#277a4e;">Parcela®</strong> website checkout.</p>
          <p style="margin:6px 0 0;color:#94a3b8;font-size:11px;">Reply to <a href="mailto:${email}" style="color:#277a4e;">${email}</a> to follow up with the customer.</p>
        </div>
      </div>
    </body>
    </html>`;

    // Configure transporter — uses env vars set in .env.local
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Parcela® Website" <${process.env.SMTP_USER}>`,
      to: process.env.SALES_EMAIL || "hello@parcela.studio",
      replyTo: email,
      subject: `🛒 New Quote Request from ${fullName}${company ? ` — ${company}` : ""} (${items.length} product${items.length > 1 ? "s" : ""})`,
      html,
    });

    // Create WC order for tracking (non-blocking)
    createWCOrder({
      customerEmail: email,
      customerName: fullName,
      company,
      phone,
      country,
      address,
      orderNotes,
      items,
    }).catch((e) => console.error("WC order creation failed:", e));

    // Register client portal account (non-blocking — sends password email)
    fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name: fullName, company }),
    }).catch((e) => console.error("Client registration failed:", e));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Quote email error:", error);
    return NextResponse.json({ error: "Failed to send quote" }, { status: 500 });
  }
}
