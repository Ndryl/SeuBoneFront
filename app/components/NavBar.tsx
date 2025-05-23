"use client";

import { useRouter } from "next/navigation";

export default function NavBar() {
  const router = useRouter();
  return (
    <nav className="hidden md:flex h-16 w-full bg-[var(--brand-color-1)] items-center px-6">
      <img
        src="/logo.png"
        className="h-6 w-32"
        alt="Logo"
        onClick={() => router.push("/produtos")}
      />
    </nav>
  );
}
