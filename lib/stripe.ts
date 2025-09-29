import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16" as any, // 👈 bypass strict typing
});


export const getStripeJs = async () => {
  const stripeJs = await import('@stripe/stripe-js').then(mod =>
    mod.loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
  );
  return stripeJs;
};
