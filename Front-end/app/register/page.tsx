"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    user_type: "personal",
    company_name: "",
    company_category: "",
    company_email: ""
  });

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
    <div className="max-w-xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="username" placeholder="Username" required onChange={handleChange} className="w-full border p-2" />
        <input name="email" type="email" placeholder="Email" required onChange={handleChange} className="w-full border p-2" />
        <input name="password" type="password" placeholder="Password" required onChange={handleChange} className="w-full border p-2" />
        
        <select name="user_type" value={form.user_type} onChange={handleChange} className="w-full border p-2">
          <option value="personal">Personal</option>
          <option value="enterprise">Enterprise</option>
        </select>

        {form.user_type === "enterprise" && (
          <>
            <input name="company_name" placeholder="Company Name" onChange={handleChange} className="w-full border p-2" />
            <input name="company_category" placeholder="Company Category" onChange={handleChange} className="w-full border p-2" />
            <input name="company_email" placeholder="Company Email" onChange={handleChange} className="w-full border p-2" />
          </>
        )}

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">Register</button>
      </form>
    </div>
  );
}
