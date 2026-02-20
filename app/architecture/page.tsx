"use client";

import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { GitBranch } from "lucide-react";

const MermaidDiagram = dynamic(() => import("@/components/MermaidDiagram"), { ssr: false });

// ─────────────────────────────────────────────────────────────────────────────
// DIAGRAM DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────

const diagrams = [
  // ── 1. SYSTEM ARCHITECTURE ──────────────────────────────────────────────────
  {
    id: "system-arch",
    title: "1. System Architecture",
    description:
      "High-level overview of every component in OnyxLab — how the frontend, backend, AI agent, payment layer, and Chainlink CRE connect.",
    chart: `graph TB
  subgraph CLIENT["🖥  Client Layer (Next.js 16 + React 19)"]
    direction LR
    LP["Landing Page"]
    DB["Dashboard"]
    WZ["Wizard (4-step)"]
    HX["History"]
  end

  subgraph WALLET["🔐  Wallet Layer"]
    RBK["RainbowKit"]
    WAGMI["wagmi / viem"]
    EVM["Custom EVM Chain"]
    RBK --> WAGMI --> EVM
  end

  subgraph BACKEND["⚙️  Backend Layer (FastAPI / Python)"]
    direction TB
    GW["API Gateway /api/v1"]
    AS["Agent Service"]
    PS["Payment Service"]
    DS["Deploy Service"]
    GW --> AS & PS & DS
  end

  subgraph AI["🤖  AI Layer"]
    GEMINI["Gemini API\n(Google)"]
    MERMAID_GEN["Mermaid\nGenerator"]
    CODE_GEN["CRE Code\nGenerator"]
    GEMINI --> MERMAID_GEN & CODE_GEN
  end

  subgraph PAYMENT["💳  Payment Layer"]
    X402["x402 Protocol"]
    EVMN["EVM Network\n(on-chain)"]
    X402 --> EVMN
  end

  subgraph CRE["⛓  Chainlink Runtime Environment"]
    CREC["CRE CLI"]
    WF["Deployed Workflow\n(YAML + JS)"]
    CREC --> WF
  end

  subgraph STORE["🗄  Data Layer"]
    DB_STORE[("PostgreSQL\n(prompts, payments,\nworkflows)")]
  end

  CLIENT -->|"HTTP / REST"| BACKEND
  CLIENT <-->|"wallet ops"| WALLET
  BACKEND -->|"Prompt + context"| AI
  AI -->|"Mermaid diagram text"| BACKEND
  AI -->|"YAML + JS code"| BACKEND
  BACKEND -->|"x402 request"| PAYMENT
  PAYMENT -->|"tx verified"| BACKEND
  BACKEND -->|"cre deploy"| CRE
  BACKEND <--> STORE

  style CLIENT fill:#1e1b4b,stroke:#6d28d9,color:#e0e7ff
  style WALLET fill:#1c1917,stroke:#78716c,color:#e7e5e4
  style BACKEND fill:#0f172a,stroke:#334155,color:#e2e8f0
  style AI fill:#1a1a2e,stroke:#7c3aed,color:#ddd6fe
  style PAYMENT fill:#1c1917,stroke:#d97706,color:#fef3c7
  style CRE fill:#052e16,stroke:#16a34a,color:#d1fae5
  style STORE fill:#1e1b4b,stroke:#3b82f6,color:#dbeafe`,
  },

  // ── 2. USER FLOW ────────────────────────────────────────────────────────────
  {
    id: "user-flow",
    title: "2. User Flow",
    description:
      "Complete journey of a user from first landing on the platform to having a live Chainlink CRE workflow — including all decision branches.",
    chart: `flowchart TD
  A([🌐 User visits OnyxLab]) --> B{Has wallet?}
  B -- No --> C[Install MetaMask\nor WalletConnect]
  C --> D
  B -- Yes --> D[Connect Wallet\nvia RainbowKit]
  D --> E{Auth OK?}
  E -- No --> D
  E -- Yes --> F[Land on Dashboard]

  F --> G[Click 'New Workflow']
  G --> H[Step 1: Enter plain\nEnglish prompt]
  H --> I[Submit prompt → AI generates\nMermaid architecture]

  I --> J{Review\narchitecture}
  J -- "❌ Reject" --> K[Provide feedback]
  K --> I
  J -- "✅ Approve" --> L[Step 3: x402\nPayment gate appears]

  L --> M{Pay microtransaction}
  M -- "❌ Declined / Cancelled" --> L
  M -- "✅ Confirmed on-chain" --> N[Step 4: Agent generates\nCRE YAML + JS code]

  N --> O[Agent shells CRE CLI\nto auto-deploy workflow]
  O --> P{Deploy\nsuccess?}
  P -- "❌ CRE error" --> Q[Error shown\nwith retry option]
  Q --> O
  P -- "✅ Deployed" --> R[Confirmation screen\nWorkflow ID shown]

  R --> S[View in /history]
  S --> T{Build another?}
  T -- Yes --> G
  T -- No --> U([User exits])

  style A fill:#7c3aed,color:#fff,stroke:#6d28d9
  style U fill:#374151,color:#fff,stroke:#4b5563
  style R fill:#059669,color:#fff,stroke:#047857
  style Q fill:#dc2626,color:#fff,stroke:#b91c1c
  style L fill:#d97706,color:#fff,stroke:#b45309`,
  },

  // ── 3. FRONTEND ARCHITECTURE ────────────────────────────────────────────────
  {
    id: "frontend-arch",
    title: "3. Frontend Architecture",
    description:
      "Component hierarchy, routing structure, shared state, and how the Next.js App Router pages are organized with their dependencies.",
    chart: `graph TD
  subgraph ROUTER["Next.js App Router"]
    ROOT["app/layout.tsx\n(Providers wrapper)"]
    PAGE_LAND["app/page.tsx\n(Landing)"]
    PAGE_DASH["app/dashboard/page.tsx"]
    PAGE_WIZ["app/wizard/page.tsx"]
    PAGE_HIST["app/history/page.tsx"]
    ROOT --> PAGE_LAND & PAGE_DASH & PAGE_WIZ & PAGE_HIST
  end

  subgraph PROVIDERS["Provider Tree (lib/)"]
    direction LR
    WP["WagmiProvider"]
    QP["QueryClientProvider"]
    RBP["RainbowKitProvider"]
    WP --> QP --> RBP
  end

  subgraph SHARED["Shared Components"]
    NAV["Navbar.tsx\n(wallet btn + links)"]
    MMD["MermaidDiagram.tsx\n(dynamic, SSR off)"]
  end

  subgraph WIZARD["Wizard Steps (local state)"]
    direction LR
    S1["Step1\nPrompt textarea"]
    S2["Step2\nDiagram + approve/reject"]
    S3["Step3\nx402 payment card"]
    S4["Step4\nDeploy progress"]
    S1 --> S2 --> S3 --> S4
  end

  subgraph HOOKS["Wagmi Hooks"]
    UA["useAccount()"]
    US["useSendTransaction()"]
    UB["useBalance()"]
  end

  subgraph APICALLS["API Calls (→ FastAPI)"]
    AC1["POST /api/v1/agent/propose"]
    AC2["POST /api/v1/agent/regenerate"]
    AC3["POST /api/v1/payment/verify"]
    AC4["POST /api/v1/deploy"]
    AC5["GET  /api/v1/history/:address"]
  end

  ROOT --> PROVIDERS
  PAGE_DASH & PAGE_WIZ & PAGE_HIST --> NAV
  PAGE_WIZ --> WIZARD
  S2 --> MMD
  PAGE_WIZ --> APICALLS
  PAGE_HIST --> APICALLS
  PAGE_DASH --> APICALLS
  PAGE_DASH & PAGE_WIZ & PAGE_HIST --> HOOKS

  style ROUTER fill:#1e1b4b,stroke:#6d28d9,color:#e0e7ff
  style WIZARD fill:#0f172a,stroke:#7c3aed,color:#ddd6fe
  style PROVIDERS fill:#1c1917,stroke:#78716c,color:#e7e5e4
  style APICALLS fill:#052e16,stroke:#16a34a,color:#d1fae5`,
  },

  // ── 4. BACKEND ARCHITECTURE ─────────────────────────────────────────────────
  {
    id: "backend-arch",
    title: "4. Backend Architecture",
    description:
      "FastAPI service structure — routers, service layer, external integrations, and the data persistence model.",
    chart: `graph TD
  subgraph ENTRY["Entry Point"]
    MAIN["main.py\nFastAPI app + CORS + middleware"]
  end

  subgraph ROUTERS["Routers (/api/v1/)"]
    direction LR
    R_AGENT["router/agent.py\nPOST /propose\nPOST /regenerate"]
    R_PAY["router/payment.py\nPOST /verify\nGET  /status/:id"]
    R_DEPLOY["router/deploy.py\nPOST /deploy\nGET  /status/:id"]
    R_HIST["router/history.py\nGET  /history/:address"]
  end

  subgraph SERVICES["Service Layer"]
    direction TB
    SVC_AGENT["AgentService\n- build_prompt()\n- call_gemini()\n- extract_mermaid()\n- extract_code()"]
    SVC_PAY["PaymentService\n- create_request()\n- verify_tx()\n- poll_chain()"]
    SVC_DEPLOY["DeployService\n- write_files()\n- call_cre_cli()\n- parse_result()"]
    SVC_HIST["HistoryService\n- get_by_wallet()\n- upsert_workflow()"]
  end

  subgraph EXTERNAL["External Integrations"]
    GEMINI_SDK["google-generativeai\nSDK"]
    X402_LIB["x402 Protocol\nLibrary"]
    CRE_CLI["Chainlink CRE CLI\n(subprocess)"]
    PG[("PostgreSQL\nvia SQLAlchemy")]
  end

  subgraph MODELS["Data Models (Pydantic + ORM)"]
    direction LR
    M_WF["WorkflowSession\n- session_id\n- wallet_address\n- prompt\n- mermaid_chart\n- iteration_count\n- status"]
    M_PAY["Payment\n- payment_id\n- session_id\n- amount\n- tx_hash\n- verified_at"]
    M_DEPLOY["DeployedWorkflow\n- workflow_id\n- session_id\n- cre_id\n- yaml_content\n- js_content\n- deployed_at"]
  end

  MAIN --> ROUTERS
  R_AGENT --> SVC_AGENT
  R_PAY --> SVC_PAY
  R_DEPLOY --> SVC_DEPLOY
  R_HIST --> SVC_HIST
  SVC_AGENT --> GEMINI_SDK
  SVC_PAY --> X402_LIB
  SVC_DEPLOY --> CRE_CLI
  SVC_AGENT & SVC_PAY & SVC_DEPLOY & SVC_HIST --> PG
  PG --> MODELS

  style ENTRY fill:#0f172a,stroke:#334155,color:#e2e8f0
  style ROUTERS fill:#1e1b4b,stroke:#6d28d9,color:#e0e7ff
  style SERVICES fill:#0f172a,stroke:#7c3aed,color:#ddd6fe
  style EXTERNAL fill:#052e16,stroke:#16a34a,color:#d1fae5
  style MODELS fill:#1c1917,stroke:#d97706,color:#fef3c7`,
  },

  // ── 5. AI AGENT FLOW ────────────────────────────────────────────────────────
  {
    id: "agent-flow",
    title: "5. AI Agent Flow",
    description:
      "Internal decision logic of the Gemini-powered agent — from receiving a prompt to generating a validated architecture and, post-payment, producing deployment-ready code.",
    chart: `flowchart TD
  START([Agent receives request]) --> TYPE{Request type?}

  TYPE -- "propose" --> P1[Build system prompt:\n- Role: Web3 automation architect\n- Context: CRE constraints\n- Output format: Mermaid flowchart]
  P1 --> P2[Attach user prompt]
  P2 --> P3[Call Gemini API\ngemini-1.5-pro]
  P3 --> P4{Valid Mermaid\nin response?}
  P4 -- No --> P5[Retry with\ncorrection prompt\nmax 3 attempts]
  P5 --> P3
  P4 -- Yes --> P6[Extract Mermaid\nblock from response]
  P6 --> P7[Return diagram\nto frontend]

  TYPE -- "regenerate" --> R1[Build regeneration prompt:\n- Previous diagram\n- User feedback\n- Must address concerns]
  R1 --> P3

  TYPE -- "generate_code" --> C1[Build code-gen prompt:\n- Role: CRE workflow engineer\n- Approved Mermaid diagram\n- CRE YAML schema\n- CRE JS function template]
  C1 --> C2[Call Gemini API\nwith structured output]
  C2 --> C3{Both YAML and JS\npresent in response?}
  C3 -- No --> C4[Retry requesting\nmissing artifacts]
  C4 --> C2
  C3 -- Yes --> C5[Parse and validate\nYAML structure]
  C5 --> C6{YAML valid\nagainst CRE schema?}
  C6 -- No --> C7[Correction prompt:\nfix YAML errors]
  C7 --> C2
  C6 -- Yes --> C8[Return YAML + JS\nto DeployService]
  C8 --> END([Agent done])

  P7 --> END

  style START fill:#7c3aed,color:#fff,stroke:#6d28d9
  style END fill:#059669,color:#fff,stroke:#047857
  style P5 fill:#7c2d12,color:#fff,stroke:#9a3412
  style C4 fill:#7c2d12,color:#fff,stroke:#9a3412
  style C7 fill:#7c2d12,color:#fff,stroke:#9a3412`,
  },

  // ── 6. x402 PAYMENT FLOW ────────────────────────────────────────────────────
  {
    id: "payment-flow",
    title: "6. x402 Payment Protocol Flow",
    description:
      "Detailed sequence of the x402 microtransaction gate — from the agent halting execution to on-chain verification before code generation unlocks.",
    chart: `sequenceDiagram
  autonumber
  actor User
  participant Frontend as Frontend (Wizard Step 3)
  participant Backend as FastAPI Backend
  participant X402 as x402 Protocol
  participant EVM as EVM Network (on-chain)
  participant Agent as Gemini Agent

  User->>Frontend: Approves architecture diagram
  Frontend->>Backend: POST /api/v1/payment/create {session_id}
  Backend->>X402: create_payment_request(amount, session_id)
  X402-->>Backend: {payment_id, amount, recipient, deadline}
  Backend-->>Frontend: {payment_id, amount, recipient}
  Frontend->>User: Display x402 payment card (amount, recipient)

  User->>Frontend: Click "Pay via x402"
  Frontend->>EVM: sendTransaction({to: recipient, value: amount})
  EVM-->>Frontend: {tx_hash, status: pending}
  Frontend->>Backend: POST /api/v1/payment/verify {tx_hash, payment_id}

  loop Poll until confirmed (max 60s)
    Backend->>EVM: getTransactionReceipt(tx_hash)
    EVM-->>Backend: {status: pending | confirmed}
  end

  EVM-->>Backend: {status: confirmed, block_number}
  Backend->>X402: verify_payment(payment_id, tx_hash)
  X402-->>Backend: {verified: true, timestamp}
  Backend->>Backend: Mark session as payment_verified
  Backend-->>Frontend: {verified: true, tx_hash}

  Frontend->>Frontend: Advance to Step 4
  Frontend->>Backend: POST /api/v1/deploy {session_id}
  Backend->>Agent: generate_code(prompt, diagram)
  Note over Agent: Payment gate passed — code generation UNLOCKED`,
  },

  // ── 7. CRE DEPLOYMENT FLOW ──────────────────────────────────────────────────
  {
    id: "cre-deploy-flow",
    title: "7. CRE Deployment Flow",
    description:
      "How the backend agent generates CRE-compatible artifacts and orchestrates the Chainlink CLI to deploy the workflow autonomously.",
    chart: `flowchart TD
  START([Payment verified\nDeploy triggered]) --> GEN1

  subgraph CODEGEN["Code Generation Phase"]
    direction TB
    GEN1["AgentService.generate_code()\nprompt + approved diagram → Gemini"]
    GEN2["Extract YAML block\n(workflow definition)"]
    GEN3["Extract JS block\n(function source)"]
    GEN4["Validate YAML schema\nagainst CRE spec"]
    GEN5{Valid?}
    GEN6["Auto-correct:\nfix schema violations"]
    GEN1 --> GEN2 & GEN3
    GEN2 --> GEN4 --> GEN5
    GEN5 -- No --> GEN6 --> GEN4
    GEN5 -- Yes --> GEN_DONE
    GEN3 --> GEN_DONE["Artifacts ready\nworkflow.yaml + function.js"]
  end

  GEN_DONE --> WRITE

  subgraph DEPLOY["Deployment Phase"]
    direction TB
    WRITE["Write artifacts to\ntmp/{session_id}/\n├── workflow.yaml\n└── function.js"]
    AUTH["Inject CRE API Key\nfrom env secrets"]
    CLI["subprocess: cre deploy\n  --file workflow.yaml\n  --key {api_key}\n  --env production"]
    PARSE{CLI exit code?}
    DONE["Parse stdout:\nextract workflow_id\n+ endpoint"]
    ERR["Parse stderr:\ncapture error message"]
    CLEAN["Cleanup tmp files"]

    WRITE --> AUTH --> CLI --> PARSE
    PARSE -- "0 (success)" --> DONE --> CLEAN
    PARSE -- "non-zero" --> ERR --> RETRY
    RETRY{Retry count\n< 2?}
    RETRY -- Yes --> CLI
    RETRY -- No --> FAIL["Return deploy\nerror to frontend"]
    CLEAN --> SAVE
  end

  subgraph PERSIST["Persist Phase"]
    SAVE["Save to DB:\n- workflow_id\n- cre_endpoint\n- yaml_content\n- js_content\n- deployed_at\n- tx_hash"]
    NOTIFY["Return to frontend:\n{workflow_id, status: live}"]
    SAVE --> NOTIFY
  end

  NOTIFY --> END([Wizard Step 4\nDeployed ✓])

  style START fill:#7c3aed,color:#fff,stroke:#6d28d9
  style END fill:#059669,color:#fff,stroke:#047857
  style FAIL fill:#dc2626,color:#fff,stroke:#b91c1c
  style CODEGEN fill:#1e1b4b,stroke:#6d28d9,color:#e0e7ff
  style DEPLOY fill:#052e16,stroke:#16a34a,color:#d1fae5
  style PERSIST fill:#1c1917,stroke:#d97706,color:#fef3c7`,
  },

  // ── 8. END-TO-END SEQUENCE ──────────────────────────────────────────────────
  {
    id: "e2e-sequence",
    title: "8. End-to-End Sequence Diagram",
    description:
      "Full sequence from the user's first prompt to a live deployed workflow — every system interaction in chronological order.",
    chart: `sequenceDiagram
  autonumber
  actor User
  participant FE as Frontend
  participant BE as FastAPI
  participant Gemini as Gemini API
  participant X402 as x402 + EVM
  participant CRE as Chainlink CRE

  User->>FE: Connect wallet (RainbowKit)
  FE-->>User: Wallet connected, enter dashboard

  User->>FE: Submit prompt (Step 1)
  FE->>BE: POST /agent/propose {prompt, wallet}
  BE->>Gemini: Generate Mermaid architecture
  Gemini-->>BE: Mermaid flowchart text
  BE-->>FE: {diagram: "flowchart TD ..."}
  FE-->>User: Render Mermaid diagram (Step 2)

  alt User rejects
    User->>FE: Submit feedback
    FE->>BE: POST /agent/regenerate {feedback, prev_diagram}
    BE->>Gemini: Regenerate with feedback
    Gemini-->>BE: New Mermaid diagram
    BE-->>FE: {diagram: "flowchart TD ..."}
    FE-->>User: Render updated diagram
  end

  User->>FE: Approve architecture
  FE->>BE: POST /payment/create {session_id}
  BE-->>FE: {payment_id, amount, recipient}
  FE-->>User: Show x402 payment card (Step 3)

  User->>FE: Confirm payment
  FE->>X402: sendTransaction on EVM
  X402-->>FE: {tx_hash}
  FE->>BE: POST /payment/verify {tx_hash}
  BE->>X402: Poll for confirmation
  X402-->>BE: {confirmed: true}
  BE-->>FE: {verified: true}

  FE-->>User: Payment confirmed — deploying (Step 4)
  FE->>BE: POST /deploy {session_id}
  BE->>Gemini: Generate YAML + JS for CRE
  Gemini-->>BE: {yaml, js}
  BE->>CRE: cre deploy --file workflow.yaml
  CRE-->>BE: {workflow_id, status: live}
  BE->>BE: Save to PostgreSQL
  BE-->>FE: {workflow_id, status: deployed}
  FE-->>User: ✅ Workflow Live — ID shown`,
  },

  // ── 9. WIZARD STATE MACHINE ─────────────────────────────────────────────────
  {
    id: "state-machine",
    title: "9. Wizard State Machine",
    description:
      "All possible states of a workflow session from creation to deployment — including error recovery and the rejection iteration loop.",
    chart: `stateDiagram-v2
  [*] --> idle : User opens /wizard

  idle --> awaiting_proposal : submitPrompt()

  awaiting_proposal --> proposal_ready : AI returns diagram
  awaiting_proposal --> proposal_error : API timeout / error

  proposal_error --> awaiting_proposal : retry()

  proposal_ready --> awaiting_proposal : rejectWithFeedback()\nre-enters proposal loop

  proposal_ready --> payment_pending : approveArchitecture()

  payment_pending --> payment_processing : userInitiatesPay()
  payment_pending --> idle : userCancels()

  payment_processing --> payment_verified : onChainConfirmed()
  payment_processing --> payment_failed : txRejected / timeout

  payment_failed --> payment_pending : retry()

  payment_verified --> generating_code : auto-triggered

  generating_code --> deploying : codeGenComplete()
  generating_code --> code_error : geminiError()

  code_error --> generating_code : retry()

  deploying --> deployed : creCLISuccess()
  deploying --> deploy_error : creCLIFailure()

  deploy_error --> deploying : retry()

  deployed --> [*] : sessionComplete()

  note right of payment_verified : Hard gate - code generation only unlocks after on-chain confirmation
  note right of proposal_ready : Iteration loop - no limit on reject and regenerate cycles`,
  },

  // ── 10. DATA MODEL ──────────────────────────────────────────────────────────
  {
    id: "data-model",
    title: "10. Data Model",
    description:
      "Database entity relationships — how workflow sessions, architecture iterations, payments, and deployed workflows are stored and linked.",
    chart: `erDiagram
  WALLET_USER {
    string address PK
    timestamp first_seen
    timestamp last_active
    int total_workflows
    float total_paid_eth
  }

  WORKFLOW_SESSION {
    uuid session_id PK
    string wallet_address FK
    text prompt
    string status
    int iteration_count
    timestamp created_at
    timestamp updated_at
  }

  ARCHITECTURE_ITERATION {
    uuid iteration_id PK
    uuid session_id FK
    int iteration_number
    text mermaid_chart
    text user_feedback
    boolean approved
    timestamp created_at
  }

  PAYMENT {
    uuid payment_id PK
    uuid session_id FK
    string payment_protocol
    float amount_eth
    string recipient_address
    string tx_hash
    boolean verified
    int block_number
    timestamp verified_at
  }

  DEPLOYED_WORKFLOW {
    uuid workflow_id PK
    uuid session_id FK
    string cre_workflow_id
    text yaml_content
    text js_content
    string cre_status
    timestamp deployed_at
  }

  WALLET_USER ||--o{ WORKFLOW_SESSION : "owns"
  WORKFLOW_SESSION ||--o{ ARCHITECTURE_ITERATION : "has"
  WORKFLOW_SESSION ||--o| PAYMENT : "paid via"
  WORKFLOW_SESSION ||--o| DEPLOYED_WORKFLOW : "results in"`,
  },

  // ════════════════════════════════════════════════════════════════════════════
  // STAGE 2 — CRE MIGRATION (DOGFOODING)
  // ════════════════════════════════════════════════════════════════════════════

  // ── 11. STAGE 2 SYSTEM ARCHITECTURE ─────────────────────────────────────────
  {
    id: "stage2-arch",
    title: "11. Stage 2 — CRE-Native System Architecture",
    description:
      "After Stage 1 is proven, the agent pipeline moves off FastAPI and into Chainlink CRE itself. FastAPI shrinks to a thin auth + session layer. OnyxLab runs its own orchestration on the same infrastructure it deploys to.",
    chart: `graph TB
  subgraph CLIENT["Client Layer (Next.js — unchanged)"]
    direction LR
    FE_LAND["Landing"]
    FE_DASH["Dashboard"]
    FE_WIZ["Wizard"]
    FE_HIST["History"]
  end

  subgraph THIN["Thin FastAPI Layer (Stage 2 reduced scope)"]
    direction TB
    AUTH["Wallet Signature Auth"]
    SESSION["Session Manager"]
    DB_API["DB Read/Write API"]
    HEALTH["Health + Status"]
  end

  subgraph CRE_LAYER["CRE Orchestration Layer (Stage 2 NEW)"]
    direction TB
    CRE_WF["Master Workflow\n(YAML orchestrator)"]
    CRE_F1["CRE Function 1\ngemini-propose"]
    CRE_F2["CRE Function 2\nx402-verify"]
    CRE_F3["CRE Function 3\ngemini-codegen"]
    CRE_F4["CRE Function 4\ncre-self-deploy"]
    CRE_WF --> CRE_F1 --> CRE_F2 --> CRE_F3 --> CRE_F4
  end

  subgraph EXT["External Services"]
    GEMINI["Gemini API"]
    EVM_NET["EVM Network (x402)"]
    CRE_RT["CRE Runtime Registry"]
  end

  subgraph STORE["Persistence"]
    PG[("PostgreSQL")]
  end

  CLIENT -->|"REST calls"| THIN
  THIN -->|"trigger workflow"| CRE_LAYER
  CRE_F1 -->|"HTTP"| GEMINI
  CRE_F2 -->|"poll tx"| EVM_NET
  CRE_F3 -->|"HTTP"| GEMINI
  CRE_F4 -->|"cre deploy"| CRE_RT
  THIN <-->|"read/write"| PG
  CRE_LAYER -->|"callback results"| THIN

  style CLIENT fill:#1e1b4b,stroke:#6d28d9,color:#e0e7ff
  style THIN fill:#1c1917,stroke:#78716c,color:#e7e5e4
  style CRE_LAYER fill:#052e16,stroke:#16a34a,color:#d1fae5
  style EXT fill:#0f172a,stroke:#334155,color:#e2e8f0
  style STORE fill:#1c1917,stroke:#d97706,color:#fef3c7`,
  },

  // ── 12. STAGE 1 vs STAGE 2 COMPARISON ───────────────────────────────────────
  {
    id: "stage-comparison",
    title: "12. Stage 1 vs Stage 2 — Migration Map",
    description:
      "Side-by-side comparison of what runs where in each stage. Every component in Stage 1 FastAPI that moves to CRE in Stage 2, and what stays in the thin FastAPI layer.",
    chart: `flowchart LR
  subgraph S1["STAGE 1 — FastAPI handles everything"]
    direction TB
    S1_FE["Next.js Frontend"]
    S1_API["FastAPI Backend"]
    S1_GEMINI_PROPOSE["AgentService.propose()"]
    S1_GEMINI_REGEN["AgentService.regenerate()"]
    S1_PAY["PaymentService.verify_tx()"]
    S1_CODEGEN["AgentService.generate_code()"]
    S1_DEPLOY["DeployService.run_cre_cli()"]
    S1_DB[("PostgreSQL")]

    S1_API --> S1_GEMINI_PROPOSE & S1_GEMINI_REGEN & S1_PAY & S1_CODEGEN & S1_DEPLOY
    S1_API <--> S1_DB
  end

  subgraph S2["STAGE 2 — CRE handles orchestration"]
    direction TB
    S2_FE["Next.js Frontend\n(unchanged)"]
    S2_THIN["Thin FastAPI\n(auth + session + DB only)"]
    S2_CRE1["CRE Function 1\ngemini-propose + regenerate"]
    S2_CRE2["CRE Function 2\nx402-verify"]
    S2_CRE3["CRE Function 3\ngemini-codegen"]
    S2_CRE4["CRE Function 4\ncre-self-deploy"]
    S2_DB[("PostgreSQL\nunchanged")]

    S2_THIN --> S2_CRE1 --> S2_CRE2 --> S2_CRE3 --> S2_CRE4
    S2_THIN <--> S2_DB
  end

  MIGRATES(["What MOVES to CRE"])
  STAYS(["What STAYS in FastAPI"])

  S1_GEMINI_PROPOSE -.->|"becomes"| S2_CRE1
  S1_GEMINI_REGEN -.->|"becomes"| S2_CRE1
  S1_PAY -.->|"becomes"| S2_CRE2
  S1_CODEGEN -.->|"becomes"| S2_CRE3
  S1_DEPLOY -.->|"becomes"| S2_CRE4

  style S1 fill:#1e1b4b,stroke:#6d28d9,color:#e0e7ff
  style S2 fill:#052e16,stroke:#16a34a,color:#d1fae5
  style MIGRATES fill:#7c3aed,color:#fff,stroke:#6d28d9
  style STAYS fill:#1c1917,stroke:#78716c,color:#e7e5e4`,
  },

  // ── 13. CRE FUNCTION CHAIN (STAGE 2) ────────────────────────────────────────
  {
    id: "cre-function-chain",
    title: "13. Stage 2 — CRE Function Chain Internals",
    description:
      "Detailed internal logic of each of the 4 CRE functions that make up the OnyxLab orchestration workflow in Stage 2. Each function is a self-contained CRE JS function triggered in sequence.",
    chart: `flowchart TD
  TRIGGER(["FastAPI triggers\nMaster CRE Workflow"]) --> F1

  subgraph F1["CRE Function 1 — gemini-propose"]
    direction TB
    F1A["Receive: user_prompt, session_id, feedback?"]
    F1B["Build Gemini system prompt\n(CRE context + Mermaid format)"]
    F1C["HTTP POST to Gemini API"]
    F1D["Extract mermaid block from response"]
    F1E["Validate Mermaid syntax"]
    F1F{Valid?}
    F1G["Retry with correction\n(max 3)"]
    F1H["Return: mermaid_chart, iteration_id"]
    F1A --> F1B --> F1C --> F1D --> F1E --> F1F
    F1F -- No --> F1G --> F1C
    F1F -- Yes --> F1H
  end

  subgraph F2["CRE Function 2 — x402-verify"]
    direction TB
    F2A["Receive: tx_hash, payment_id, session_id"]
    F2B["Call EVM RPC: getTransactionReceipt"]
    F2C{Confirmed?}
    F2D["Wait 3s, retry\n(max 20 attempts)"]
    F2E["Verify recipient + amount match"]
    F2F{Match?}
    F2G["Return: error — wrong payment"]
    F2H["Return: verified, block_number"]
    F2A --> F2B --> F2C
    F2C -- No --> F2D --> F2B
    F2C -- Yes --> F2E --> F2F
    F2F -- No --> F2G
    F2F -- Yes --> F2H
  end

  subgraph F3["CRE Function 3 — gemini-codegen"]
    direction TB
    F3A["Receive: prompt, mermaid_chart, session_id"]
    F3B["Build codegen prompt\n(CRE YAML schema + JS template)"]
    F3C["HTTP POST to Gemini API"]
    F3D["Extract YAML block"]
    F3E["Extract JS block"]
    F3F["Validate YAML against CRE schema"]
    F3G{Both valid?}
    F3H["Retry with error details\n(max 3)"]
    F3I["Return: yaml_content, js_content"]
    F3A --> F3B --> F3C --> F3D & F3E --> F3F --> F3G
    F3G -- No --> F3H --> F3C
    F3G -- Yes --> F3I
  end

  subgraph F4["CRE Function 4 — cre-self-deploy"]
    direction TB
    F4A["Receive: yaml_content, js_content, session_id"]
    F4B["Write artifacts to tmp/session_id/"]
    F4C["Execute: cre deploy --file workflow.yaml"]
    F4D{Exit code 0?}
    F4E["Parse stdout: extract workflow_id"]
    F4F["Cleanup tmp files"]
    F4G["Return: workflow_id, status: live"]
    F4H["Retry (max 2)"]
    F4I["Return: error details"]
    F4A --> F4B --> F4C --> F4D
    F4D -- Yes --> F4E --> F4F --> F4G
    F4D -- No --> F4H --> F4C
    F4H -->|"after max retries"| F4I
  end

  F1H --> F2
  F2H --> F3
  F3I --> F4
  F4G --> DONE(["Callback to FastAPI\nPersist to DB\nNotify frontend"])

  style TRIGGER fill:#7c3aed,color:#fff,stroke:#6d28d9
  style DONE fill:#059669,color:#fff,stroke:#047857
  style F1 fill:#1e1b4b,stroke:#6d28d9,color:#e0e7ff
  style F2 fill:#1c1917,stroke:#d97706,color:#fef3c7
  style F3 fill:#1e1b4b,stroke:#7c3aed,color:#ddd6fe
  style F4 fill:#052e16,stroke:#16a34a,color:#d1fae5`,
  },

  // ── 14. STAGE 2 END-TO-END SEQUENCE ─────────────────────────────────────────
  {
    id: "stage2-e2e-sequence",
    title: "14. Stage 2 — End-to-End Sequence (CRE as Orchestrator)",
    description:
      "Full chronological sequence for Stage 2 where the Chainlink CRE runtime drives the agent pipeline. FastAPI only manages sessions and the database — all orchestration is on-chain.",
    chart: `sequenceDiagram
  autonumber
  actor User
  participant FE as Frontend
  participant FA as Thin FastAPI
  participant CRE as CRE Master Workflow
  participant F1 as CRE Fn1 gemini-propose
  participant F2 as CRE Fn2 x402-verify
  participant F3 as CRE Fn3 gemini-codegen
  participant F4 as CRE Fn4 cre-self-deploy
  participant DB as PostgreSQL

  User->>FE: Connect wallet + submit prompt
  FE->>FA: POST /session/create {wallet, prompt}
  FA->>DB: Insert workflow_session (status: pending)
  FA-->>FE: {session_id}

  FE->>FA: POST /agent/propose {session_id, prompt}
  FA->>CRE: Trigger Master Workflow {session_id, prompt}
  CRE->>F1: execute gemini-propose {prompt}
  F1-->>CRE: {mermaid_chart, iteration_id}
  CRE->>FA: callback {mermaid_chart}
  FA->>DB: Insert architecture_iteration
  FA-->>FE: {mermaid_chart}
  FE-->>User: Render Mermaid diagram

  alt User rejects
    User->>FE: Submit feedback
    FE->>FA: POST /agent/regenerate {session_id, feedback}
    FA->>CRE: Trigger Master Workflow {session_id, feedback, prev_diagram}
    CRE->>F1: execute gemini-propose {prompt + feedback}
    F1-->>CRE: {new mermaid_chart}
    CRE->>FA: callback {new mermaid_chart}
    FA-->>FE: {new mermaid_chart}
  end

  User->>FE: Approve + initiate x402 payment
  FE->>FA: POST /payment/create {session_id}
  FA-->>FE: {payment_id, amount, recipient}
  FE->>User: Show x402 payment card
  User->>FE: Confirm tx on wallet
  FE->>FA: POST /payment/submit {tx_hash, payment_id}

  FA->>CRE: Trigger Master Workflow {session_id, tx_hash, payment_id}
  CRE->>F2: execute x402-verify {tx_hash}
  F2-->>CRE: {verified: true, block_number}
  CRE->>F3: execute gemini-codegen {prompt, diagram}
  F3-->>CRE: {yaml_content, js_content}
  CRE->>F4: execute cre-self-deploy {yaml, js}
  F4-->>CRE: {workflow_id, status: live}

  CRE->>FA: callback {workflow_id, status: deployed}
  FA->>DB: Update session + insert deployed_workflow
  FA-->>FE: {workflow_id, status: deployed}
  FE-->>User: Workflow Live confirmation`,
  },

  // ── 15. DOGFOODING CONCEPT ───────────────────────────────────────────────────
  {
    id: "dogfooding",
    title: "15. Stage 2 — Dogfooding Architecture (Self-Referential Deployment)",
    description:
      "The self-referential nature of Stage 2: OnyxLab's own agent pipeline is itself a CRE workflow deployed on the Chainlink Runtime Environment — the platform literally uses itself to operate.",
    chart: `flowchart TD
  USER(["User on OnyxLab"])

  subgraph ONYXLAB["OnyxLab Platform"]
    direction TB
    FE2["Next.js Frontend"]
    BE2["Thin FastAPI"]
    FE2 --> BE2
  end

  subgraph CRE_META["Chainlink Runtime Environment"]
    direction TB

    subgraph ONYXLAB_WF["OnyxLab Master Workflow (deployed by us)"]
      direction LR
      F1_M["Fn1: gemini-propose"]
      F2_M["Fn2: x402-verify"]
      F3_M["Fn3: gemini-codegen"]
      F4_M["Fn4: cre-self-deploy"]
      F1_M --> F2_M --> F3_M --> F4_M
    end

    subgraph USER_WF["User Deployed Workflows (deployed by OnyxLab)"]
      direction LR
      UWF1["User Workflow A\n(price monitor)"]
      UWF2["User Workflow B\n(auto-stake)"]
      UWF3["User Workflow C\n(NFT alert)"]
    end
  end

  USER -->|"describes automation"| FE2
  BE2 -->|"triggers"| ONYXLAB_WF
  F4_M -->|"deploys into same CRE"| USER_WF

  LOOP(["Same CRE runtime\nhosts both the platform\nworkflow AND user workflows"])

  CRE_META --> LOOP

  style USER fill:#7c3aed,color:#fff,stroke:#6d28d9
  style ONYXLAB fill:#1e1b4b,stroke:#6d28d9,color:#e0e7ff
  style CRE_META fill:#052e16,stroke:#16a34a,color:#d1fae5
  style ONYXLAB_WF fill:#1a2e1a,stroke:#22c55e,color:#bbf7d0
  style USER_WF fill:#1a2e1a,stroke:#4ade80,color:#d1fae5
  style LOOP fill:#d97706,color:#000,stroke:#b45309`,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.45 },
  }),
};

