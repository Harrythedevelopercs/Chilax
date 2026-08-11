import { NextRequest, NextResponse } from "next/server";
import { getOrdersByEmail, getOrderById, getOrderNotes, mapOrderStatus } from "@/lib/woocommerce-orders";
import { verifySession, SESSION_COOKIE, SessionUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const user = token ? verifySession<SessionUser>(token) : null;
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("id");

  if (orderId) {
    // Single order detail + notes
    const order = await getOrderById(Number(orderId));
    if (!order || order.billing.email.toLowerCase() !== user.email) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const notes = await getOrderNotes(Number(orderId));

    // Parse items from meta
    const itemsMeta = order.meta_data?.find((m: {key: string}) => m.key === "_parcela_items");
    const noteMeta = order.meta_data?.find((m: {key: string}) => m.key === "_parcela_notes");
    const parsedItems = itemsMeta?.value ? JSON.parse(itemsMeta.value as string) : [];

    return NextResponse.json({
      id: order.id,
      number: order.number,
      status: mapOrderStatus(order.status),
      rawStatus: order.status,
      date: order.date_created,
      billing: order.billing,
      items: parsedItems,
      customerNote: noteMeta?.value ?? order.customer_note ?? "",
      replies: notes.map((n) => ({
        id: n.id,
        date: n.date_created,
        message: n.note,
        author: n.author || "Parcela Sales Team",
      })),
    });
  }

  // All orders for user
  const orders = await getOrdersByEmail(user.email);
  return NextResponse.json(
    orders.map((o) => {
      const itemsMeta = o.meta_data?.find((m: {key: string}) => m.key === "_parcela_items");
      const items = itemsMeta?.value ? JSON.parse(itemsMeta.value as string) : [];
      return {
        id: o.id,
        number: o.number,
        status: mapOrderStatus(o.status),
        rawStatus: o.status,
        date: o.date_created,
        itemCount: items.length || 1,
        firstItem: items[0]?.name ?? "Custom Packaging Quote",
        country: o.billing.country,
      };
    })
  );
}
