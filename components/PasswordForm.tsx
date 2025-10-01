"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react"; // Spinner icon

interface PasswordFormProps {
  mode: "forgot" | "reset";
}

export default function PasswordForm({ mode }: PasswordFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (mode === "reset" && !token) setError("Invalid or missing token.");
  }, [mode, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "forgot") {
        if (!email) throw new Error("Email is required");

        const res = await fetch("/api/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to send reset link");

        setSuccessMessage("If an account exists, a reset link has been sent to your email.");
        setSuccessModal(true);
      } else {
        if (!password || !confirm) throw new Error("Please fill in all fields");
        if (password !== confirm) throw new Error("Passwords do not match");
        if (!token) throw new Error("Invalid token");

        const res = await fetch("/api/auth/reset-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, password }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Invalid or expired token");

        setSuccessMessage("Password reset successful! Redirecting to login...");
        setSuccessModal(true);

        setTimeout(() => router.push("/auth/signin"), 2000);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {mode === "forgot" ? (
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        ) : (
          <>
            <Input
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Confirm password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </>
        )}

        <Button type="submit" className="w-full flex items-center justify-center gap-2" disabled={loading}>
          {loading && <Loader2 className="animate-spin h-5 w-5" />}
          {mode === "forgot" ? "Send Reset Link" : "Reset Password"}
        </Button>
      </form>

      {/* Success Modal */}
      <Dialog open={successModal} onOpenChange={setSuccessModal}>
        <DialogContent className="max-w-md mx-auto p-6 rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle>Success</DialogTitle>
            <DialogDescription>{successMessage}</DialogDescription>
          </DialogHeader>
          <Button className="mt-4 w-full" onClick={() => setSuccessModal(false)}>
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
