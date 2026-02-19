# OnyxLab — Project Phases & Build Timeline

Complete build roadmap broken into 6 phases. Each phase has clear goals, tasks, dependencies, and estimated effort so the project can be executed sequentially without confusion.

---

## Overview

```
Phase 1  →  Frontend UI (DONE)
Phase 2  →  FastAPI Backend + Database
Phase 3  →  Gemini AI Agent Integration
Phase 4  →  x402 Payment Integration
Phase 5  →  Chainlink CRE Deployment Integration
Phase 6  →  Testing, Polish & Production Deploy
```

**Total estimated timeline: ~5–6 weeks** (solo developer, part-time)

---

## Phase 1 — Frontend UI ✅ COMPLETE

**Goal:** Full working frontend with all pages, wallet connection, wizard UI, and architecture diagrams — mocked data only, no real backend yet.

**Duration:** Week 1 ✅

### Tasks

- [x] Project setup — Next.js 16, Tailwind v4, TypeScript
- [x] Install dependencies — RainbowKit, wagmi, viem, TanStack Query, Mermaid.js, Framer Motion
- [x] Wagmi config with custom EVM chain (`lib/wagmi.ts`)
- [x] Provider tree — WagmiProvider, QueryClientProvider, RainbowKitProvider (`lib/providers.tsx`)
- [x] Root layout updated with dark theme and providers
- [x] Shared `Navbar` component with wallet button and nav links
- [x] `MermaidDiagram` component (client-side, dynamic import, dark themed)
- [x] Landing page (`/`) — hero, how it works, features, CTA
- [x] Dashboard page (`/dashboard`) — wallet-gated, stats, recent workflows
- [x] 4-step Wizard (`/wizard`) — Step 1 prompt, Step 2 diagram review, Step 3 x402 payment, Step 4 deploy progress
- [x] History page (`/history`) — search, filter, expandable rows, payment + workflow details
- [x] Architecture page (`/architecture`) — 10 Mermaid.js system diagrams
- [x] README updated
- [x] PHASES.md created

### Deliverable
Full frontend running at `localhost:3000`. All flows completeable with mock data. No real API calls.

---

## Phase 2 — FastAPI Backend + Database

**Goal:** Scaffold the Python backend, set up the database, and wire all frontend API calls to real endpoints (without AI/payment/CRE yet).

**Duration:** Week 2 (est. 5–7 days)

### Prerequisites
- Python 3.11+
- PostgreSQL running locally or via Docker
- `pip` or `poetry`

### Folder Structure to Build
```
backend/
├── main.py                  # FastAPI app entry point
├── requirements.txt
├── .env                     # Backend env vars
├── config.py                # Settings via pydantic-settings
├── database.py              # SQLAlchemy engine + session
├── models/
│   ├── __init__.py
│   ├── wallet_user.py
│   ├── workflow_session.py
│   ├── architecture_iteration.py
│   ├── payment.py
│   └── deployed_workflow.py
├── schemas/
│   ├── __init__.py
│   ├── agent.py             # Pydantic request/response schemas
│   ├── payment.py
│   ├── deploy.py
│   └── history.py
├── routers/
│   ├── __init__.py
│   ├── agent.py             # POST /propose, POST /regenerate
│   ├── payment.py           # POST /create, POST /verify, GET /status/:id
│   ├── deploy.py            # POST /deploy, GET /status/:id
│   └── history.py           # GET /history/:wallet_address
├── services/
│   ├── __init__.py
│   ├── agent_service.py     # Gemini calls (stubbed in this phase)
│   ├── payment_service.py   # x402 logic (stubbed in this phase)
│   ├── deploy_service.py    # CRE CLI (stubbed in this phase)
│   └── history_service.py   # DB queries
└── utils/
    ├── __init__.py
    └── exceptions.py        # Custom HTTP exceptions
```

### Tasks

- [ ] Initialize FastAPI project in `/backend`
- [ ] Set up `requirements.txt` — fastapi, uvicorn, sqlalchemy, psycopg2, pydantic-settings, alembic, python-dotenv
- [ ] Configure CORS — allow `localhost:3000` origin
- [ ] Create `database.py` — SQLAlchemy async engine, session factory
- [ ] Define all 5 ORM models matching the data model diagram
- [ ] Run Alembic migrations — create all tables
- [ ] Build Pydantic schemas (request + response shapes) for all 4 routers
- [ ] Scaffold all 4 routers with stub implementations returning mock data
- [ ] `POST /api/v1/agent/propose` — returns hardcoded Mermaid diagram
- [ ] `POST /api/v1/agent/regenerate` — returns different hardcoded diagram
- [ ] `POST /api/v1/payment/create` — returns mock payment_id + amount
- [ ] `POST /api/v1/payment/verify` — returns `{verified: true}`
- [ ] `POST /api/v1/deploy` — returns mock workflow_id
- [ ] `GET  /api/v1/history/:wallet_address` — returns mock history from DB
- [ ] Update frontend — replace all mock `setTimeout` calls with real `fetch` calls to backend
- [ ] Add `NEXT_PUBLIC_API_URL` env var to frontend pointing to `localhost:8000`
- [ ] Test all frontend↔backend API calls end-to-end (with stub data)

