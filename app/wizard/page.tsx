"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import { Check, ChevronRight, Loader2, RefreshCw, CreditCard, Rocket, MessageSquare, GitBranch, CheckCircle2, XCircle, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Lazy-load Mermaid (client-only, heavy)
const MermaidDiagram = dynamic(() => import("@/components/MermaidDiagram"), { ssr: false });

// --- Step config ---
const STEPS = [
  { id: 1, label: "Describe", icon: <MessageSquare className="h-4 w-4" /> },
  { id: 2, label: "Review", icon: <GitBranch className="h-4 w-4" /> },
  { id: 3, label: "Pay", icon: <CreditCard className="h-4 w-4" /> },
  { id: 4, label: "Deploy", icon: <Rocket className="h-4 w-4" /> },
];

// --- Mock Gemini response (replace with real API call) ---
const MOCK_MERMAID = `flowchart TD
  A([User Trigger]) --> B[Chainlink Function: Fetch ETH/USD Price]
  B --> C{Price < Threshold?}
  C -- Yes --> D[x402 Payment Verification]
  D --> E[Emit On-Chain Alert Event]
  E --> F([Webhook Notification])
  C -- No --> G([Wait for next interval])
  style A fill:#7c3aed,color:#fff,stroke:#6d28d9
  style F fill:#059669,color:#fff,stroke:#047857
  style G fill:#374151,color:#fff,stroke:#4b5563`;

async function mockGenerateArchitecture(prompt: string): Promise<string> {
  await new Promise((r) => setTimeout(r, 2200));
  return MOCK_MERMAID;
}

async function mockProcessPayment(amount: string): Promise<{ txHash: string }> {
  await new Promise((r) => setTimeout(r, 2500));
  return { txHash: `0x${Math.random().toString(16).slice(2, 42)}` };
}

async function mockDeploy(prompt: string): Promise<{ workflowId: string }> {
  await new Promise((r) => setTimeout(r, 3500));
  return { workflowId: `cre_wf_${Math.random().toString(36).slice(2, 10)}` };
}

