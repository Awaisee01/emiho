
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, Crown, Star } from "lucide-react";
import { useSession } from "next-auth/react"; // ✅ get session
import { useRouter } from "next/navigation";

interface Plan {
  name: string;
  description: string;
  price: number;
  features: string[];
  note?: string;
}

interface PricingCardProps {
  plan: Plan;
  isPopular?: boolean;
  delay?: number;
}

const PricingCard: React.FC<PricingCardProps> = ({
  plan,
  isPopular = false,
  delay = 0,
}) => {
  const { data: session } = useSession(); // ✅ access logged-in user
  const router = useRouter();

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: delay * 0.1,
        ease: "easeOut",
      },
    },
  };

  const handleCheckout = async () => {
    if (!session?.user?.id) {
      console.error("❌ No user session found");
      router.push("/auth/signin"); // redirect if not logged in
      return;
    }

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        plan,
        userId: session.user.id, // ✅ real ObjectId
      }),
    });

    const data = await res.json();
    if (data.url) {
      window.location.href = data.url; // ✅ redirect to Stripe Checkout
    } else {
      console.error("Checkout error:", data.error || data);
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={`relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 ${
        isPopular ? "border-[#0052CC] scale-105" : ""
      }`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-to-r from-[#0052CC] to-[#A5D8FF] text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-1">
            <Star className="h-4 w-4 fill-current" />
            <span>Most Popular</span>
          </div>
        </div>
      )}

      <div className="text-center mb-8">
        <div
          className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${
            plan.name === "Free"
              ? "bg-gray-100 text-gray-600"
              : plan.name === "Premium"
              ? "bg-primary/10 text-primary"
              : "bg-gradient-to-br from-[#0052CC] to-[#A5D8FF] text-white"
          }`}
        >
          {plan.name === "Free" ? (
            <Star className="h-8 w-8" />
          ) : plan.name === "Premium" ? (
            <Crown className="h-8 w-8" />
          ) : (
            <Crown className="h-8 w-8 fill-current" />
          )}
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
        <p className="text-gray-600 mb-4">{plan.description}</p>

        <div className="mb-6">
          <span className="text-4xl font-bold text-gray-900">
            ${plan.price}
          </span>
          {plan.price > 0 && <span className="text-gray-600">/month</span>}
        </div>
      </div>

      <ul className="space-y-4 mb-8">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start space-x-3">
            <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={handleCheckout}
        className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 ${
          isPopular
            ? "bg-[#0052CC] text-white hover:bg-[#0052CC]/90 shadow-lg hover:shadow-xl"
            : "border-2 border-[#0052CC] text-[#0052CC] hover:bg-[#0052CC] hover:text-white"
        }`}
      >
        {plan.price === 0 ? "Get Started Free" : `Choose ${plan.name}`}
      </button>

      {plan.note && (
        <p className="text-xs text-gray-500 text-center mt-4">{plan.note}</p>
      )}
    </motion.div>
  );
};

export default PricingCard;
