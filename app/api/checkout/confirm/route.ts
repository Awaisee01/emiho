import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

export async function POST(req: NextRequest) {
  try {
    const { session_id } = await req.json();
    if (!session_id) {
      return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
    }

    // Verify session directly with Stripe
    const checkoutSession = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["subscription", "customer", "line_items.data.price.product"],
    });

    if (checkoutSession.payment_status !== "paid") {
      return NextResponse.json({ ok: true, updated: false, reason: "not_paid" });
    }

    const userId = checkoutSession.metadata?.userId;
    const planName = checkoutSession.metadata?.planName || "Premium";
    if (!userId) {
      return NextResponse.json({ error: "Missing userId in metadata" }, { status: 400 });
    }

    await connectDB();

    const updated = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          subscription: {
            plan: planName,
            status: "active",
            startDate: new Date(),
            endDate: null,
          },
        },
      },
      { new: true, runValidators: false }
    ).select("-password");

    return NextResponse.json({ ok: true, updated: true, subscription: updated?.subscription });
  } catch (err: any) {
    console.error("Confirm checkout error:", err);
    return NextResponse.json({ error: err.message || "Internal error" }, { status: 500 });
  }
}


