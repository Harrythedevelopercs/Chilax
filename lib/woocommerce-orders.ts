const WC_URL = process.env.NEXT_PUBLIC_WC_URL!;
const WC_KEY = process.env.WC_CONSUMER_KEY!;
const WC_SECRET = process.env.WC_CONSUMER_SECRET!;
const WC_AUTH = () =>
  `Basic ${Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString("base64")}`;

export interface WCOrder {
  id: number;
  number: string;
  status: string;
  date_created: string;
  billing: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    company: string;
    country: string;
    address_1: string;
  };
  meta_data: Array<{ key: string; value: unknown }>;
  customer_note: string;
  line_items: Array<{ name: string; quantity: number }>;
}

export interface WCNote {
  id: number;
  date_created: string;
  note: string;
  customer_note: boolean;
  author: string;
}

/** Create a WooCommerce customer — returns WC customer ID or null */
export async function createWCCustomer(
  email: string,
  firstName: string,
  lastName: string
): Promise<number | null> {
  try {
    const res = await fetch(`${WC_URL}/wp-json/wc/v3/customers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: WC_AUTH(),
      },
      body: JSON.stringify({
        email,
        first_name: firstName,
        last_name: lastName || "",
        username: `${email.split("@")[0]}_${Date.now()}`,
        password: Math.random().toString(36).slice(2) + "Aa1!",
      }),
    });
    if (!res.ok) {
      console.error("WC customer error:", await res.text());
      return null;
    }
    const data = await res.json();
    return data.id ?? null;
  } catch (e) {
    console.error("WC customer exception:", e);
    return null;
  }
}

/** Create a WC order (quote placeholder) — returns order ID or null */
export async function createWCOrder(params: {
  customerEmail: string;
  customerName: string;
  company?: string;
  phone?: string;
  country?: string;
  address?: string;
  orderNotes?: string;
  wcCustomerId?: number;
  items: Array<{
    name: string;
    categoryName: string;
    moq: string;
    leadTime: string;
    quantity: number;
  }>;
}): Promise<number | null> {
  try {
    const parts = params.customerName.split(" ");
    const firstName = parts[0] ?? "";
    const lastName = parts.slice(1).join(" ") ?? "";

    const res = await fetch(`${WC_URL}/wp-json/wc/v3/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: WC_AUTH(),
      },
      body: JSON.stringify({
        status: "on-hold",
        customer_id: params.wcCustomerId ?? 0,
        billing: {
          first_name: firstName,
          last_name: lastName,
          email: params.customerEmail,
          phone: params.phone ?? "",
          company: params.company ?? "",
          address_1: params.address ?? "",
          country: params.country ?? "",
        },
        meta_data: [
          {
            key: "_parcela_items",
            value: JSON.stringify(params.items),
          },
          {
            key: "_parcela_notes",
            value: params.orderNotes ?? "",
          },
        ],
        customer_note: params.orderNotes ?? "",
      }),
    });

    if (!res.ok) {
      console.error("WC order error:", await res.text());
      return null;
    }
    const data = await res.json();
    return data.id ?? null;
  } catch (e) {
    console.error("WC order exception:", e);
    return null;
  }
}

/** Get all WC orders for a customer by email */
export async function getOrdersByEmail(email: string): Promise<WCOrder[]> {
  try {
    const res = await fetch(
      `${WC_URL}/wp-json/wc/v3/orders?search=${encodeURIComponent(email)}&per_page=20&orderby=date&order=desc`,
      { headers: { Authorization: WC_AUTH() } }
    );
    if (!res.ok) return [];
    const all: WCOrder[] = await res.json();
    // Filter to only this client's orders
    return all.filter(
      (o) => o.billing.email.toLowerCase() === email.toLowerCase()
    );
  } catch {
    return [];
  }
}

/** Get single WC order by ID */
export async function getOrderById(id: number): Promise<WCOrder | null> {
  try {
    const res = await fetch(`${WC_URL}/wp-json/wc/v3/orders/${id}`, {
      headers: { Authorization: WC_AUTH() },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

/** Get customer-visible notes/replies on an order */
export async function getOrderNotes(orderId: number): Promise<WCNote[]> {
  try {
    const res = await fetch(
      `${WC_URL}/wp-json/wc/v3/orders/${orderId}/notes?per_page=20`,
      { headers: { Authorization: WC_AUTH() } }
    );
    if (!res.ok) return [];
    const notes: WCNote[] = await res.json();
    // Only return customer-visible notes (replies from sales)
    return notes.filter((n) => n.customer_note);
  } catch {
    return [];
  }
}

/** Map WC status to human-readable label + color */
export function mapOrderStatus(status: string): {
  label: string;
  color: string;
  bg: string;
} {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    "on-hold": { label: "Quote Received", color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
    pending: { label: "Pending Review", color: "text-gray-600", bg: "bg-gray-50 border-gray-200" },
    processing: { label: "In Production", color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
    completed: { label: "Delivered", color: "text-[#277a4e]", bg: "bg-[#eaf6f0] border-[#c3f0da]" },
    cancelled: { label: "Cancelled", color: "text-red-600", bg: "bg-red-50 border-red-200" },
  };
  return map[status] ?? { label: status, color: "text-gray-600", bg: "bg-gray-50 border-gray-200" };
}
