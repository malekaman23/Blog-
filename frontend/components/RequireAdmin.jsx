"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchMe } from "../lib/auth";

export default function RequireAdmin({ children }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetchMe().then((user) => {
      if (!user) {
        router.replace("/admin/login");
      } else {
        setChecking(false);
      }
    });
  }, [router]);

  if (checking) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-10 text-muted">
        Checking access…
      </div>
    );
  }

  return children;
}
