
// app/api/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});


export async function POST(req: NextRequest) {
  let event: Stripe.Event;

  try {
    // read raw body (must not be parsed)
    const cloned = req.clone();
    const raw = await cloned.arrayBuffer();
    const buf = Buffer.from(raw);
    const sig = req.headers.get("stripe-signature")!;
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error("Webhook signature error:", err?.message || err);
    return new NextResponse(`Webhook Error: ${err?.message || "invalid signature"}`, { status: 400 });
  }

  // Handle events
  if (event.type === "checkout.session.completed") {
    try {
      await connectDB();
      const session = event.data.object as Stripe.Checkout.Session;

      const userId = session.metadata?.userId;
      const planName = session.metadata?.planName || "Free";

      if (!userId) {
        console.error("Webhook: missing userId in metadata");
        return NextResponse.json({ error: "Missing userId" }, { status: 400 });
      }

      // Update user subscription directly
      const updated = await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            subscription: {
              plan: planName,
              status: session.payment_status === "paid" ? "active" : "inactive",
              startDate: new Date(),
              endDate: null,
            },
          },
        },
        { new: true, runValidators: false } // avoid full-document validation issues
      ).select("-password");

      console.log("Webhook updated user subscription:", updated?.subscription);
    } catch (err: any) {
      console.error("Webhook handling error:", err);
      // don't throw — return 200 to Stripe only if you want retries changed; here we log
      return NextResponse.json({ error: err.message || "Webhook handler error" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
