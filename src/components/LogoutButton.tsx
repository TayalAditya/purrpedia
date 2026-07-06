"use client";
import { useTransition } from "react";
import { logoutAction } from "@/app/logout/actions";

export default function LogoutButton() {
  const [pending, start] = useTransition();
  return (
    <button
      onClick={() => start(() => logoutAction())}
      disabled={pending}
      className="text-xs font-mono text-[#6B7280] hover:text-red-400 transition-colors disabled:opacity-50"
    >
      {pending ? "Signing out..." : "Sign out"}
    </button>
  );
}
