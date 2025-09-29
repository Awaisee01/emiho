import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await stripe.checkout.sessions.retrieve(params.id, {
      expand: ["subscription", "customer"],
    });

    return NextResponse.json(session);
  } catch (error: any) {
    console.error("Error fetching session:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
