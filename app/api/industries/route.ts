import { NextResponse } from "next/server";
import { getWPIndustries } from "@/lib/woocommerce";

export async function GET() {
  try {
    const industries = await getWPIndustries();
    return NextResponse.json({
      success: true,
      count: industries.length,
      industries,
    });
  } catch (error) {
    console.error("Error in /api/industries API route:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load dynamic industries", industries: [] },
      { status: 500 }
    );
  }
}
