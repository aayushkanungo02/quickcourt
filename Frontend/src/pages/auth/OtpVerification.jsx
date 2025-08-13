import React, { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { axiosInstance } from "@/lib/axios";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

export default function OtpVerification() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(""); // NEW state for invalid OTP message
  const navigate = useNavigate();

  const email = useMemo(() => {
    try {
      return sessionStorage.getItem("pendingEmail") || "";
    } catch {
      return "";
    }
  }, []);

  const { mutate: verifyMutate, isPending } = useMutation({
    mutationFn: async () =>
      axiosInstance.post("/auth/verify-otp", { email, otp }),
    onSuccess: (res) => {
      try {
        sessionStorage.removeItem("pendingEmail");
      } catch {}
      const role = res?.data?.user?.role;
      if (role === "Facility Owner") {
        navigate("/owner");
      } else {
        navigate("/");
      }
    },
    onError: (err) => {
      console.error(err?.response?.data || err?.message);
      setErrorMsg("Invalid OTP"); // Set error message on failure
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg(""); // clear previous error
    setLoading(true);
    verifyMutate(undefined, { onSettled: () => setLoading(false) });
  };

  const handleResend = async () => {
    // Optional: Implement resend endpoint if available on backend
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Side - Image */}
      <div className="hidden md:flex flex-1 bg-gray-100 border-r border-gray-300 h-screen overflow-hidden">
        <img
          src="/login.jpg"
          alt="Sign Up Illustration"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Side - OTP Form */}
      <div className="flex flex-1 items-center justify-center p-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md space-y-5"
        >
          <h2 className="text-2xl font-bold text-center">OTP Verification</h2>

          <p className="mt-6 text-gray-700 text-sm text-center px-4">
            Enter the OTP sent to your registered email to verify your account.
          </p>

          <div className="space-y-2">
            <Label htmlFor="otp">Enter OTP</Label>
            <Input
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              placeholder="Enter 6-digit OTP"
              className="text-center tracking-widest font-semibold"
            />
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="text-red-500 text-sm font-medium text-center">
              {errorMsg}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading || isPending}
            className="w-full"
          >
            {loading || isPending ? "Verifying..." : "Verify OTP"}
          </Button>

          <div className="text-sm text-center text-gray-600 space-y-2">
            <p>
              Didn’t receive the OTP?{" "}
              <button
                type="button"
                onClick={handleResend}
                className="text-blue-500 hover:underline font-medium"
              >
                Resend OTP
              </button>
            </p>
            <p>
              Entered wrong email?{" "}
              <Link
                to="/signup"
                className="text-blue-500 hover:underline font-medium"
              >
                Change Email
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