### Deliverable
Frontend fully wired to real FastAPI endpoints. Data persisted to PostgreSQL. AI/payment/CRE still stubbed.

---

## Phase 3 — Gemini AI Agent Integration

**Goal:** Replace stub agent service with real Gemini API calls for architecture proposal, iterative regeneration, and CRE code generation.

**Duration:** Week 3 (est. 4–6 days)

### Prerequisites
- Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
- Phase 2 backend running

### Tasks

- [ ] Install `google-generativeai` SDK in backend
- [ ] Add `GEMINI_API_KEY` to `backend/.env`
- [ ] Build `agent_service.py` — `AgentService` class with methods:
  - [ ] `_build_propose_prompt(user_prompt)` — system prompt defining CRE context, Mermaid output format, constraints
  - [ ] `_build_regenerate_prompt(prev_diagram, feedback)` — includes previous diagram + user feedback
  - [ ] `_build_codegen_prompt(prompt, diagram)` — instructs Gemini to output CRE YAML + JS with delimiters
  - [ ] `call_gemini(prompt_parts)` — generic Gemini API call wrapper with retry (max 3)
  - [ ] `extract_mermaid(response_text)` — regex extract fenced mermaid block
  - [ ] `extract_yaml(response_text)` — regex extract fenced yaml block
  - [ ] `extract_js(response_text)` — regex extract fenced javascript block
  - [ ] `propose(user_prompt)` — full propose flow with validation loop
  - [ ] `regenerate(prev_diagram, feedback)` — regenerate flow
  - [ ] `generate_code(prompt, diagram)` — code gen flow, validates both YAML + JS present
- [ ] Wire `AgentService` into `/agent/propose` and `/agent/regenerate` routers
- [ ] Wire `AgentService.generate_code()` into `/deploy` router (called after payment verified)
- [ ] Test prompt → diagram flow end to end
- [ ] Test reject → feedback → new diagram loop
- [ ] Test code generation output quality with multiple prompt examples
- [ ] Tune system prompts for best Mermaid diagram output
- [ ] Tune codegen prompt to produce valid CRE YAML schema
- [ ] Store each iteration's diagram + feedback in `architecture_iterations` table

### Deliverable
Real Gemini-powered architecture proposals, regeneration loop, and CRE code generation working end to end. Wizard steps 1 and 2 fully functional with live AI.

---

## Phase 4 — x402 Payment Integration

**Goal:** Replace stub payment service with real x402 protocol — create payment requests, monitor on-chain confirmation, and gate code generation behind verified payment.

**Duration:** Week 4 (est. 4–5 days)

### Prerequisites
- Custom EVM chain config (RPC URL, chain ID, recipient wallet)
- x402 protocol library / spec documentation
- Phase 3 complete

### Tasks

- [ ] Research and install x402 Python library (or implement from protocol spec)
- [ ] Add payment env vars to `backend/.env`:
  - `X402_RECIPIENT_ADDRESS`
  - `X402_PAYMENT_AMOUNT_ETH`
  - `X402_RPC_URL`
  - `X402_CHAIN_ID`
- [ ] Build `payment_service.py` — `PaymentService` class:
  - [ ] `create_request(session_id)` — generate payment_id, amount, recipient, deadline and persist to DB
  - [ ] `verify_tx(tx_hash, payment_id)` — poll EVM via RPC for tx receipt
  - [ ] `poll_until_confirmed(tx_hash, timeout=60)` — async polling loop with timeout
  - [ ] `mark_verified(payment_id, tx_hash, block_number)` — update DB record
- [ ] Wire into `POST /payment/create` and `POST /payment/verify` routers
- [ ] Update frontend `Step3` — call real `/payment/create` to get amount/recipient
- [ ] Update frontend `Step3` — use wagmi `useSendTransaction` for real wallet transaction
- [ ] Update frontend `Step3` — call `/payment/verify` with real `tx_hash` after send
- [ ] Handle payment timeout gracefully (UI + backend)
- [ ] Test full payment flow on custom EVM testnet
- [ ] Verify payment gate — confirm code generation is blocked without verified payment

### Deliverable
Real on-chain x402 payment gate working. Steps 3 is fully functional. Code generation only proceeds after on-chain confirmation.

---

## Phase 5 — Chainlink CRE Deployment Integration

**Goal:** Replace stub deploy service with real CRE CLI calls — generate validated workflow artifacts and deploy autonomously into the Chainlink Runtime Environment.

**Duration:** Week 4–5 (est. 5–7 days)

### Prerequisites
- Chainlink CRE CLI installed
- CRE API key
- Phase 4 complete

### Tasks

