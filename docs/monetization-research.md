# Ask Wisely — Monetization Opportunities Research

*Research date: July 2026. Method: five parallel research agents (codebase asset audit, business-analogue research, agent-first/API monetization, niche B2B verticals, distribution & SEO economics), synthesized through the Solo Business Idea Generation Skill v2 framework — structural change → expensive human loops → niche WTP → distribution → Stage 13 scoring → vetoes → 2030 test.*

---

## Executive summary

Ask Wisely's monetizable asset is **not the 203 prompts** — it's the combination of (a) a clean, structured, machine-readable library with an open JSON API, (b) an SEO surface with real traffic, and (c) a curation brand. Selling prompts retail is a proven dead end (PromptBase sellers net ~$267/mo; FlowGPT pivoted to roleplay; the GPT Store pays ~$0.03/conversation). The Tailwind Labs collapse (revenue −80% as AI intercepted docs traffic) is the direct warning: **any plan built on human pageviews funneling to an upsell is a melting iceberg — and prompt content is the easiest content in the world for a model to substitute.**

Three plays survived the scoring bar (≥50/70). One foundation layer fell below the bar as a standalone business but costs days and should be done anyway.

| # | Play | Score | One-line promise |
|---|------|-------|------------------|
| 1 | **Verified Prompt Registry** — continuous model-regression verification | **56/70** | "Every prompt in this library is re-tested against every major model release. Here's proof." |
| 2 | **Agent-first distribution** — MCP server + skill marketplaces | **53/70** | "The prompt library every agent can call." |
| 3 | **Grant-writer vertical** — deep production-replacing workflow product | **52/70** | "Turn an RFP into a submission-ready proposal narrative." |
| — | Foundation layer: email capture, affiliates, featured listings | 44/70 | Not a business; a revenue floor. Do in days. |
| ✗ | Chrome extension (AIPRM clone) | 41/70 | Rejected standalone — timing gone, incumbent entrenched. |
| ✗ | Paid skill packs alone | 44/70 | Rejected standalone — zero moat; fold into #1/#2 as SKUs. |

