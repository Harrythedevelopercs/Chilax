import { NextRequest, NextResponse } from "next/server";
import { clientExists, createClient } from "@/lib/clients";
import { generatePassword } from "@/lib/auth";
import { createWCCustomer } from "@/lib/woocommerce-orders";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { email, name, company } = await req.json();

    if (!email || !name) {
      return NextResponse.json({ error: "email and name required" }, { status: 400 });
    }

    // Skip if client already exists
    if (clientExists(email)) {
      return NextResponse.json({ success: true, existing: true });
    }

    // Generate portal password
    const password = generatePassword(12);

    // Create WC customer (non-blocking)
    const wcCustomerId = await createWCCustomer(email, name.split(" ")[0], name.split(" ").slice(1).join(" "));

    // Save client record
    await createClient({ email, name, company, password, wcCustomerId: wcCustomerId ?? undefined });

    // Send welcome email with credentials
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const dashboardUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://parcela.co"}/login`;

    await transporter.sendMail({
      from: `"Parcela® Portal" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Your Parcela Client Portal Access 🔐",
      html: `
      <!DOCTYPE html>
      <html>
      <body style="margin:0;padding:0;background:#f8f9fb;font-family:'Google Sans',Arial,sans-serif;">
        <div style="max-width:540px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 4px 20px rgba(0,0,0,0.07);">
          
          <div style="background:linear-gradient(135deg,#123524 0%,#277a4e 100%);padding:28px 32px;">
            <h1 style="margin:0;color:#fff;font-size:20px;font-weight:800;">Welcome to Parcela® Portal</h1>
            <p style="margin:6px 0 0;color:#a7f3d0;font-size:13px;">Your personal order tracking dashboard is ready</p>
          </div>

          <div style="padding:28px 32px;">
            <p style="margin:0 0 20px;color:#334155;font-size:14px;">Hi <strong>${name.split(" ")[0]}</strong>,</p>
            <p style="margin:0 0 20px;color:#64748b;font-size:13px;line-height:1.6;">
              Your quote has been received and your client portal account has been created. 
              Use the credentials below to track your orders and view replies from our sales team.
            </p>

            <div style="background:#f8f9fb;border:1px solid #e2e8f0;border-radius:12px;padding:20px 24px;margin-bottom:24px;">
              <p style="margin:0 0 12px;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.12em;color:#277a4e;">Your Login Credentials</p>
              <table style="width:100%;border-collapse:collapse;">
                <tr>
                  <td style="padding:6px 0;width:90px;color:#64748b;font-size:13px;font-weight:600;">Email</td>
                  <td style="padding:6px 0;color:#0f172a;font-size:13px;font-weight:700;">${email}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;color:#64748b;font-size:13px;font-weight:600;">Password</td>
                  <td style="padding:6px 0;">
                    <code style="background:#0f172a;color:#4ade80;font-size:15px;font-weight:700;padding:4px 10px;border-radius:6px;letter-spacing:0.05em;">${password}</code>
                  </td>
                </tr>
              </table>
            </div>

            <a href="${dashboardUrl}" style="display:block;text-align:center;background:#277a4e;color:#fff;text-decoration:none;font-weight:800;font-size:14px;padding:14px 24px;border-radius:12px;margin-bottom:20px;">
              Access Your Dashboard →
            </a>

            <p style="margin:0;color:#94a3b8;font-size:11px;text-align:center;">
              Please save your password. For security, we recommend changing it after first login.<br>
              Questions? Reply to this email or contact <a href="mailto:${process.env.SMTP_USER}" style="color:#277a4e;">${process.env.SMTP_USER}</a>
            </p>
          </div>
        </div>
      </body>
      </html>`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
