import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import { BrainCircuit, Mail, Lock, User, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

const RegisterPage = () => {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setError("");
    setLoading(true);

    try {

      await authService.register(username, email, password);

      toast.success("Registration successful! Please login.");

      navigate("/login");

    } catch (err) {

      const message = err?.message || "Failed to register. Please try again.";
      setError(message);
      toast.error(message);

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">

      {/* background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[size:16px_16px] opacity-30"></div>

      <div className="relative w-full max-w-md px-6">

        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl shadow-xl shadow-slate-200/50 p-10">

          {/* Header */}
          <div className="text-center mb-10">

            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/25 mb-5">
              <BrainCircuit className="w-7 h-7 text-white" strokeWidth={2} />
            </div>

            <h1 className="text-2xl font-medium text-slate-900 tracking-tight mb-2">
              Create an account
            </h1>

            <p className="text-slate-500 text-sm">
              Start your AI-powered learning experience
            </p>

          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Username */}
            <div className="space-y-2">

              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
                Username
              </label>

              <div className="relative">

                <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none ${
                  focusedField === "username" ? "text-emerald-500" : "text-slate-400"
                }`}>

                  <User className="w-5 h-5" strokeWidth={2} />

                </div>

                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setFocusedField("username")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter username"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-white/60 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
                />

              </div>

            </div>

            {/* Email */}
            <div className="space-y-2">

              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
                Email
              </label>

              <div className="relative">

                <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none ${
                  focusedField === "email" ? "text-emerald-500" : "text-slate-400"
                }`}>

                  <Mail className="w-5 h-5" strokeWidth={2} />

                </div>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter email"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-white/60 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
                />

              </div>

            </div>

            {/* Password */}
            <div className="space-y-2">

              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
                Password
              </label>

              <div className="relative">

                <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none ${
                  focusedField === "password" ? "text-emerald-500" : "text-slate-400"
                }`}>

                  <Lock className="w-5 h-5" strokeWidth={2} />

                </div>

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter password"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-white/60 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
                />

              </div>

            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium shadow-lg shadow-emerald-500/30 hover:opacity-90 transition disabled:opacity-70"
            >

              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                </>
              )}

            </button>

          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-slate-200/60">

            <p className="text-center text-sm text-slate-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-emerald-600 hover:text-emerald-700 transition"
              >
                Sign in
              </Link>
            </p>

          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            By continuing, you agree to our Terms & Privacy Policy
          </p>

        </div>

      </div>

    </div>

  );
};

export default RegisterPage;