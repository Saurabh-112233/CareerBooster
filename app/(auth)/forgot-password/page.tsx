"use client";

import { useState } from "react";
import { auth } from "@/firebase/client";
import { sendPasswordResetEmail } from "firebase/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email.");
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset link sent! Check your email.");
      router.push("/sign-in"); // Redirect back to sign-in
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="card-border w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl text-neutral-900 font-semibold text-center mb-4">Reset Password</h2>
        <p className="text-sm text-neutral-900 mb-6 text-center">
          Enter your email address and we&apos;ll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            className="w-full p-3 text-neutral-900 border border-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-600"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="submit"
            className="w-full p-3 bg-neutral-600 font-semibold text-neutral-900 rounded-lg hover:bg-neutral-500 transition"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
        <p className="text-sm text-gray-500 text-center mt-4">
          <a href="/sign-in" className="text-blue-900 hover:underline">
            Back to Sign In
          </a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