- [ ] Install and configure the CRE CLI on the backend server
- [ ] Add `CRE_API_KEY` to `backend/.env`
- [ ] Research CRE YAML workflow schema and document required fields
- [ ] Research CRE JS function format and constraints
- [ ] Update Gemini codegen prompt to produce schema-compliant CRE YAML
- [ ] Build `deploy_service.py` — `DeployService` class:
  - [ ] `write_artifacts(session_id, yaml_content, js_content)` — write to `tmp/{session_id}/`
  - [ ] `run_cre_cli(session_id, api_key)` — `subprocess.run(['cre', 'deploy', ...])` with timeout
  - [ ] `parse_cli_output(stdout, stderr)` — extract `workflow_id` from stdout
  - [ ] `cleanup(session_id)` — remove tmp files after deploy
  - [ ] `deploy(session_id, yaml_content, js_content)` — full deploy pipeline with retry (max 2)
- [ ] Add YAML schema validation step before calling CRE CLI
- [ ] Wire `DeployService` into `POST /deploy` router
- [ ] Persist deployed workflow details to `deployed_workflows` table
- [ ] Update frontend `Step4` — display real `workflow_id` returned from backend
- [ ] Test deploy flow with a simple CRE workflow example
- [ ] Test error handling — bad YAML, CLI failure, timeout
- [ ] Test retry logic

### Deliverable
Full prompt-to-deployed-workflow pipeline working end to end. All 4 wizard steps functional with real data. Automated CRE deployment confirmed.

---

## Phase 6 — Testing, Polish & Production Deploy

**Goal:** Harden the app, fix edge cases, polish the UI, and deploy to production.

**Duration:** Week 5–6 (est. 5–7 days)

### Testing Tasks

- [ ] Write backend unit tests — `AgentService`, `PaymentService`, `DeployService`
- [ ] Write integration tests — full wizard flow (propose → pay → deploy)
- [ ] Test rejection loop with 5+ iterations
- [ ] Test payment failure and retry flows
- [ ] Test CRE CLI failure and retry flows
- [ ] Test with multiple wallet addresses
- [ ] Test history page with real data
- [ ] Cross-browser testing — Chrome, Firefox, Safari
- [ ] Mobile responsive testing

### Frontend Polish Tasks

- [ ] Add loading skeletons to Dashboard and History pages
- [ ] Add toast notifications for success/error events
- [ ] Add error boundary components
- [ ] Empty state designs for history page (new user)
- [ ] Wallet disconnect handling — redirect to landing
- [ ] Add `/architecture` link to landing page footer
- [ ] SEO meta tags and og:image

### Backend Hardening Tasks

- [ ] Add request rate limiting (per wallet address)
- [ ] Add input validation — max prompt length, allowed characters
- [ ] Add authentication middleware — verify wallet signature on protected routes
- [ ] Add structured logging
- [ ] Add health check endpoint `GET /health`
- [ ] Secure all env vars — no secrets in code

### Production Deploy Tasks

- [ ] Set up PostgreSQL (Railway / Supabase / Render)
- [ ] Deploy FastAPI backend (Railway / Render / Fly.io)
- [ ] Deploy Next.js frontend (Vercel)
- [ ] Configure production env vars on both platforms
- [ ] Set up custom domain
- [ ] Final end-to-end smoke test on production

### Deliverable
OnyxLab live in production. Full pipeline tested and hardened.

---

## Timeline Summary

| Phase | Focus | Duration | Status |
|---|---|---|---|
| Phase 1 | Frontend UI | Week 1 | ✅ Complete |
| Phase 2 | FastAPI Backend + Database | Week 2 | 🔲 Not started |
| Phase 3 | Gemini AI Agent | Week 3 | 🔲 Not started |
| Phase 4 | x402 Payment Integration | Week 4 | 🔲 Not started |
| Phase 5 | CRE Deployment Integration | Week 4–5 | 🔲 Not started |
| Phase 6 | Testing, Polish & Production | Week 5–6 | 🔲 Not started |

---

## Dependency Chain

```
Phase 1 (done)
    ↓
Phase 2 — Backend scaffold + DB
    ↓
Phase 3 — Gemini agent (requires backend)
    ↓
Phase 4 — x402 payment gate (requires agent to generate code post-payment)
    ↓
Phase 5 — CRE deploy (requires payment verified before deploy runs)
    ↓
Phase 6 — Testing + deploy (requires all above complete)
```

> Phases 3, 4, and 5 must be built in order — each one unlocks the next step of the wizard.

---

## Environment Variables Checklist

### Frontend (`/.env.local`)
```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend (`/backend/.env`)
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/onyxlab

# Gemini
GEMINI_API_KEY=

# x402 / EVM
X402_RECIPIENT_ADDRESS=
X402_PAYMENT_AMOUNT_ETH=0.002
X402_RPC_URL=
X402_CHAIN_ID=

# Chainlink CRE
CRE_API_KEY=

# App
ENVIRONMENT=development
SECRET_KEY=
```

---

## Key Decisions Still Open

| Decision | Notes |
|---|---|
| Which EVM chain for x402 | Confirm chain ID and RPC URL |
| CRE YAML schema version | Verify against latest CRE CLI docs before Phase 5 |
| Gemini model | `gemini-1.5-pro` recommended; switch to `gemini-2.0-flash` for speed if latency is an issue |
| Payment amount | Currently `0.002 ETH` — adjust based on CRE deployment cost |
| Backend hosting | Railway recommended for FastAPI + Postgres bundle |
