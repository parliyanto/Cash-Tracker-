import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error("Invalid credentials");
      return;
    }

    toast.success("Login successful 🎉");
    navigate("/dashboard");
  };

return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">

    <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-3xl shadow-2xl w-96 animate-fadeIn">

      {/* Logo */}
      <div className="flex items-center justify-center mb-6">
        <div className="bg-emerald-500 text-white p-4 rounded-full text-2xl shadow-lg animate-bounce">
          💰
        </div>
      </div>

      <h2 className="text-3xl font-semibold text-center mb-8 text-white tracking-wide">
        Cash Tracker
      </h2>

      {/* EMAIL FIELD */}
      <div className="relative mb-6">
        <label className="absolute -top-3 left-3 text-xs bg-slate-900 px-2 text-emerald-400">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:scale-[1.02] transition-all duration-300"
          placeholder="Enter your email"
        />
      </div>

      {/* PASSWORD FIELD */}
      <div className="relative mb-8">
        <label className="absolute -top-3 left-3 text-xs bg-slate-900 px-2 text-emerald-400">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:scale-[1.02] transition-all duration-300"
          placeholder="Enter your password"
        />
      </div>

      <button
        onClick={handleLogin}
        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-xl font-semibold tracking-wide transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] shadow-lg"
      >
        Login
      </button>

    </div>
  </div>
);
}

export default Login;