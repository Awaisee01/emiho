// app/api/checkout/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});


type PlanPayload = {
  name: string;
  price?: number;      // dollar amount e.g. 4.99
  priceId?: string;    // optional pre-created Stripe Price ID
  description?: string;
  currency?: string;   // defaults to usd
  interval?: "month" | "year";
};

export async function POST(req: Request) {
  try {
    const { plan, userId: incomingUserId } = await req.json() as {
      plan: PlanPayload;
      userId?: string;
    };

    if (!plan) return NextResponse.json({ error: "Missing plan" }, { status: 400 });

    await connectDB();

    // ensure user exists
    const userId = incomingUserId;
    const user = await User.findById(userId).select("_id email name");
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
    const successUrl = `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${baseUrl}/pricing`;

    const lineItem = plan.priceId
      ? { price: plan.priceId, quantity: 1 }
      : {
          price_data: {
            currency: plan.currency || "usd",
            unit_amount: Math.round((plan.price || 0) * 100),
            recurring: { interval: plan.interval || "month" },
            product_data: {
              name: plan.name,
              description: plan.description || "",
            },
          },
          quantity: 1,
        };

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [lineItem as any],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { userId: user._id.toString(), planName: plan.name },
      allow_promotion_codes: true,
    });

    return NextResponse.json({ id: session.id, url: session.url });
  } catch (err: any) {
    console.error("Checkout Error:", err);
    return NextResponse.json({ error: err.message || "Internal error" }, { status: 500 });
  }
}
