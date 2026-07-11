"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.replace("/admin/newsletter");
        router.refresh();
        return;
      }
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Incorrect password");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-6 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-olive-100 text-olive-700">
        <Lock size={24} />
      </span>
      <h1 className="mt-5 font-serif text-2xl font-medium text-olive-950">Newsletter Admin</h1>
      <p className="mt-2 text-sm text-olive-700">Enter the password to continue.</p>

      <form onSubmit={handleSubmit} className="mt-6 w-full">
        <input
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full rounded-full border border-olive-300 bg-cream-100 px-5 py-3 text-center text-sm text-olive-950 outline-none transition-shadow focus:border-terracotta-500 focus:ring-4 focus:ring-terracotta-500/15"
        />
        {error && <p className="mt-3 text-sm font-medium text-terracotta-600">{error}</p>}
        <button
          type="submit"
          disabled={loading || !password}
          className="mt-4 w-full rounded-full bg-terracotta-500 px-6 py-3 text-sm font-semibold text-cream-50 transition-colors hover:bg-terracotta-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Checking…" : "Log In"}
        </button>
      </form>
    </div>
  );
}
