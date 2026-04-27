// components/NavbarWrapper.tsx
"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";

export default function NavbarWrapper() {
  const pathname = usePathname();

  const disabledRoutes = ["/login"];

  if (disabledRoutes.includes(pathname)) {
    return null;
  }

  return <Navbar />;
}