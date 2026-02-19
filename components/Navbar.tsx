"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Zap } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800/60 bg-black/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 group-hover:bg-violet-500 transition-colors">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-white">
            Onyx<span className="text-violet-400">Lab</span>
          </span>
        </Link>

        {/* Nav Links (inner pages only) */}
        {!isLanding && (
          <div className="hidden md:flex items-center gap-1">
            <NavLink href="/dashboard" current={pathname}>Dashboard</NavLink>
            <NavLink href="/wizard" current={pathname}>New Workflow</NavLink>
            <NavLink href="/history" current={pathname}>History</NavLink>
            <NavLink href="/architecture" current={pathname}>Architecture</NavLink>
          </div>
        )}

        {/* Wallet */}
        <ConnectButton
          accountStatus="avatar"
          chainStatus="none"
          showBalance={false}
        />
      </div>
    </nav>
  );
}

function NavLink({
  href,
  current,
  children,
}: {
  href: string;
  current: string;
  children: React.ReactNode;
}) {
  const active = current === href;
  return (
    <Link
      href={href}
      className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
        active
          ? "bg-zinc-800 text-white"
          : "text-zinc-400 hover:text-white hover:bg-zinc-900"
      }`}
    >
      {children}
    </Link>
  );
}
