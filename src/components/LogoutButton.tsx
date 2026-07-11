"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.replace("/admin/login");
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-olive-300 bg-cream-50 px-4 py-2 text-sm font-semibold text-olive-800 transition-colors hover:border-olive-400 hover:bg-olive-100"
    >
      <LogOut size={15} /> Log out
    </button>
  );
}
