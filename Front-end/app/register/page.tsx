"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import * as THREE from "three";

export default function Register() {
  const router = useRouter();
  const vantaRef = useRef<HTMLDivElement>(null);
  const [vantaEffect, setVantaEffect] = useState<any>(null);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    user_type: "personal",
    company_name: "",
    company_category: "",
    company_email: ""
  });

 useEffect(() => {
  if (!vantaEffect) {
    const loadVanta = async () => {
      const VANTA = await import('vanta/src/vanta.globe');
      setVantaEffect(
        VANTA.default({
          el: vantaRef.current!,
          THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          color: 0x9129ff,
          backgroundColor: 0x0a021e,
        })
      );
    };
    loadVanta();
  }

  return () => {
    if (vantaEffect) vantaEffect.destroy();
  };
}, [vantaEffect]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: any = {
      username: form.username,
      email: form.email,
      password: form.password,
      user_type: form.user_type,
    };

    if (form.user_type === "enterprise") {
      payload.enterprise_info = {
        company_name: form.company_name,
        company_category: form.company_category,
        company_email: form.company_email
      };
    }

    const res = await fetch("http://localhost:8000/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (res.ok) {
      alert("Registered successfully!");
      router.push("/login");
    } else {
      alert(data.detail || "Registration failed");
    }
  };

  return (
    <div ref={vantaRef} className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-6 text-white text-3xl font-bold font-mono tracking-wide z-10">
        Evaluno <span className="text-purple-400">AI</span>
      </div>

      <div className="w-full max-w-xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-8 text-white z-10">
        <h2 className="text-3xl font-extrabold text-center mb-6 drop-shadow-glow">Create Account</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input name="username" placeholder="Username" required onChange={handleChange} className="input-glow" />
          <input name="email" type="email" placeholder="Email" required onChange={handleChange} className="input-glow" />
          <input name="password" type="password" placeholder="Password" required onChange={handleChange} className="input-glow" />
          
          <select name="user_type" value={form.user_type} onChange={handleChange} className="input-glow bg-transparent">
            <option value="personal" className="text-black">Personal</option>
            <option value="enterprise" className="text-black">Enterprise</option>
          </select>

          {form.user_type === "enterprise" && (
            <>
              <input name="company_name" placeholder="Company Name" onChange={handleChange} className="input-glow" />
              <input name="company_category" placeholder="Company Category" onChange={handleChange} className="input-glow" />
              <input name="company_email" placeholder="Company Email" onChange={handleChange} className="input-glow" />
            </>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 transition-all duration-300 shadow-purple-glow font-semibold tracking-wider text-white"
          >
            Sign Up
          </button>
        </form>
        <div className="mt-2 text-center text-white/70">
  <button
    type="button"
    onClick={() => router.push("/")}
    className="text-purple-400 hover:underline font-semibold inline-flex items-center gap-1"
  >
    ← Back to Home
  </button>
</div>


        <div className="mt-4 text-center text-white/70">
  Already have an account?{" "}
  <button
    type="button"
    onClick={() => router.push("/login")}
    className="text-purple-400 hover:underline font-semibold"
  >
    Sign In
  </button>
</div>
      </div>
    </div>
  );
}
