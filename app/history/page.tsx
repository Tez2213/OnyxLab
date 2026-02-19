"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import Navbar from "@/components/Navbar";
import { Search, ChevronDown, ChevronUp, ExternalLink, Rocket, CreditCard, MessageSquare, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// Mock history data — replace with real backend fetch
const MOCK_HISTORY = [
  {
    id: "wf_001",
    prompt: "Monitor ETH/USD price and trigger a Chainlink Function when price drops 5% in an hour",
    status: "deployed",
    date: "Feb 19, 2026",
    txHash: "0xa3f9b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9",
    workflowId: "cre_wf_a1b2c3d4",
    paymentAmount: "0.002 ETH",
    iterations: 1,
  },
  {
    id: "wf_002",
    prompt: "Automate weekly LINK staking rewards claim and re-stake to compound",
    status: "deployed",
    date: "Feb 17, 2026",
    txHash: "0xb4a8c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6",
    workflowId: "cre_wf_e5f6a7b8",
    paymentAmount: "0.002 ETH",
    iterations: 2,
  },
  {
    id: "wf_003",
    prompt: "Alert via webhook when a specific NFT collection floor price changes by more than 10%",
    status: "pending_payment",
    date: "Feb 16, 2026",
    txHash: null,
    workflowId: null,
    paymentAmount: "0.002 ETH",
    iterations: 1,
  },
  {
    id: "wf_004",
    prompt: "Fetch real-time weather data from an external API and trigger a smart contract payout when temperature exceeds a defined threshold",
    status: "deployed",
    date: "Feb 14, 2026",
    txHash: "0xc5b9d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7",
    workflowId: "cre_wf_c9d0e1f2",
    paymentAmount: "0.002 ETH",
    iterations: 3,
  },
];

const statusConfig = {
  deployed: {
    label: "Deployed",
    color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    dot: "bg-emerald-400",
  },
  pending_payment: {
    label: "Awaiting Payment",
    color: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    dot: "bg-amber-400",
  },
  generating: {
    label: "Generating",
    color: "text-violet-400 bg-violet-400/10 border-violet-400/20",
    dot: "bg-violet-400",
  },
};

type FilterStatus = "all" | "deployed" | "pending_payment";

function HistoryRow({ item }: { item: typeof MOCK_HISTORY[0] }) {
  const [expanded, setExpanded] = useState(false);
  const status = statusConfig[item.status as keyof typeof statusConfig];

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden transition-colors hover:border-zinc-700">
      {/* Row header */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-4 p-4 text-left"
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">{item.prompt}</p>
          <p className="mt-0.5 text-xs text-zinc-500">{item.date}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${status.color}`}>
            <span className={`inline-block h-1.5 w-1.5 rounded-full mr-1.5 ${status.dot}`} />
            {status.label}
          </span>
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-zinc-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-zinc-500" />
          )}
        </div>
      </button>

      {/* Expanded details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-zinc-800 px-4 py-4 grid gap-4 sm:grid-cols-3">
              {/* Prompt */}
              <div className="sm:col-span-3">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="h-3.5 w-3.5 text-violet-400" />
                  <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Prompt</span>
                </div>
                <p className="text-sm text-zinc-300 leading-relaxed">{item.prompt}</p>
              </div>

              {/* Payment */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="h-3.5 w-3.5 text-amber-400" />
                  <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Payment</span>
                </div>
                <p className="text-sm font-semibold text-white">{item.paymentAmount}</p>
                {item.txHash ? (
                  <a
                    href={`#${item.txHash}`}
                    className="mt-1 flex items-center gap-1 text-xs text-zinc-500 hover:text-violet-400 transition-colors"
                  >
                    <span className="font-mono">{item.txHash.slice(0, 18)}…</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <p className="mt-1 text-xs text-amber-400">Not yet paid</p>
                )}
              </div>

              {/* Workflow */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Rocket className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Workflow</span>
                </div>
                {item.workflowId ? (
                  <>
                    <p className="text-sm font-mono text-violet-300">{item.workflowId}</p>
                    <p className="mt-1 text-xs text-emerald-400">● Live on CRE</p>
                  </>
                ) : (
                  <p className="text-sm text-zinc-500">Not deployed yet</p>
                )}
              </div>

              {/* Iterations */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Arch. Iterations</span>
                </div>
                <p className="text-sm text-white">{item.iterations} revision{item.iterations !== 1 ? "s" : ""}</p>
              </div>

              {/* Actions */}
              {item.status === "pending_payment" && (
                <div className="sm:col-span-3">
                  <Link
                    href="/wizard"
                    className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-5 py-2 text-xs font-semibold text-white transition-all hover:bg-violet-500"
                  >
                    Complete Payment & Deploy
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function HistoryPage() {
  const { isConnected } = useAccount();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterStatus>("all");

  useEffect(() => {
    if (!isConnected) router.replace("/");
  }, [isConnected, router]);

  if (!isConnected) return null;

  const filtered = MOCK_HISTORY.filter((item) => {
    const matchSearch = item.prompt.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || item.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="mx-auto max-w-4xl px-6 pt-28 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="text-sm text-zinc-500 mb-1">Your automation history</p>
            <h1 className="text-3xl font-bold text-white">History</h1>
          </div>
          <Link
            href="/wizard"
            className="inline-flex items-center gap-2 self-start rounded-full bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-violet-500"
          >
            <Plus className="h-4 w-4" /> New Workflow
          </Link>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-6 flex flex-col gap-3 sm:flex-row"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search workflows…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 pl-9 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-colors"
            />
          </div>
          <div className="flex gap-2">
            {(["all", "deployed", "pending_payment"] as FilterStatus[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                  filter === f
                    ? "border-violet-500 bg-violet-600/10 text-violet-300"
                    : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white hover:border-zinc-700"
                }`}
              >
                {f === "all" ? "All" : f === "deployed" ? "Deployed" : "Pending"}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.08 }}
          className="mb-4 text-xs text-zinc-500"
        >
          {filtered.length} workflow{filtered.length !== 1 ? "s" : ""}
          {filter !== "all" && ` · filtered by "${filter}"`}
          {search && ` · matching "${search}"`}
        </motion.div>

        {/* List */}
        <div className="space-y-3">
          {filtered.length > 0 ? (
            filtered.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <HistoryRow item={item} />
              </motion.div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Search className="h-8 w-8 text-zinc-700 mb-3" />
              <p className="text-zinc-400 font-medium">No workflows found</p>
              <p className="text-sm text-zinc-600 mt-1">
                {search ? "Try a different search term" : "Start with a new workflow"}
              </p>
              {!search && (
                <Link
                  href="/wizard"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-500 transition-colors"
                >
                  <Plus className="h-4 w-4" /> New Workflow
                </Link>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
