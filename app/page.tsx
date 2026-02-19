"use client";

import Link from "next/link";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Zap, ArrowRight, GitBranch, CreditCard, Rocket, MessageSquare, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const steps = [
  {
    icon: <MessageSquare className="h-6 w-6 text-violet-400" />,
    num: "01",
    title: "Describe in Plain English",
    desc: "Tell the AI what Web3 automation you need — no code required. Speak to it like a teammate.",
  },
  {
    icon: <GitBranch className="h-6 w-6 text-violet-400" />,
    num: "02",
    title: "Review the Architecture",
    desc: "The AI generates a Mermaid.js flow diagram of the proposed workflow. Approve or ask for changes — it iterates until you're satisfied.",
  },
  {
    icon: <CreditCard className="h-6 w-6 text-violet-400" />,
    num: "03",
    title: "Unlock with Microtransaction",
    desc: "Once the architecture is approved, the agent issues an x402 payment request. Pay once to unlock code generation.",
  },
  {
    icon: <Rocket className="h-6 w-6 text-violet-400" />,
    num: "04",
    title: "Auto-Deploy to CRE",
    desc: "The agent writes and deploys your custom workflow directly into the Chainlink Runtime Environment. Zero manual steps.",
  },
];

const features = [
  {
    title: "Zero-code Automation",
    desc: "No Solidity, no YAML, no CLI. Describe the logic and the agent handles everything from architecture to deployment.",
  },
  {
    title: "Iterative AI Design",
    desc: "The agent proposes, you react. The architecture loop ensures the final design is exactly what you envisioned.",
  },
  {
    title: "x402 Payment Protocol",
    desc: "Secure microtransaction gate prevents abuse and ties each workflow to a verified on-chain payment.",
  },
  {
    title: "Native CRE Deployment",
    desc: "Workflows are generated specifically for the Chainlink Runtime Environment and deployed directly — live in seconds.",
  },
  {
    title: "Full Audit Trail",
    desc: "Every prompt, proposal, payment, and deployed workflow is stored in your history for full transparency.",
  },
  {
    title: "Powered by Gemini",
    desc: "Google Gemini's reasoning engine drives the AI agent, ensuring high-quality, production-grade code generation.",
  },
];

export default function LandingPage() {
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800/60 bg-black/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight">
              Onyx<span className="text-violet-400">Lab</span>
            </span>
          </div>
          <ConnectButton accountStatus="avatar" chainStatus="none" showBalance={false} />
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-16 text-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[600px] w-[600px] rounded-full bg-violet-600/10 blur-[120px]" />
        </div>

        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="relative z-10 max-w-4xl"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-300">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
            Powered by Gemini · Chainlink CRE · x402 Protocol
          </div>

          <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight text-white md:text-7xl">
            Build Web3 automation{" "}
            <span className="bg-gradient-to-r from-violet-400 to-purple-300 bg-clip-text text-transparent">
              by describing it.
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-zinc-400 md:text-xl">
            OnyxLab is an autonomous prompt-to-product platform. Describe any blockchain
            automation in plain English — the AI designs it, you approve it, pay once,
            and it deploys directly to the Chainlink Runtime Environment.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            {isConnected ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-violet-500 hover:shadow-[0_0_24px_rgba(139,92,246,0.4)]"
              >
                Go to Dashboard <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <ConnectButton.Custom>
                {({ openConnectModal }) => (
                  <button
                    onClick={openConnectModal}
                    className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-violet-500 hover:shadow-[0_0_24px_rgba(139,92,246,0.4)]"
                  >
                    Connect Wallet to Launch <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </ConnectButton.Custom>
            )}
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-full border border-zinc-700 px-8 py-3.5 text-base font-medium text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
            >
              See how it works
            </a>
          </div>
        </motion.div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-32 px-6">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-16 text-center"
          >
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-violet-400">
              The Flow
            </p>
            <h2 className="text-4xl font-bold text-white md:text-5xl">How OnyxLab works</h2>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                custom={i}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeUp}
                className="relative rounded-2xl border border-zinc-800 bg-zinc-950 p-6 hover:border-zinc-700 transition-colors"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600/10 border border-violet-500/20">
                    {step.icon}
                  </div>
                  <span className="text-2xl font-bold text-zinc-800">{step.num}</span>
                </div>
                <h3 className="mb-2 text-base font-semibold text-white">{step.title}</h3>
                <p className="text-sm leading-relaxed text-zinc-500">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-32 px-6 border-t border-zinc-900">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-16 text-center"
          >
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-violet-400">
              Why OnyxLab
            </p>
            <h2 className="text-4xl font-bold text-white md:text-5xl">
              Everything you need, nothing you don&apos;t.
            </h2>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                custom={i}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeUp}
                className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 hover:border-zinc-700 transition-colors"
              >
                <CheckCircle className="mb-4 h-5 w-5 text-violet-400" />
                <h3 className="mb-2 text-base font-semibold text-white">{f.title}</h3>
                <p className="text-sm leading-relaxed text-zinc-500">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 border-t border-zinc-900">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            Ready to automate?
          </h2>
          <p className="mb-10 text-lg text-zinc-400">
            Connect your wallet, describe your workflow, and go live on Chainlink CRE in minutes.
          </p>
          {isConnected ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-10 py-4 text-base font-semibold text-white transition-all hover:bg-violet-500 hover:shadow-[0_0_32px_rgba(139,92,246,0.4)]"
            >
              Open Dashboard <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <ConnectButton.Custom>
              {({ openConnectModal }) => (
                <button
                  onClick={openConnectModal}
                  className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-10 py-4 text-base font-semibold text-white transition-all hover:bg-violet-500 hover:shadow-[0_0_32px_rgba(139,92,246,0.4)]"
                >
                  Connect Wallet <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </ConnectButton.Custom>
          )}
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-10 px-6 text-center text-sm text-zinc-600">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Zap className="h-4 w-4 text-violet-600" />
          <span className="font-medium text-zinc-400">OnyxLab</span>
        </div>
        <p>Autonomous Web3 automation · Powered by Gemini · Built on Chainlink CRE</p>
      </footer>
    </div>
  );
}
