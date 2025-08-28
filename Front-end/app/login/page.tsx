"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import * as THREE from "three";

export default function Login() {
  const router = useRouter();
  const vantaRef = useRef<HTMLDivElement>(null);
  const [vantaEffect, setVantaEffect] = useState<any>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Optional: Vanta.js 3D animated background (same logic as Register)
  useEffect(() => {
    if (!vantaEffect) {
      import("vanta/src/vanta.net").then((VANTA) => {
        setVantaEffect(
          VANTA.default({
            el: vantaRef.current!,
            THREE,
            mouseControls: true,
            touchControls: true,
            minHeight: 200.0,
            minWidth: 200.0,
            scale: 1.0,
            scaleMobile: 1.0,
            color: 0x9129ff,
            backgroundColor: 0x0a021e,
          })
        );
      });
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("http://localhost:8000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.access_token);
      const decoded = jwtDecode<{ username: string }>(data.access_token);
      alert("Login successful");
      router.push("/dashboard");
    } else {
      alert(data.detail || "Login failed");
    }
  };

  return (
    <div ref={vantaRef} className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-6 text-white text-3xl font-bold font-mono tracking-wide z-10">
        Evaluno <span className="text-purple-400">AI</span>
      </div>

      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-8 z-10 text-white">
        <h2 className="text-3xl font-extrabold text-center mb-6 drop-shadow-glow">Welcome Back</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="input-glow"
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="input-glow"
          />
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 transition-all duration-300 shadow-purple-glow font-semibold tracking-wider text-white"
          >
            Login
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
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => router.push("/register")}
            className="text-purple-400 hover:underline font-semibold"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
