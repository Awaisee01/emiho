
"use client"
import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { CheckCircle2, Crown, ArrowRight } from "lucide-react";

export default function SuccessPage() {
  const { data: session, update } = useSession();
  const params = useSearchParams();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(true);
  const [dbPlan, setDbPlan] = useState<string | null>(null);

  const checkoutId = useMemo(() => params.get("session_id"), [params]);

  useEffect(() => {
    let mounted = true;
    let tries = 0;

    const poll = async () => {
      try {
        if (tries === 0) {
          // Attempt server-side confirmation if webhook is delayed locally
          if (checkoutId) {
            try {
              await fetch('/api/checkout/confirm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ session_id: checkoutId })
              });
            } catch (_) {}
          }
          await update();
        }
        const res = await fetch('/api/user/profile', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          const plan: string | undefined = data?.user?.subscription?.plan;
          if (plan && plan !== 'Free') {
            if (!mounted) return;
            setDbPlan(plan);
            setRefreshing(false);
            // Sync session once when DB shows paid
            await update();
            return; // stop polling
          }
        }
      } catch (_) {}

      if (!mounted && true) return;
      tries += 1;
      if (tries < 15) {
        setTimeout(poll, 2000);
      } else {
        // stop after ~30s
        if (mounted) setRefreshing(false);
      }
    };

    poll();
    return () => {
      mounted = false;
    };
  }, [update, checkoutId]);

  const plan = dbPlan || (session?.user as any)?.subscription?.plan || "Free";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full p-8 text-center border border-gray-100">
        <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Payment Successful</h1>
        <p className="text-gray-600 mb-6">Thank you! Your subscription is now active.</p>

        <div className="flex items-center justify-center gap-2 mb-6">
          <Crown className="h-5 w-5 text-yellow-500" />
          <span className="text-sm text-gray-700">Current Plan:</span>
          <span className="text-sm font-semibold">{refreshing ? "Updating..." : plan}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => router.push("/profile")}
            className="w-full py-3 rounded-xl bg-[#0052CC] text-white font-semibold hover:bg-[#0052CC]/90 transition-colors flex items-center justify-center gap-2"
          >
            Go to Profile <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => router.push("/")}
            className="w-full py-3 rounded-xl border border-gray-200 font-semibold hover:bg-gray-50 transition-colors"
          >
            Explore Emiho
          </button>
        </div>

        {checkoutId && (
          <p className="text-xs text-gray-400 mt-6">Ref: {checkoutId}</p>
        )}
      </div>
    </div>
  );
}