export default function ArchitecturePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="mx-auto max-w-6xl px-6 pt-28 pb-24">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="mb-16 text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-300">
            <GitBranch className="h-4 w-4" />
            Architecture & Flow Diagrams
          </div>
          <h1 className="text-4xl font-bold text-white md:text-5xl">
            OnyxLab System Design
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-zinc-400 text-lg">
            Complete technical architecture of the platform — system components, user
            flows, agent logic, payment protocol, CRE deployment, and data model.
          </p>

          {/* Index */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {diagrams.map((d) => (
              <a
                key={d.id}
                href={`#${d.id}`}
                className="rounded-full border border-zinc-800 bg-zinc-950 px-3 py-1 text-xs text-zinc-400 hover:border-zinc-600 hover:text-white transition-colors"
              >
                {d.title.split(".")[0]}. {d.title.split(". ")[1]}
              </a>
            ))}
          </div>
        </motion.div>

        {/* Diagrams */}
        <div className="space-y-20">
          {diagrams.map((d, i) => (
            <motion.section
              key={d.id}
              id={d.id}
              custom={i}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeUp}
              className="scroll-mt-24"
            >
              {/* Section header */}
              <div className="mb-6 border-b border-zinc-800 pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-white">{d.title}</h2>
                    <p className="mt-1 max-w-3xl text-sm leading-relaxed text-zinc-400">
                      {d.description}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1 font-mono text-xs text-zinc-500">
                    #{d.id}
                  </span>
                </div>
              </div>

              {/* Diagram */}
              <MermaidDiagram chart={d.chart} />
            </motion.section>
          ))}
        </div>

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 rounded-xl border border-zinc-800 bg-zinc-950 p-6 text-center"
        >
          <p className="text-sm text-zinc-500">
            All diagrams rendered with{" "}
            <span className="text-zinc-300 font-medium">Mermaid.js</span>.
            {" "}Diagrams 1–10 cover the Stage 1 (FastAPI) architecture.
            {" "}Diagrams 11–15 cover the Stage 2 CRE-native migration (dogfooding).
          </p>
        </motion.div>
      </main>
    </div>
  );
}