// --- Step Indicator ---
function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-12">
      {STEPS.map((step, i) => {
        const done = current > step.id;
        const active = current === step.id;
        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                  done
                    ? "border-violet-500 bg-violet-600 text-white"
                    : active
                    ? "border-violet-400 bg-violet-600/20 text-violet-300"
                    : "border-zinc-700 bg-zinc-900 text-zinc-600"
                }`}
              >
                {done ? <Check className="h-4 w-4" /> : step.icon}
              </div>
              <span
                className={`text-xs font-medium hidden sm:block ${
                  active ? "text-violet-300" : done ? "text-zinc-400" : "text-zinc-600"
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`mx-2 h-0.5 w-12 sm:w-20 transition-colors duration-300 mt-[-10px] ${
                  done ? "bg-violet-600" : "bg-zinc-800"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// --- Step 1: Prompt ---
function Step1({
  onSubmit,
}: {
  onSubmit: (prompt: string) => void;
}) {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  const examples = [
    "Monitor ETH/USD price and trigger a Chainlink Function when it drops 5% in an hour",
    "Automate weekly LINK staking rewards claim and re-stake to compound",
    "Fetch weather API data on-chain and trigger a payout smart contract if temperature exceeds threshold",
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    setLoading(true);
    onSubmit(value.trim());
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl mx-auto"
    >
      <h2 className="text-2xl font-bold text-white mb-2">Describe your automation</h2>
      <p className="text-zinc-400 mb-8">
        Tell the AI what Web3 workflow you want to build in plain English. Be as detailed or as high-level as you like.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          className="w-full h-36 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white placeholder-zinc-500 resize-none outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/40 transition-colors"
          placeholder="e.g. Automatically claim and restake my Chainlink staking rewards every 7 days..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={loading}
        />

        <div className="space-y-2">
          <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Try an example</p>
          {examples.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => setValue(ex)}
              className="block w-full text-left rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-400 hover:border-zinc-700 hover:text-white transition-colors"
            >
              {ex}
            </button>
          ))}
        </div>

        <button
          type="submit"
          disabled={!value.trim() || loading}
          className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-violet-600 py-3 text-sm font-semibold text-white transition-all hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Generating architecture…
            </>
          ) : (
            <>
              Generate Architecture <ChevronRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}

// --- Step 2: Architecture Review ---
function Step2({
  prompt,
  diagram,
  onApprove,
  onReject,
}: {
  prompt: string;
  diagram: string | null;
  onApprove: () => void;
  onReject: () => void;
}) {
  const [rejecting, setRejecting] = useState(false);
  const [feedback, setFeedback] = useState("");

  function handleReject(e: React.FormEvent) {
    e.preventDefault();
    setRejecting(false);
    setFeedback("");
    onReject();
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-3xl mx-auto"
    >
      <h2 className="text-2xl font-bold text-white mb-2">Proposed Architecture</h2>
      <p className="text-zinc-400 mb-6">
        The AI has designed this workflow for your request. Review the flow and approve it to continue, or request changes.
      </p>

      <div className="mb-4 rounded-xl border border-zinc-800 bg-zinc-950 p-3">
        <p className="text-xs text-zinc-500 font-medium mb-1">Your request</p>
        <p className="text-sm text-zinc-300">{prompt}</p>
      </div>

      {diagram ? (
        <MermaidDiagram chart={diagram} />
      ) : (
        <div className="flex h-48 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950">
          <Loader2 className="h-6 w-6 animate-spin text-violet-400" />
        </div>
      )}

      {!rejecting ? (
        <div className="mt-6 flex gap-3">
          <button
            onClick={onApprove}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-violet-600 py-3 text-sm font-semibold text-white transition-all hover:bg-violet-500 hover:shadow-[0_0_20px_rgba(139,92,246,0.4)]"
          >
            <CheckCircle2 className="h-4 w-4" /> Approve & Continue
          </button>
          <button
            onClick={() => setRejecting(true)}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-zinc-700 py-3 text-sm font-semibold text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
          >
            <RefreshCw className="h-4 w-4" /> Request Changes
          </button>
        </div>
      ) : (
        <form onSubmit={handleReject} className="mt-6 space-y-3">
          <textarea
            autoFocus
            className="w-full h-24 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white placeholder-zinc-500 resize-none outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/40 transition-colors"
            placeholder="What should be changed? e.g. Add a fallback path if the API is unreachable..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={!feedback.trim()}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-violet-600 py-2.5 text-sm font-semibold text-white transition-all hover:bg-violet-500 disabled:opacity-40"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Regenerate
            </button>
            <button
              type="button"
              onClick={() => setRejecting(false)}
              className="rounded-full border border-zinc-700 px-5 py-2.5 text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </motion.div>
  );
}

// --- Step 3: Payment ---
function Step3({ onPay }: { onPay: (txHash: string) => void }) {
  const [loading, setLoading] = useState(false);
  const PAYMENT_AMOUNT = "0.002 ETH";

  async function handlePay() {
    setLoading(true);
    try {
      const { txHash } = await mockProcessPayment(PAYMENT_AMOUNT);
      onPay(txHash);
    } catch {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-md mx-auto text-center"
    >
      <div className="mb-6 mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-500/30 bg-violet-600/10">
        <CreditCard className="h-8 w-8 text-violet-400" />
      </div>

      <h2 className="text-2xl font-bold text-white mb-2">Unlock Code Generation</h2>
      <p className="text-zinc-400 mb-8">
        Your architecture is approved. Complete the x402 microtransaction to allow the agent to generate and deploy your workflow.
      </p>

      <div className="mb-6 rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-left space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-500">Protocol</span>
          <span className="text-sm font-medium text-white">x402</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-500">Amount</span>
          <span className="text-sm font-semibold text-violet-300">{PAYMENT_AMOUNT}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-500">Purpose</span>
          <span className="text-sm text-white">Workflow Code Generation</span>
        </div>
        <div className="border-t border-zinc-800 pt-3 flex items-center justify-between">
          <span className="text-sm text-zinc-500">Network</span>
          <span className="text-sm text-white">Custom EVM</span>
        </div>
      </div>

      <button
        onClick={handlePay}
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-violet-600 py-3.5 text-sm font-semibold text-white transition-all hover:bg-violet-500 hover:shadow-[0_0_24px_rgba(139,92,246,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Processing x402 payment…
          </>
        ) : (
          <>
            <Zap className="h-4 w-4" /> Pay {PAYMENT_AMOUNT} via x402
          </>
        )}
      </button>

      <p className="mt-4 text-xs text-zinc-600">
        Secured by the x402 payment protocol. Transaction is non-refundable once deployed.
      </p>
    </motion.div>
  );
}

// --- Step 4: Deploy ---
function Step4({
  prompt,
  txHash,
}: {
  prompt: string;
  txHash: string;
}) {
  const [phase, setPhase] = useState<"generating" | "deploying" | "done">("generating");
  const [workflowId, setWorkflowId] = useState<string | null>(null);

  useEffect(() => {
    async function run() {
      setPhase("generating");
      await new Promise((r) => setTimeout(r, 1800));
      setPhase("deploying");
      const result = await mockDeploy(prompt);
      setWorkflowId(result.workflowId);
      setPhase("done");
    }
    run();
  }, [prompt]);

  const phases = {
    generating: { label: "Generating Workflow YAML + JS…", icon: <Loader2 className="h-5 w-5 animate-spin text-violet-400" /> },
    deploying: { label: "Deploying to Chainlink CRE…", icon: <Loader2 className="h-5 w-5 animate-spin text-amber-400" /> },
    done: { label: "Workflow Live on CRE", icon: <CheckCircle2 className="h-5 w-5 text-emerald-400" /> },
  };

  const current = phases[phase];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-md mx-auto text-center"
    >
      <AnimatePresence mode="wait">
        {phase !== "done" ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mb-8 mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-950"
          >
            {current.icon}
          </motion.div>
        ) : (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10"
          >
            <Rocket className="h-8 w-8 text-emerald-400" />
          </motion.div>
        )}
      </AnimatePresence>

      <h2 className="text-2xl font-bold text-white mb-2">
        {phase === "done" ? "Workflow Deployed!" : "Working on it…"}
      </h2>
      <p className="text-zinc-400 mb-8">
        {phase === "done"
          ? "Your automation is live on the Chainlink Runtime Environment. The agent has handled everything."
          : current.label}
      </p>

      {/* Progress steps */}
      <div className="mb-8 space-y-2 text-left">
        {[
          { key: "generating", label: "Generate Workflow YAML + JS" },
          { key: "deploying", label: "Deploy via CRE CLI" },
          { key: "done", label: "Workflow is live on CRE" },
        ].map((s) => {
          const phaseOrder = ["generating", "deploying", "done"];
          const currentIdx = phaseOrder.indexOf(phase);
          const stepIdx = phaseOrder.indexOf(s.key);
          const isDone = currentIdx > stepIdx || (phase === "done" && s.key === "done");
          const isActive = currentIdx === stepIdx && phase !== "done";

          return (
            <div
              key={s.key}
              className={`flex items-center gap-3 rounded-lg border px-4 py-2.5 transition-colors ${
                isDone
                  ? "border-emerald-500/20 bg-emerald-500/5"
                  : isActive
                  ? "border-violet-500/20 bg-violet-500/5"
                  : "border-zinc-800 bg-zinc-950"
              }`}
            >
              {isDone ? (
                <Check className="h-4 w-4 shrink-0 text-emerald-400" />
              ) : isActive ? (
                <Loader2 className="h-4 w-4 shrink-0 animate-spin text-violet-400" />
              ) : (
                <div className="h-4 w-4 shrink-0 rounded-full border border-zinc-700" />
              )}
              <span
                className={`text-sm ${
                  isDone ? "text-zinc-300" : isActive ? "text-violet-300" : "text-zinc-600"
                }`}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      {phase === "done" && workflowId && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-left space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-500">Workflow ID</span>
              <span className="font-mono text-sm text-violet-300">{workflowId}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-500">Payment tx</span>
              <span className="font-mono text-xs text-zinc-400">{txHash.slice(0, 20)}…</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-500">Status</span>
              <span className="text-sm font-medium text-emerald-400">● Live</span>
            </div>
          </div>

          <a
            href="/history"
            className="block w-full text-center rounded-full border border-zinc-700 py-3 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
          >
            View in History
          </a>
        </motion.div>
      )}
    </motion.div>
  );
}

// --- Wizard Page ---
export default function WizardPage() {
  const { isConnected } = useAccount();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [prompt, setPrompt] = useState("");
  const [diagram, setDiagram] = useState<string | null>(null);
  const [txHash, setTxHash] = useState("");

  useEffect(() => {
    if (!isConnected) router.replace("/");
  }, [isConnected, router]);

  if (!isConnected) return null;

  async function handlePromptSubmit(p: string) {
    setPrompt(p);
    setDiagram(null);
    setStep(2);
    const d = await mockGenerateArchitecture(p);
    setDiagram(d);
  }

  function handleApprove() {
    setStep(3);
  }

  async function handleReject() {
    setDiagram(null);
    const d = await mockGenerateArchitecture(prompt);
    setDiagram(d);
  }

  function handlePay(hash: string) {
    setTxHash(hash);
    setStep(4);
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="mx-auto max-w-4xl px-6 pt-28 pb-20">
        <div className="mb-8 text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-zinc-500 mb-1">
            New Workflow
          </p>
          <h1 className="text-3xl font-bold text-white">Build your automation</h1>
        </div>

        <StepIndicator current={step} />

        <AnimatePresence mode="wait">
          {step === 1 && (
            <Step1 key="step1" onSubmit={handlePromptSubmit} />
          )}
          {step === 2 && (
            <Step2
              key="step2"
              prompt={prompt}
              diagram={diagram}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          )}
          {step === 3 && (
            <Step3 key="step3" onPay={handlePay} />
          )}
          {step === 4 && (
            <Step4 key="step4" prompt={prompt} txHash={txHash} />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
