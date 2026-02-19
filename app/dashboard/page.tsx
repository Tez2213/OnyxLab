"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Plus, History, Rocket, Zap, ArrowRight, Clock } from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }),
};

// Mock recent activity — will be replaced with real data from backend
const recentActivity = [
  {
    id: "wf_001",
    prompt: "Monitor ETH/USD price and trigger a Chainlink Function when price drops 5%",
    status: "deployed",
    date: "Feb 19, 2026",
    txHash: "0xabc...def1",
  },
  {
    id: "wf_002",
    prompt: "Automate weekly LINK staking rewards claim and re-stake",
    status: "deployed",
    date: "Feb 17, 2026",
    txHash: "0xabc...def2",
  },
  {
    id: "wf_003",
    prompt: "Alert via webhook when a specific NFT collection floor price changes",
    status: "pending_payment",
    date: "Feb 16, 2026",
    txHash: null,
  },
];

const statusConfig = {
  deployed: { label: "Deployed", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
  pending_payment: { label: "Awaiting Payment", color: "text-amber-400 bg-amber-400/10 border-amber-400/20" },
  generating: { label: "Generating", color: "text-violet-400 bg-violet-400/10 border-violet-400/20" },
};

export default function DashboardPage() {
  const { isConnected, address } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (!isConnected) router.replace("/");
  }, [isConnected, router]);

  if (!isConnected) return null;

  const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 pt-28 pb-20">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="text-sm text-zinc-500 mb-1">Welcome back</p>
            <h1 className="text-3xl font-bold text-white">
              {shortAddress}
            </h1>
          </div>
          <Link
            href="/wizard"
            className="inline-flex items-center gap-2 self-start rounded-full bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-violet-500 hover:shadow-[0_0_20px_rgba(139,92,246,0.4)]"
          >
            <Plus className="h-4 w-4" /> New Workflow
          </Link>
        </motion.div>

        {/* Stats */}
        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          {[
            { icon: <Rocket className="h-5 w-5 text-violet-400" />, label: "Workflows Deployed", value: "2" },
            { icon: <Zap className="h-5 w-5 text-amber-400" />, label: "Total Paid (x402)", value: "0.004 ETH" },
            { icon: <Clock className="h-5 w-5 text-emerald-400" />, label: "Last Activity", value: "Feb 19, 2026" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              custom={i}
              initial="hidden"
              animate="show"
              variants={fadeUp}
              className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5"
            >
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900">
                {stat.icon}
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-zinc-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Recent Activity */}
        <motion.div custom={3} initial="hidden" animate="show" variants={fadeUp}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Recent Workflows</h2>
            <Link
              href="/history"
              className="inline-flex items-center gap-1 text-sm text-violet-400 hover:text-violet-300 transition-colors"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentActivity.map((item, i) => {
              const status = statusConfig[item.status as keyof typeof statusConfig];
              return (
                <motion.div
                  key={item.id}
                  custom={i + 4}
                  initial="hidden"
                  animate="show"
                  variants={fadeUp}
                  className="flex items-center justify-between gap-4 rounded-xl border border-zinc-800 bg-zinc-950 p-4 hover:border-zinc-700 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">{item.prompt}</p>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      {item.date}
                      {item.txHash && (
                        <span className="ml-2 font-mono text-zinc-600">{item.txHash}</span>
                      )}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium ${status.color}`}
                  >
                    {status.label}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Quick Start CTA */}
        <motion.div
          custom={8}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="mt-10 rounded-2xl border border-violet-500/20 bg-violet-600/5 p-8 text-center"
        >
          <History className="mx-auto mb-3 h-8 w-8 text-violet-400" />
          <h3 className="mb-2 text-lg font-semibold text-white">Start a new automation</h3>
          <p className="mb-6 text-sm text-zinc-400">
            Describe any Web3 workflow — the AI will design, propose, and deploy it for you.
          </p>
          <Link
            href="/wizard"
            className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-violet-500"
          >
            <Plus className="h-4 w-4" /> New Workflow
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
