
"use client"
// pages/success.tsx (or app route)
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

export default function SuccessPage() {
  const { update } = useSession();
  const params = useSearchParams();

  useEffect(() => {
    async function refreshSession() {
      await update(); // forces jwt callback to refresh token (reads DB)
    }
    refreshSession();
  }, [update, params]);

  return <div>Payment success — subscription should be active now.</div>;
}