**Recommended sequence:** Foundation layer now (days) → Play 2 next (it's the distribution rail Play 1 rides on, ~1–2 weeks) → Play 1 as the flagship differentiated product (weeks, ongoing) → Play 3 as the separate, higher-ceiling vertical bet once the first three are shipped.

---

## What the codebase audit found (constraints & assets)

- **Fully static** (React 19 + Vite 6, GitHub Pages, zero backend). Any gating/payments/metering needs a new layer — **Cloudflare Workers is the lowest-friction path** since Cloudflare is already in the stack (analytics + likely DNS).
- **203 owned prompts** (92 text, 53 image, 58 skills) as markdown + YAML frontmatter, compiled to `public/prompts.json` (~318 KB, fully public and scrapeable). Plus 72 curated *external* Claude Code skill links (`lib/skills-data.ts` — directory value only, not owned content).
- **Premium-tier levers already in the schema**: `llmVariants`, `workflow[]`, `exampleInput/Output`, `variables[]`, `difficulty`. The free/paid split writes itself: base prompt free, enriched layer (variants, workflows, eval metadata) gated.
- **No email list ownership** — the Subscribe CTA points at Substack, which owns the list. **No payments, no auth, no first-party analytics beyond Cloudflare's beacon.**
- **No LICENSE file.** README badge says "open-source"; footer says "personal and educational use." Legally this means default copyright (commercial rights retained by the owner) — good for monetizing — but the messaging is contradictory and must be cleaned up (explicit content license, e.g. CC-BY-NC for content + a code license) *before* charging for anything, to preempt the "it was advertised as free" objection.

---

## Play 1 — Verified Prompt Registry (flagship, 56/70)

### The structural change (Stage 1)
Model churn became the dominant pain of 2025–26: OpenAI's silent April 2025 GPT-4o update broke JSON-extraction prompts on ~15% of calls; the April 2026 Opus 4.7 release triggered a 2,300-upvote regression thread within 48 hours. Meanwhile eval tooling matured and commoditized (promptfoo is free/MIT; OpenAI acquired it in March 2026; Braintrust and Langfuse charge **$249/mo** for regression tooling). Verification became cheap to *run* and expensive to *not have*.

### The idea
Run all 203 prompts (and future additions) through promptfoo-style evals against every major model release. Add machine-readable trust metadata to `prompts.json`: `last_verified_model`, `verified_date`, per-model pass/fail, known regressions. The free library becomes **the only prompt source an agent has a machine-readable reason to prefer over scraping Reddit**.

Monetization ladder:
1. **Free:** verification badges on the site + basic metadata in the public JSON (this *is* the marketing — trust signal + AI-citation bait).
2. **Paid ($10–20/mo, Stripe/Gumroad):** "Model Update Regression Report" — when GPT-5.x / Opus next / Gemini next ships, subscribers get within 48h: what broke, what changed, rewritten variants. Recurring trigger (Stage 9: *every model release*), not a subscription to static text.
3. **Paid API tier (API key on a Cloudflare Worker, later x402-gated):** enriched eval-metadata endpoints, bulk export, commercial license — sold to AI-app developers and agents.
4. **Enterprise (later):** "prompt regression CI" — teams submit *their own* prompt suites for continuous verification against model releases. This is where the $249/mo anchor pricing lives.

### Stage 13 scores
| Pain | Timing | Distribution | Monetisation | Competition | AI durability | Founder leverage | **Total** |
|---|---|---|---|---|---|---|---|
| 8 | 9 | 7 | 7 | 8 | **9** | 8 | **56/70** |

### Why it passes the hard filters
- **AI substitution test (Stage 11):** "Just ask Claude" cannot tell you whether a prompt still works on a model released yesterday — that requires *running* it, continuously, and having history. The moat is a **proprietary feedback loop + continuous monitoring**, two of the Stage 11 ownable assets.
- **2030 test (Stage 17):** the more models ship and the faster they churn, the more valuable independent verification becomes. This business gets **stronger** as AI improves — the only candidate with that property.
- **Analogues (Stage 14):** Context7 (curated content library agents trust, freemium API), promptfoo/Braintrust (verified WTP for eval), SSL certificate authorities / Consumer Reports (trust-as-product on top of free-to-inspect goods).
- **Vetoes (Stage 16):** not a wrapper, not a chatbot, not "chat with your prompts." Clean.

### Force multiplication (Stage 15)
Enterprise = prompt CI for teams. API = enriched eval endpoints. Agent-to-agent = x402-metered verification calls. Open-source = publish the promptfoo configs (builds trust, the *history and freshness* stay proprietary). Marketplace = "verified" badge program for third-party prompt/skill authors.

---

## Play 2 — Agent-first distribution: MCP server + skill marketplaces (53/70)

### The structural change
MCP became the universal agent-integration layer (~97M SDK downloads/mo; Claude, ChatGPT, Copilot, Gemini, Cursor all speak it) and has a **native prompts primitive** — servers expose prompt templates directly. Skill marketplaces went from 1 registry (Dec 2025) to 8+ (Q2 2026), with SKILL.md portable across 20+ agents.

### The idea
One Cloudflare Worker fronting the existing static JSON — no database, no state:
- Tools: `search_prompts`, `get_prompt(id)`, `list_categories`; every prompt exposed as an MCP prompt template.
- Publish to the official MCP Registry, Smithery, Glama, PulseMCP; apply to Anthropic's Claude Connectors Directory (~554 connectors — still land-grab territory).
- Ship a free GitHub-hosted Claude Code plugin marketplace (`marketplace.json`) for the skills content.
- Ship `llms.txt` + markdown mirrors (near-zero cost agent-readiness).
- Monetize later with KV-backed API keys for rate tiers, and 2–3 **opinionated premium skill packs** ($9–19 on Agensi at 70% rev share / Gumroad) — top-decile skills earn $500–3,000/mo; median is <$50/mo, so treat packs as experiments, not the plan.

### Stage 13 scores
| Pain | Timing | Distribution | Monetisation | Competition | AI durability | Founder leverage | **Total** |
|---|---|---|---|---|---|---|---|
| 6 | 10 | 9 | 5 | 7 | 6 | **10** | **53/70** |

### Why it matters more than its monetisation score
This is the **AIPRM lesson executed on 2026 rails**: AIPRM (~$10k+/mo, the most successful pure prompt-library monetization found) won by putting the library *inside someone else's workflow*, not by content. In 2026 the workflow surface is the agent runtime, not the ChatGPT tab. And per the Tailwind warning, machine consumption is the surface that *grows* while human pageviews decay. Play 2 is also the distribution rail for Play 1 — verification metadata is only valuable if agents actually consume the API.

**Direct analogue:** Context7 (Upstash) — a content library exposed as an MCP server, exactly Ask Wisely's shape, became one of the most-installed MCP servers via free tier → API key → paid tiers. Others: Ref ($0.009/doc-search call), Apify Store creators (top independents >$10K MRR, 80% rev share).

---

## Play 3 — Grant-writer vertical (52/70)

### The hidden API (Stages 3–5)
A freelance grant writer is a human paid per document: **~$1,500 average per proposal narrative** ($500–$10k+ range, 20–200 hours each), at $100–250/hr. Pure text production, deadline-driven, recurring per application (Stage 9), **no HIPAA/PHI moat blocking a prompt product** (unlike therapy notes, ranked #3, where a prompt library can't ship a BAA). Existing SaaS anchors prove payment: Grantable $50–150/mo, Instrumentl $179–499/mo, Grantboost $19.99–29.99/mo; Grant Assistant was acquired by FreeWill in late 2025. The gap: everyone sells software seats; **nobody owns the complete workflow system** (RFP deconstruction → logic model → narrative sections → budget justification → funder-voice rewriting → reporting).

### The idea
A deep, opinionated grant-writing workflow product — launched as a premium pack/system off the Ask Wisely funnel, priced **£199–299/yr or per-proposal** (trivial against a $1,500/document mental model). The existing Business/Academic prompt categories and the `workflow[]` schema field are the seed. Distribution: Grant Professionals Association (~3,100 members), r/grantwriting, r/nonprofit, active FB groups where $25–60 template packs already sell.

Runner-up vertical if this stalls: **immigration petition drafting** (O-1/EB-1/NIW letters) — highest WTP found ($250/mo Drafty anchor, $5–15k legal fees) but lawyer sales cycles and liability friction make it a harder solo start. Real estate: reach is unmatched (Lab Coat Agents 165k members) but prices are commodity ($10–30 packs) — use as free top-of-funnel only.

### Stage 13 scores
| Pain | Timing | Distribution | Monetisation | Competition | AI durability | Founder leverage | **Total** |
|---|---|---|---|---|---|---|---|
| 9 | 7 | 7 | **9** | 6 | 6 | 8 | **52/70** |

**Caveat (Stage 11):** a raw prompt pack here will eventually be "just ask the agent." Durability requires accreting the ownable assets: funder-specific knowledge (what each foundation actually funds, tone, past awards), community trust, and per-funder templates — proprietary data + community, not prompt text.

**Analogues:** God of Prompt ($150 lifetime vertical bundles to non-technical buyers), Grantboost/Grantable (vertical WTP proof), CLSkillsHub ($45–49 opinionated config packs).

---

## Foundation layer — do now, in days (not scored as a business)

These fell below 50/70 as standalone businesses but are the revenue floor and cost almost nothing:

1. **Own the email list.** Move capture off Substack's domain (or at minimum add first-party capture with a lure: "all 203 prompts as JSON/Notion export," "20 best new prompts monthly"). Every durable winner in the analogue research (Wes Bos, TLDR, Ben's Bites, Easlo, TAAFT) owned an inbox audience. Utility-site opt-in benchmarks: 2–5%. Sponsorship math starts working at ~5k engaged subs (~$100–200/send; AI-niche CPMs $15–50, dev newsletters $60–150).
2. **Affiliate placements where programs exist.** Blunt finding: **ChatGPT and Claude buttons pay nothing** (no consumer affiliate programs). But Perplexity pays up to **$20/qualified Comet lead**, ElevenLabs 22%/12mo, Jasper 25% recurring, Writesonic 30% lifetime. Keep "Open in Claude/ChatGPT" unmonetized (retention feature); add monetized "run this in X" deep-links on matching categories (voice prompts → ElevenLabs, marketing → Jasper). Realistic: $250–750/mo at ~50k visits. Disclosure required.
3. **Supply-side listings (the TAAFT model).** Directories monetize the people who want to *reach* the audience, not the readers — TAAFT charges $347/featured listing at 3–4M visits. At Ask Wisely's scale: $29–99 featured placements for AI tools in relevant categories, with outreach; $300–1,000/mo potential at 50k visits.
4. **Fix the license** (prerequisite for everything paid — see audit section).

**Explicitly avoid:** GPT Store payouts as a revenue line (~$0.03/conversation, $100–500/mo ceiling), paid Discord (Whop median creator: $74/mo, 88% earn nothing), mass programmatic "[profession] prompts" pages (Helpful-Content-Update roadkill — one documented 50k-page build was 98% deindexed in 3 months), and a Chrome-extension-first strategy (median extension: 18 users; AIPRM's window was 2023).

Realistic full-stack revenue math from the distribution research:

| Monthly visitors | Email list (yr 1) | Newsletter sponsorship | Affiliate + listings | Paid product | Total/mo |
|---|---|---|---|---|---|
| 10k | ~2.5–3.5k | $100–300 | $100–300 | $50–150 | **$250–750** |
| 50k | ~12–18k | $1,000–2,500 | $500–1,200 | $400–1,000 | **$2k–4.5k** |
| 200k | ~50–70k | $4k–10k | $2k–4k | $2k–5k | **$8k–19k** |

---

## What was rejected and why (Stage 16 vetoes applied)

- **Per-prompt retail / marketplace listing:** every analogue produced pocket money (PromptBase seller: ~$267/mo at 335 sales). 203 SKUs is a traffic asset, not inventory.
- **Chrome extension as the lead play (41/70):** AIPRM's 2023 timing is gone; in-chat prompt improvers erode the value prop; MV3 policy churn is a standing tax. Revisit only as a distribution surface after Plays 1–2 exist.
- **Paid community:** engagement without a wedge ≠ revenue (Snack Prompt, FlowGPT). Whop data confirms.
- **Pay-per-crawl / TollBit:** a 203-item library has trivial crawl surface, and paywalling the JSON kills the distribution Plays 1–2 depend on. Ship free `llms.txt`; skip the paywall. (Also: 97% of llms.txt files currently get zero AI requests — it's hygiene, not revenue.)
- **"Prompt search demand" pSEO:** ~25% projected search-volume decline, AI Overviews intercept exactly these queries, ChatGPT sends ~190x less referral traffic than Google per query. Shift the taxonomy to where demand moved instead: "cursor rules for [framework]," "claude skill for [task]," "AGENTS.md examples" — low competition now, and native fit for a structured library.

---

## The 2030 test, applied

By 2030, frontier AI writes better prompts than any library on demand. What survives from this plan:

- **Play 1's verification history and freshness** — a model can't fake "we ran this yesterday on the release that shipped this morning." Continuous monitoring + proprietary feedback loop. *Appreciates* as model churn accelerates.
- **Play 2's registry placements and integration surface** — distribution inside agent runtimes, accumulated while directories were small.
- **Play 3's funder-specific data and community trust** — if (and only if) the vertical product accretes proprietary data beyond prompt text.
- **The email list** — the one channel AI cannot intercept.

What does *not* survive: the prompts themselves, human pageview funnels, and anything whose value proposition is "curated text." Build accordingly.

---

## Appendix: research provenance

Five research agents, July 2026:
1. **Codebase asset audit** — repo inventory (stack, content model, API surface, analytics/payments/license status).
2. **Business analogues** — PromptBase, AIPRM, God of Prompt, FlowGPT/Kaon, PromptHero, Snack Prompt, awesome-chatgpt-prompts, Tailwind Labs, Wes Bos, TLDR, Ben's Bites, TAAFT, RemoteOK, Envato, Easlo. Confidence-flagged ([strong]/[medium]/[weak]) per source; headline creator-earnings claims are survivorship-biased.
3. **Agent-first monetization** — MCP ecosystem, Context7/Ref/Apify precedents, x402 (~$50M cumulative volume, sub-cent avg transactions) and Stripe Machine Payments Protocol, skill marketplaces (Agensi 70/30, $5–25 price points), pay-per-crawl/TollBit, eval/regression market (Braintrust/Langfuse $249/mo, promptfoo→OpenAI).
4. **Niche verticals** — grant writers, immigration practitioners, therapists, real estate agents ranked by pain × WTP × reachability, with pricing anchors and community evidence for each.
5. **Distribution & SEO** — marketplace economics (Chrome, VS Code, Raycast, Obsidian, Figma, GPT Store/ChatGPT Apps, Claude directory), 2026 search-demand shifts, pSEO survivor/casualty analysis, affiliate program terms, newsletter/sponsorship benchmarks.

Full source URLs are embedded in the agent briefs; key ones are cited inline above by name.
