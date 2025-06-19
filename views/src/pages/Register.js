import { useEffect, useState } from "react";
// import Sidebar from "../components/Sidebar";
import { UserPlus, CheckCircle, XCircle } from "lucide-react";

export default function Register() {
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    roleId: "",
  });

  // 2FA states
  const [step, setStep] = useState(1);    // 1 = fill form, 2 = enter OTP, 3 = done
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/roles");
      const data = await res.json();
      setRoles(data);
    } catch (err) {
      console.error("Error fetching roles:", err);
    }
  };

  const handleChange = (e) => {
    setError("");
    if (step === 1) {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    } else {
      setOtp(e.target.value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (step === 1) {
      // Validate form
      if (!formData.name || !formData.email || !formData.password || !formData.roleId) {
        setError("All fields are required.");
        return;
      }
      // Start OTP registration
      try {
        const res = await fetch("http://localhost:5000/api/otp/register-start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to send OTP");
        setSuccess("OTP sent to your email. Please enter it below.");
        setStep(2);
      } catch (err) {
        setError(err.message);
      }
    } else if (step === 2) {
      // Verify OTP
      if (!otp) {
        setError("Please enter the OTP.");
        return;
      }
      try {
        const res = await fetch("http://localhost:5000/api/otp/register-verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ otp }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "OTP verification failed");
        setSuccess("Registration complete! You can now log in.");
        setStep(3);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* <Sidebar /> */}
      <main className="flex-1 p-6 bg-indigo-50">
        <header className="bg-white shadow-md p-4 rounded-lg flex justify-between items-center mb-6 mt-16">
          <h1 className="text-2xl font-bold text-gray-800">User Registration</h1>
        </header>

        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
              <XCircle size={20} className="mr-2" /> {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex items-center">
              <CheckCircle size={20} className="mr-2" /> {success}
            </div>
          )}

          {/* Step 1: Registration form */}
          {step === 1 && (
            <>
              <h2 className="text-xl font-semibold text-center text-gray-700 mb-4">
                Create Your Account
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
                  required
                />
                <select
                  name="roleId"
                  value={formData.roleId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
                  required
                >
                  <option value="">Select Role</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-indigo-700 transition duration-300 flex justify-center items-center"
                >
                  <UserPlus size={20} className="inline mr-2" /> Register
                </button>
              </form>
            </>
          )}

          {/* Step 2: OTP form */}
          {step === 2 && (
            <>
              <h2 className="text-xl font-semibold text-center text-gray-700 mb-4">
                Enter OTP
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="otp"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-indigo-700 transition duration-300"
                >
                  Verify OTP
                </button>
              </form>
            </>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <p className="text-center text-green-700 font-semibold mt-6">
              Registration complete! You can now{" "}
              <a href="/" className="text-indigo-600 hover:underline">
                login here
              </a>.
            </p>
          )}

          {/* "Already have an account?" only on step 1 */}
          {step === 1 && (
            <p className="text-center text-gray-600 mt-4">
              Already have an account?{" "}
              <a href="/" className="text-indigo-600 hover:underline">
                Login here
              </a>
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
