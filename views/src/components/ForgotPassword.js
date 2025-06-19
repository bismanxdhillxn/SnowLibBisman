import { useState } from "react";
import { XCircle, CheckCircle, Lock } from "lucide-react";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleStart = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!email) return setError("Email is required");
    const res = await fetch("http://localhost:5000/api/forgot/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error || data.message);
    setSuccess(data.message);
    setStep(2);
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!otp || !newPassword || !confirmPassword) {
      return setError("All fields are required");
    }
    const res = await fetch("http://localhost:5000/api/forgot/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ otp, newPassword, confirmPassword }),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error);
    setSuccess(data.message);
    setStep(3);
  };

  return (
    <div className="relative top-24 max-w-md mx-auto p-6 bg-gray-100 rounded shadow-md">
      <div className="text-center mb-4">
        <Lock className="mx-auto text-blue-600 mb-2" size={36} />
        <h2 className="text-2xl font-bold">Forgot Password</h2>
        <p className="text-gray-600">Reset your password in a few steps</p>
      </div>
      {error && <div className="text-red-600 mb-4 flex items-center"><XCircle className="mr-1"/> {error}</div>}
      {success && <div className="text-green-600 mb-4 flex items-center"><CheckCircle className="mr-1"/> {success}</div>}

      {step === 1 && (
        <form onSubmit={handleStart} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border px-4 py-2 rounded focus:outline-blue-500"
            required
          />
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">Send OTP</button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text" placeholder="Enter OTP" value={otp}
            onChange={e => setOtp(e.target.value)}
            className="w-full border px-4 py-2 rounded focus:outline-blue-500" required
          />
          <input
            type="password" placeholder="New Password" value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            className="w-full border px-4 py-2 rounded focus:outline-blue-500" required
          />
          <input
            type="password" placeholder="Confirm Password" value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className="w-full border px-4 py-2 rounded focus:outline-blue-500" required
          />
          <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded">Reset Password</button>
        </form>
      )}

      {step === 3 && (
        <p className="text-center mt-4">
          Password reset successful—<a href="/" className="text-blue-600 hover:underline">Go to Login</a>
        </p>
      )}
    </div>
  );
}
