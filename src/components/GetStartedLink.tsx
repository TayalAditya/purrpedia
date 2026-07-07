"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function GetStartedLink({ className }: { className?: string }) {
  const [href, setHref] = useState("/login");

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((s) => {
        if (s?.user) setHref("/dashboard");
      })
      .catch(() => {});
  }, []);

  return (
    <Link href={href} className={className}>
      Get Started →
    </Link>
  );
}
