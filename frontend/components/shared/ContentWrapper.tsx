"use client";

import { usePathname } from "next/navigation";

export default function ContentWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <main className={isLoginPage ? "w-full" : "max-w-7xl mx-auto w-full p-6"}>
      {children}
    </main>
  );
}