# OnyxLab

**Autonomous prompt-to-product platform for Web3 automation.**

Describe any blockchain automation in plain English. OnyxLab's AI agent — powered by the Gemini API — designs it as a Mermaid.js architecture diagram, iterates with you until it's right, gates execution behind an x402 microtransaction, then autonomously writes and deploys the workflow directly into the Chainlink Runtime Environment (CRE).

---

## How It Works

```
[1] Describe  →  [2] Review Architecture  →  [3] Pay (x402)  →  [4] Auto-Deploy to CRE
```

1. **Prompt** — User describes the desired Web3 automation in plain English
2. **Propose** — Gemini agent generates a Mermaid.js flow diagram of the proposed architecture
3. **Iterate** — User approves or rejects; agent regenerates until the design is accepted
4. **Pay** — Agent halts and issues an x402 microtransaction request on a custom EVM chain
5. **Deploy** — Post-payment, agent generates CRE Workflow YAML + JS and deploys via the CRE CLI autonomously

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| Next.js 16 + React 19 | App framework (App Router) |
| Tailwind CSS v4 | Styling |
| RainbowKit + wagmi + viem | Wallet connection |
| Mermaid.js | Architecture diagram rendering |
| Framer Motion | Animations |
| TanStack Query | Server state management |

### Backend _(in `/backend` — coming soon)_
| Technology | Purpose |
|---|---|
| FastAPI (Python) | API server |
| Google Gemini API | AI agent (architecture + code generation) |
| x402 Protocol | Microtransaction payment gate |
| Chainlink CRE CLI | Autonomous workflow deployment |
| PostgreSQL + SQLAlchemy | Data persistence |

---

## Project Structure

```
onyxlab/
├── app/
│   ├── layout.tsx              # Root layout with providers
│   ├── page.tsx                # Landing page
│   ├── dashboard/page.tsx      # Dashboard (wallet-gated)
│   ├── wizard/page.tsx         # 4-step workflow wizard
│   ├── history/page.tsx        # Past workflows, payments & deployments
│   └── architecture/page.tsx  # System architecture diagrams (10 diagrams)
├── components/
│   ├── Navbar.tsx              # Shared navigation with wallet button
│   └── MermaidDiagram.tsx      # Client-side Mermaid renderer
├── lib/
│   ├── wagmi.ts                # Wagmi + custom EVM chain config
│   └── providers.tsx           # RainbowKit + Wagmi + ReactQuery providers
├── backend/                    # FastAPI backend (Python) — to be built
└── public/
```

---

## Pages

| Route | Description |
|---|---|
| `/` | Landing page — platform overview, how it works, features |
| `/dashboard` | Main app page after wallet connect — stats + recent workflows |
| `/wizard` | 4-step wizard: Prompt → Diagram → Payment → Deploy |
| `/history` | Full audit trail — prompts, payments, workflow IDs, CRE status |
| `/architecture` | 10 Mermaid.js system architecture & flow diagrams |

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in the project root:

```env
# WalletConnect — get a free project ID at https://cloud.walletconnect.com
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here

# Gemini API — https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here

# x402 Protocol
X402_RECIPIENT_ADDRESS=0xYourWalletAddress
X402_PAYMENT_AMOUNT_ETH=0.002

# CRE CLI
CRE_API_KEY=your_cre_api_key_here

# PostgreSQL
DATABASE_URL=postgresql://user:password@localhost:5432/onyxlab
```

### 3. Run the frontend

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Run the backend _(coming soon)_

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

---

## Architecture

A full set of professional architecture diagrams is available at `/architecture`, including:

- System Architecture (all layers)
- User Flow
- Frontend Architecture
- Backend Architecture
- AI Agent Flow
- x402 Payment Protocol Flow
- CRE Deployment Flow
- End-to-End Sequence Diagram
- Wizard State Machine
- Data Model (ER Diagram)

---

## Roadmap

- [x] Landing page
- [x] Wallet connect (RainbowKit)
- [x] 4-step wizard UI (mocked)
- [x] Mermaid.js diagram rendering
- [x] History page
- [x] Architecture diagrams
- [ ] FastAPI backend
- [ ] Gemini agent integration (propose + regenerate + code-gen)
- [ ] x402 payment integration
- [ ] CRE CLI deployment integration
- [ ] PostgreSQL persistence
- [ ] Production deployment
