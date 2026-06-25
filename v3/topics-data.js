/* =========================================================================
   topics-data.js
   This file holds the exact same content as topics.json, just wrapped as a
   JS variable assignment instead of a bare JSON document. Browsers block
   fetch()/XHR of local files under the file:// protocol (Chrome's CORS
   policy), but a plain <script src> include works everywhere, including
   when this app is opened by double-clicking index.html with no server.

   To add or edit a topic: edit the array below (or edit topics.json and
   copy its contents back in here) -- app.js never needs to change.
   ========================================================================= */

window.TOPICS_DATA = [
  {
    "id": "rules",
    "title": "Rules",
    "keywords": [
      "rules",
      "guardrails",
      "policy",
      "constraints",
      "allow list",
      "deny list",
      "system prompt rules"
    ],
    "summary": {
      "junior": "Rules are the boundaries you give an AI agent so it knows what it is allowed to do — similar to validation logic in a C# service, but written in plain language inside a system prompt.",
      "senior": "Rules are enforced as a layered policy: system-prompt instructions, schema-validated tool inputs/outputs, and a deterministic guardrail layer that runs outside the LLM so behavior is not solely dependent on the model following instructions.",
      "architect": "Rules form the governance layer of an agentic system: a defense-in-depth stack of prompt-level policy, programmatic validation, and external guardrail services, versioned and audited like any other compliance control, with explicit trade-offs between agent autonomy and organizational risk tolerance."
    },
    "details": {
      "junior": "Think of rules the way you think of input validation and authorization checks in a typical ASP.NET Core API. When you build an AI agent, you cannot fully trust the model to always do the safe thing just because it is smart — you write explicit rules, usually in the system prompt, telling it what it must do, what it must never do, and what it should ask permission for. For example: 'Never delete a file without confirmation', 'Always respond in the user's language', or 'Never reveal API keys'. These rules live alongside the agent's instructions and are the first thing the model reads before it does anything else.\n\nArchitecture overview: a user request enters the system, passes through the rule engine / guardrail layer, and only a validated action reaches execution. Process flow: Request -> Rule Engine -> Validated Action -> Output.\n\nIn practice, rules alone are not bulletproof, because the model is a probabilistic system — it can be tricked or simply make mistakes. Good agent systems add a second layer of protection: code that checks the agent's actions before they happen, similar to a permission middleware that runs in front of a controller action. If the agent tries to call a 'delete file' tool, the surrounding application code can intercept that call and ask for human approval, exactly like a confirmation dialog in a desktop app.\n\nBest practices: keep rules short and specific, put the most important rule first and last in the prompt (models pay more attention to the edges), and always back critical rules with code-level checks. Common mistakes: writing vague rules ('be careful'), assuming the LLM will always obey instructions perfectly, and trusting the prompt alone with no code-level safety net.\n\nReal-world implementation: a customer support agent instructed 'never offer refunds above $50' should also have that limit enforced by validating the refund tool call itself, not just trusted to the model's judgement.\n\nInterview questions: 'What is the difference between a system prompt rule and a guardrail?' 'Why can't you rely purely on prompt instructions for safety?' 'How would you stop an agent from taking a destructive action?' The answer always comes back to combining clear natural-language rules with deterministic code checks — the same defense-in-depth thinking you already apply to authorization in traditional backend development.",
      "senior": "As a senior engineer, you should treat rules as a multi-layer enforcement system, not a single prompt paragraph. Layer 1 is the system prompt itself — clear, prioritized, written in imperative language ('You must...', 'You must never...'). Layer 2 is structured output validation: tool calls are defined with JSON Schema (similar to a DTO contract in C#), and any call that doesn't validate is rejected before it executes, regardless of what the model 'intended'. Layer 3 is a programmatic guardrail service that runs independently of the LLM — pattern matching, allow-lists/deny-lists, rate limits, and business-rule checks that mirror how you'd write a FluentValidation pipeline or an authorization handler in ASP.NET Core.\n\nArchitecture overview: User Intent -> Policy Rules (allow/deny/require-approval) -> Agent Execution Layer -> Audit Log. The audit log is essential — every rule evaluation and override should be logged so behavior can be reviewed and rules tuned over time, exactly like reviewing authorization logs in a production API.\n\nProcess flow: incoming intent is classified, matched against policy rules, and either auto-approved, blocked, or routed to a human-in-the-loop approval step before the agent's tool call executes.\n\nBest practices: version your rule sets like code (with tests!), write negative test cases that try to break the rules (prompt injection attempts, edge-case phrasing), and separate 'soft' rules (style/tone preferences) from 'hard' rules (security/compliance) so hard rules can be enforced outside the model entirely. Common mistakes: conflating prompt-level guidance with actual security controls, not testing rules against adversarial inputs, and forgetting that tool permissions (what the agent *can* call) are a stronger control than what you *ask* it not to call.\n\nReal-world implementation: a coding agent with file-system access enforces 'never modify files outside /src' both as a prompt rule and as a hard-coded path check in the tool implementation itself — the second one is what actually prevents damage.\n\nInterview questions: 'How do you test that an agent's rules actually hold under adversarial input?' 'Where would you put a rule that absolutely cannot be violated — prompt or code?' 'How do you audit rule violations in production?'",
      "architect": "At the architecture level, rules are a governance and risk-management discipline, not a prompt-writing exercise. You are designing a policy-as-code system that sits between business risk appetite and agent autonomy: the more autonomous and consequential an agent's actions (financial transactions, infrastructure changes, customer communications), the more the rule layer must shift from 'prompt suggestion' to 'deterministic, externally enforced policy' — comparable to how a financial system separates business logic from the immutable ledger and approval workflow.\n\nArchitecture overview: User Intent -> Policy Rules Engine (often a dedicated service, separate from the LLM call) -> Agent Execution Layer -> Audit Log, with the policy engine versioned, testable, and independently deployable from the agent's prompts and model version. This decoupling matters because model upgrades change behavior; your compliance posture should not change with every model swap.\n\nKey trade-offs you must own: autonomy vs. control (more autopilot increases velocity but increases blast radius of failure), centralized policy engine vs. embedded per-agent rules (centralization gives consistency and auditability but adds latency and a single point of failure), and static rules vs. learned/adaptive policies (adaptive rules can reduce false positives but are harder to certify for compliance).\n\nBest practices at scale: treat the rule set as a regulated artifact — change control, peer review, staged rollout, and rollback capability; maintain a rule-violation dashboard for security and compliance stakeholders; design rules to fail closed (deny by default) for high-risk actions; and run red-team exercises specifically targeting prompt injection and rule bypass. Common mistakes at this level: under-investing in the guardrail service because 'the model is good enough now', allowing rule logic to live solely inside prompts with no externally testable contract, and failing to account for multi-agent systems where one agent's output becomes another agent's untrusted input.\n\nReal-world implementation: in a regulated fintech agent platform, the rules layer is implemented as an independent policy microservice (OPA-style policy evaluation) that every agent action must pass through, fully decoupled from prompt content, with its own SLA, versioning, and audit trail satisfying SOC2/ISO27001 requirements.\n\nInterview questions: 'How would you design a rules/guardrail system that scales across dozens of agents built by different teams?' 'What's your strategy for keeping policy enforcement consistent across model upgrades?' 'How do you balance agent autonomy against organizational risk tolerance?'"
    },
    "deepDive": {
      "junior": "In code, a 'rule' is rarely magic — it's a sentence in the system prompt plus a plain `if` check in the tool handler that runs before the action executes, so the model's intent never bypasses your own validation.",
      "senior": "Implement rules as a small chain of guard functions that run before the tool body executes — each one can reject the call with a reason string the model can read and react to, instead of failing silently.",
      "architect": "Externalize the guard chain into a policy module the tool layer calls into, so the same enforcement logic is shared and testable across every agent and tool in the platform, independent of any single prompt."
    },
    "deepDiveCode": {
      "language": "javascript",
      "caption": "A minimal guard clause enforcing a refund-limit rule before the tool actually runs",
      "snippet": "// Tool the model can call: issue_refund({ orderId, amount })\nasync function issueRefund({ orderId, amount }) {\n  // Hard rule, enforced in code -- NOT just requested in the prompt.\n  const REFUND_LIMIT = 50;\n  if (amount > REFUND_LIMIT) {\n    // Reject with a reason the model can relay to the user / escalate.\n    return { ok: false, reason: `Refunds over $${REFUND_LIMIT} need human approval.` };\n  }\n  return processRefund(orderId, amount);\n}"
    },
    "images": [
      {
        "url": "images/rules-flow.svg",
        "caption": "Request flowing through a rule engine / guardrail before being executed"
      },
      {
        "url": "images/rules-layers.svg",
        "caption": "Layered rules architecture from user intent to audit log"
      }
    ],
    "references": [
      {
        "title": "OpenAI - Guardrails for Agents",
        "url": "https://platform.openai.com/docs/guides/agents"
      },
      {
        "title": "Anthropic - Building Effective Agents",
        "url": "https://www.anthropic.com/research/building-effective-agents"
      },
      {
        "title": "OWASP - LLM Top 10",
        "url": "https://owasp.org/www-project-top-10-for-large-language-model-applications/"
      }
    ]
  },
  {
    "id": "swarm",
    "title": "SWARM",
    "keywords": [
      "swarm",
      "multi-agent",
      "orchestrator",
      "agent handoff",
      "specialist agents",
      "multi-agent orchestration"
    ],
    "summary": {
      "junior": "A swarm is a team of small, specialized AI agents working on one task together instead of one giant agent trying to do everything — similar to splitting a monolith into focused microservices.",
      "senior": "Swarm patterns implement an orchestrator agent that decomposes a task and hands off sub-tasks to specialist agents, each with its own narrow system prompt and tool set, coordinating through shared state or explicit handoff messages.",
      "architect": "Multi-agent swarm architectures trade single-agent simplicity for parallelism, specialization, and fault isolation, requiring explicit design decisions around orchestration topology, shared-state consistency, cost amplification, and failure containment across agent boundaries."
    },
    "details": {
      "junior": "If you've ever split a large God-class into smaller, single-responsibility services, you already understand the motivation behind a swarm. Instead of asking one AI agent to research, write code, test it, and write documentation all by itself, a swarm splits the job across several smaller agents: a Research Agent, a Coding Agent, a Review Agent — each with a narrower job and a simpler prompt, similar to how microservices each own one responsibility.\n\nArchitecture overview: an Orchestrator Agent receives the task, breaks it into pieces, and hands each piece to the right specialist agent; the specialists work (sometimes in parallel) and return results to the orchestrator, which merges them into a final answer. Process flow: Task -> Orchestrator -> Specialist Agents (parallel) -> Merged Result.\n\nBest practices: give each agent a clearly scoped job and a small, relevant toolset (a Research Agent doesn't need file-write access), and let the orchestrator be the only agent responsible for combining results. Common mistakes: making every agent able to do everything (defeats the purpose), and forgetting to define what happens when two agents disagree or one fails.\n\nReal-world implementation: a content-generation swarm might have an Outline Agent, a Writing Agent, and a Fact-Check Agent, coordinated by an Orchestrator that only proceeds to writing once the outline is approved.\n\nInterview questions: 'Why use multiple small agents instead of one large agent?' 'What does the orchestrator agent actually do?' 'How is this similar to a microservices architecture you've already worked with?'",
      "senior": "As an implementer, a swarm is an orchestration pattern, not a specific library — frameworks like OpenAI's Swarm/Agents SDK, AutoGen, and CrewAI all implement variations of the same idea: an orchestrator (or a routing function) decides which specialist agent handles the next step, and agents can 'hand off' control to one another by returning a structured signal rather than free text. This is conceptually close to a state machine or a Saga pattern you'd build for distributed transactions — each agent is a state, and a handoff is a transition.\n\nArchitecture overview: Orchestrator -> Agent A (Research) / Agent B (Code) / Agent C (Review), all reading and writing to Shared State / Handoffs, which functions like a shared cache or message bus between agents. Process flow: the orchestrator dispatches a sub-task, the specialist executes within its scoped tool set, writes its result to shared state, and either returns control to the orchestrator or hands off directly to the next agent.\n\nBest practices: design handoffs as structured data (not prose) so routing logic stays deterministic and testable; keep each agent's context window scoped to only what it needs (don't dump full conversation history into every specialist); add timeouts and fallback paths for any agent that fails or loops; and log every handoff for debuggability, the same way you'd log a state transition in a workflow engine. Common mistakes: unbounded recursive handoffs (Agent A hands to B, B hands back to A, forever), shared mutable state with no concurrency control when agents run in parallel, and cost blow-up from running many agents on tasks that a single well-prompted agent could have solved.\n\nReal-world implementation: a software-engineering swarm with a Planner agent, a Coder agent restricted to a sandboxed repo, and a Reviewer agent that must approve before the Coder's changes are merged — mirroring a PR review gate in your existing CI/CD pipeline.\n\nInterview questions: 'How do you prevent infinite handoff loops between agents?' 'How would you test a multi-agent handoff path deterministically?' 'When is a swarm worse than a single agent with a bigger prompt?'",
      "architect": "At the architecture level, a swarm is a distributed-systems problem wearing an AI costume, and you should evaluate it with the same rigor you'd apply to a microservices migration: does the added complexity (coordination overhead, partial failure modes, cost multiplication from N model calls instead of 1) actually buy you something a single, well-engineered agent could not — typically specialization quality, parallel throughput, or fault isolation between untrusted components.\n\nArchitecture overview: Orchestrator -> {Agent A, Agent B, Agent C} -> Shared State / Handoffs, where the orchestration topology itself is a design decision: centralized (one orchestrator routes everything, easy to reason about, single point of failure/bottleneck), decentralized (agents hand off peer-to-peer, more resilient, harder to audit), or hierarchical (orchestrators of orchestrators, for very large task decomposition).\n\nKey trade-offs: parallelism and specialization vs. coordination cost and latency; blast-radius containment (a compromised or hallucinating specialist agent has limited tool access) vs. the complexity of managing many narrow permission boundaries; and cost — N agents each making LLM calls can cost and latency-stack far more than one agent, so swarms are justified when task decomposition genuinely improves quality/parallelism, not by default.\n\nBest practices at scale: define an explicit handoff schema/contract (versioned, like an API contract between services); apply circuit breakers and max-hop limits to prevent runaway agent-to-agent loops; isolate each specialist's tool permissions following least privilege; and instrument every handoff with distributed tracing so a multi-agent run is debuggable end-to-end, exactly like tracing a request across microservices. Common mistakes: adopting swarms as a default architecture instead of a deliberate trade-off, no kill-switch for runaway multi-agent loops, and treating shared state as a free, consistent resource when concurrent agents are writing to it.\n\nReal-world implementation: an enterprise research-and-drafting platform uses a hierarchical swarm — a top-level orchestrator delegates to domain-specific orchestrators (legal, financial, technical), each of which manages its own specialist agents, with a unified audit/tracing layer across the whole tree.\n\nInterview questions: 'When would you choose a swarm architecture over a single capable agent?' 'How do you contain a failure or hallucination in one agent from corrupting the whole swarm's output?' 'How do you control the cost multiplication that comes with multi-agent systems at scale?'"
    },
    "deepDive": {
      "junior": "In code, a swarm is just a router function: it looks at the task (or the previous agent's structured output) and decides which specialist's prompt + tool set to call next.",
      "senior": "Implement handoffs as a typed return value (e.g. `{ next: 'coder', payload }`) rather than free text, so the orchestrator's routing logic is a simple switch statement, not a fragile string parse.",
      "architect": "Model the whole swarm as an explicit graph (nodes = agents, edges = allowed handoffs) so routing is data, not scattered if/else logic, and can be versioned, visualized, and unit tested independently of any model call."
    },
    "deepDiveCode": {
      "language": "javascript",
      "caption": "A tiny orchestrator routing to a specialist agent based on a structured handoff",
      "snippet": "async function runOrchestrator(task) {\n  let state = { stage: 'research', task, notes: [] };\n\n  while (state.stage !== 'done') {\n    const agent = AGENTS[state.stage];           // { research, code, review }\n    const result = await agent.run(state);        // calls its own scoped LLM + tools\n    state = { ...state, ...result.handoff };       // e.g. { stage: 'code', notes }\n  }\n  return state;\n}"
    },
    "images": [
      {
        "url": "images/swarm-flow.svg",
        "caption": "Task decomposed by an orchestrator and distributed to parallel specialist agents"
      },
      {
        "url": "images/swarm-layers.svg",
        "caption": "Swarm architecture with orchestrator, specialist agents, and shared state"
      }
    ],
    "references": [
      {
        "title": "OpenAI Swarm (experimental multi-agent framework)",
        "url": "https://github.com/openai/swarm"
      },
      {
        "title": "Microsoft AutoGen",
        "url": "https://microsoft.github.io/autogen/"
      },
      {
        "title": "CrewAI Documentation",
        "url": "https://docs.crewai.com/"
      }
    ]
  },
  {
    "id": "workflow",
    "title": "Workflow",
    "keywords": [
      "workflow",
      "pipeline",
      "dag",
      "deterministic",
      "orchestration",
      "state machine",
      "step function"
    ],
    "summary": {
      "junior": "A workflow is a fixed, predictable sequence of steps an agent follows — like a defined pipeline in Azure DevOps — as opposed to letting the agent decide everything freely on its own.",
      "senior": "Workflows implement agent behavior as an explicit, often graph-based, sequence of deterministic steps with defined inputs/outputs per step, contrasted with fully autonomous agent loops that decide their own next action.",
      "architect": "Workflow-based agent design is a deliberate point on the autonomy spectrum, trading flexibility for predictability, testability, and observability — essential for production systems where unconstrained agent loops are too unpredictable or expensive to run unsupervised."
    },
    "details": {
      "junior": "If you've built a CI/CD pipeline in GitHub Actions or Azure DevOps, you already understand workflows: a defined list of steps that run in order (or sometimes in parallel branches), each step doing one well-defined thing, with the pipeline failing fast if a step errors. An AI workflow applies that same idea to an agent: instead of saying 'figure out how to do this entire task yourself' (an autonomous loop), you define the steps yourself — Step 1: extract requirements, Step 2: call the LLM to draft a plan, Step 3: call a tool, Step 4: format the result — and the agent (or LLM call) only handles the part it's good at within each step.\n\nArchitecture overview: Trigger -> Step 1 -> Step 2 (Agent/Tool) -> Step 3 -> Result, where each arrow represents a defined hand-off with known inputs and outputs, just like passing artifacts between pipeline stages.\n\nBest practices: keep each step small and independently testable, validate the output of one step before passing it to the next (the same way you'd validate a build artifact before deploying it), and make steps idempotent where possible so a retry doesn't cause duplicate side effects. Common mistakes: cramming too much responsibility into one step (defeats the purpose of breaking it down), and not handling partial failures (what happens if step 3 fails after step 2 already succeeded?).\n\nReal-world implementation: a document-processing workflow — Upload -> Extract Text (tool) -> Summarize (LLM step) -> Human Review -> Store — where every step is observable and can be retried independently.\n\nInterview questions: 'What's the difference between a workflow and a fully autonomous agent?' 'Why would you choose a fixed workflow over letting the agent decide its own steps?' 'How do you handle a failure partway through a multi-step workflow?'",
      "senior": "As a senior engineer, you should recognize workflow-based agent design as the agentic-AI analogue of an explicit state machine or DAG-based orchestration engine (think Azure Durable Functions, Temporal, or a custom Saga implementation). Each node in the graph is a discrete unit of work — sometimes a deterministic function, sometimes an LLM call, sometimes a tool invocation — with explicit, typed inputs and outputs, and the graph defines the only valid paths execution can take.\n\nArchitecture overview: Workflow Definition (DAG) -> Step Executor -> State Store -> Error/Retry Handler. The State Store persists the workflow's progress so a long-running workflow can pause (e.g., for human approval) and resume later without losing context, similar to a durable-execution pattern. Process flow: a trigger instantiates a new workflow run, the executor walks the graph node by node, persisting state after each step, and the error handler decides whether to retry, skip, or escalate to a human on failure.\n\nBest practices: model the workflow as data (a graph definition), not as imperative code scattered across the system, so it can be visualized, versioned, and modified without redeploying; make every step's output schema-validated before the next step consumes it; and separate the deterministic steps from the LLM-driven steps so you only pay the cost/latency/non-determinism of an LLM call where it's actually needed. Common mistakes: putting an LLM call in every step 'just in case' when a simple function would do, no checkpointing (so any failure restarts the whole workflow from scratch), and conflating a workflow engine with an agent loop — they solve different problems and can be combined (a workflow step can itself contain an autonomous agent loop scoped to one task).\n\nReal-world implementation: an insurance-claims workflow with steps Intake -> Document Extraction (tool) -> Fraud-Risk Scoring (LLM + rules) -> Human Adjuster Review (conditional branch) -> Payout, persisted in a durable state store so a claim can sit in 'awaiting review' for days without losing progress.\n\nInterview questions: 'How would you persist and resume a long-running multi-step agent workflow?' 'How do you decide which steps should be deterministic code vs. LLM calls?' 'How is a workflow engine different from an agent loop, and when would you combine them?'",
      "architect": "At the architecture level, workflow-based design is where you trade agent autonomy for system-level guarantees — predictability, auditability, cost control, and the ability to formally test and certify behavior — which is often non-negotiable in regulated or high-stakes domains (finance, healthcare, infrastructure automation). The core architectural decision is where on the autonomy spectrum a given capability should sit: a rigid DAG-based workflow (most predictable, least flexible), a workflow with bounded agent-driven branches (flexible within guardrails), or a fully autonomous loop (most flexible, least predictable) — and different parts of the same system often need different points on that spectrum.\n\nArchitecture overview: Workflow Definition (DAG) -> Step Executor -> State Store -> Error/Retry Handler, typically backed by a durable-execution substrate (Temporal, Azure Durable Functions, AWS Step Functions, or a custom event-sourced state machine) so that workflows survive process restarts, can run for days or weeks, and provide replayable execution history for audit and debugging.\n\nKey trade-offs: rigidity vs. adaptability (a fixed DAG can't gracefully handle novel situations the designer didn't anticipate; an autonomous loop can, at the cost of predictability); centralized workflow engine vs. embedding workflow logic in each agent (centralization gives consistency, versioning and observability across the whole system, but becomes a critical-path dependency); and synchronous vs. durable/asynchronous execution (long-running workflows involving human approval steps need durable state, not in-memory orchestration).\n\nBest practices at scale: version workflow definitions independently from the code that executes them; build first-class support for human-in-the-loop pause/resume since most production agentic workflows need it eventually; instrument full execution tracing (every step, retry, and branch decision) for compliance and post-incident review; and design explicit compensation/rollback steps for workflows that touch external side effects (payments, infrastructure changes), the same discipline as the Saga pattern in distributed transactions. Common mistakes: choosing full agent autonomy where a workflow would have given the same outcome with far less risk and cost; under-investing in durable execution and losing workflow state on a deploy or crash; and no clear policy for when a workflow step is allowed to dynamically deviate from the defined graph.\n\nReal-world implementation: a loan-origination platform models the entire approval process as a durable workflow (Temporal-based), where most steps are deterministic, a small number of steps invoke a bounded, tool-restricted agent for document analysis, and any agent step that produces low-confidence output automatically routes to a human reviewer node before the workflow continues — combining workflow rigor with agent flexibility only where it earns its keep.\n\nInterview questions: 'How do you decide which parts of a system should be a rigid workflow vs. an autonomous agent?' 'How would you design for durable, resumable execution of a multi-day approval workflow?' 'What compensation strategy would you use if a workflow step with a real-world side effect fails after later steps have already run?'"
    },
    "deepDive": {
      "junior": "A workflow is often just an array of step objects your code loops over in order, calling a tool or an LLM at each one and checking the result before moving to the next step.",
      "senior": "Model each step as `{ id, run(state), next(state) }` so the graph (which step follows which) is data you can inspect and test, not control flow buried inside a long function.",
      "architect": "Persist `state` after every step to durable storage so the workflow can pause for human approval and resume later without re-running already-completed steps — the same idea as event sourcing."
    },
    "deepDiveCode": {
      "language": "javascript",
      "caption": "A tiny step-executor walking a workflow definition and persisting state after each step",
      "snippet": "const steps = [\n  { id: 'extract', run: extractText },\n  { id: 'summarize', run: summarizeWithLLM },\n  { id: 'store', run: saveResult },\n];\n\nasync function runWorkflow(input) {\n  let state = { input };\n  for (const step of steps) {\n    state = await step.run(state);\n    await persistState(step.id, state); // checkpoint -- survives a crash/restart\n  }\n  return state;\n}"
    },
    "images": [
      {
        "url": "images/workflow-flow.svg",
        "caption": "A multi-step workflow moving from trigger to result"
      },
      {
        "url": "images/workflow-layers.svg",
        "caption": "Workflow architecture with definition, executor, state store, and error handling"
      }
    ],
    "references": [
      {
        "title": "Temporal - Durable Execution",
        "url": "https://temporal.io/"
      },
      {
        "title": "Azure Durable Functions Overview",
        "url": "https://learn.microsoft.com/azure/azure-functions/durable/durable-functions-overview"
      },
      {
        "title": "AWS Step Functions",
        "url": "https://aws.amazon.com/step-functions/"
      }
    ]
  },
  {
    "id": "agent-protocol",
    "title": "Agent Protocol",
    "keywords": [
      "agent protocol",
      "mcp",
      "model context protocol",
      "a2a",
      "interoperability",
      "standard interface"
    ],
    "summary": {
      "junior": "An agent protocol is a standard, shared format that lets an AI agent talk to tools, data sources, or other agents in a consistent way — similar to how REST or OpenAPI gives every backend service a common language.",
      "senior": "Protocols like MCP (Model Context Protocol) and emerging agent-to-agent (A2A) standards define a transport, schema, and capability-discovery contract so agents and tool providers can interoperate without each integration being custom-built.",
      "architect": "Agent protocols are the interoperability layer that determines build-vs-integrate economics across an agent ecosystem — adopting an open standard reduces N×M integration cost to N+M but introduces dependency on the standard's security model, versioning, and governance."
    },
    "details": {
      "junior": "Imagine if every web API used a completely different format and you had to write custom integration code for every single one — that's roughly what AI tool integrations looked like before agent protocols existed. An agent protocol, like Anthropic's Model Context Protocol (MCP), defines a standard way for an AI agent to discover what tools/data sources are available and call them, similar to how OpenAPI/Swagger gives every REST API a predictable, machine-readable contract that any client can consume without custom code.\n\nArchitecture overview: Client App -> Protocol Layer (MCP/A2A) -> Tool or Agent Server -> Structured Response. The protocol layer standardizes the message format, so a single MCP-compatible agent can talk to a file-system server, a database server, or a search server without needing custom glue code for each one.\n\nBest practices: prefer a standard protocol over a one-off integration whenever one exists for your use case, and treat each protocol server like any other service boundary — validate inputs, handle errors, and version it. Common mistakes: building a bespoke integration for every tool when a standard protocol server already exists for it, and not handling the case where a protocol server is unavailable or returns an error.\n\nReal-world implementation: an AI coding assistant uses an MCP server to read and search a local Git repository, and a separate MCP server to query a Postgres database, both accessed through the same standard interface from the agent's perspective.\n\nInterview questions: 'What problem does a standard agent protocol solve compared to custom integrations?' 'How is MCP similar to OpenAPI/REST conventions you already use?' 'What happens if a tool server defined by the protocol goes down?'",
      "senior": "As an implementer, you should think of an agent protocol as defining three things: transport (how messages move — typically JSON-RPC over stdio or HTTP/SSE for MCP), schema (how capabilities, tools, and resources are described so an agent can discover them at runtime rather than being hard-coded), and lifecycle (how a connection initializes, negotiates capabilities, and handles errors). This is directly analogous to designing a well-versioned internal API: you're building a contract that multiple consumers (agents) and multiple providers (tool servers) can rely on without bilateral custom integration.\n\nArchitecture overview: Agent -> Protocol (Schema + Auth + Transport) -> Tool/Resource Server -> External System. Process flow: the agent connects to a protocol server, requests its capability manifest (what tools/resources it exposes and their schemas), then invokes specific tools using the negotiated schema, receiving structured (not free-text) responses it can parse reliably.\n\nBest practices: design your own protocol servers to expose narrow, well-described capabilities (mirroring good API design — small, well-documented endpoints over one giant do-everything endpoint); enforce authentication/authorization at the protocol boundary, not inside the LLM's reasoning; and version your protocol servers so agent clients can negotiate compatibility. Common mistakes: exposing overly broad tool capabilities through a protocol server (e.g., a single 'run any SQL' tool instead of scoped, parameterized queries), skipping auth because 'it's just for the agent', and assuming protocol adoption alone gives you security — the protocol standardizes the interface, not the trust boundary.\n\nReal-world implementation: a company exposes its internal ticketing system through an MCP server with specific tools (create_ticket, search_tickets, get_ticket_status) rather than raw database access, so any MCP-compatible agent (regardless of vendor) can integrate against a stable, auditable contract.\n\nInterview questions: 'How does a protocol like MCP differ from just defining function-calling tools yourself?' 'How would you secure a protocol server that exposes sensitive internal systems to an agent?' 'How do you handle versioning when a protocol server's capabilities change?'",
      "architect": "At the architecture level, an agent protocol is an interoperability standard whose primary value is economic: without a shared protocol, every agent-to-tool and agent-to-agent integration is bespoke (N agents x M tools = N×M integrations); with a shared, well-adopted protocol, that becomes N+M (every agent and every tool implements the protocol once). The strategic question is whether to build on an open, emerging standard (MCP, A2A) versus a vendor-specific integration layer, weighing ecosystem momentum, security model maturity, and long-term lock-in risk.\n\nArchitecture overview: Agent/Host -> Protocol (Schema + Auth + Transport) -> Tool/Resource Server -> External System, where the protocol layer becomes a first-class piece of platform infrastructure — every new internal system that should be agent-accessible gets a protocol server built once, then becomes available to every current and future agent in the organization, rather than being integrated point-to-point per agent.\n\nKey trade-offs: standardization speed vs. control (adopting an external protocol standard early gets you ecosystem compatibility but exposes you to that standard's evolution and any of its security gaps); centralizing protocol servers as shared platform infrastructure (consistent governance, but a critical dependency and potential bottleneck) vs. letting teams build their own (faster locally, fragmented and harder to secure org-wide); and protocol-level auth/governance vs. trusting the calling agent (the protocol boundary should be the actual security boundary — never the prompt).\n\nBest practices at scale: stand up an internal protocol-server registry/catalog so teams discover and reuse existing servers instead of rebuilding; apply the same API governance discipline you already use for internal REST/gRPC services — versioning, deprecation policy, rate limiting, and access control — to every protocol server; and treat new protocol adoption (MCP, A2A, or successors) as a platform decision with a migration path, not a one-off integration choice. Common mistakes: treating protocol adoption as purely a developer-experience win while ignoring that it also expands your attack surface (every protocol server is a new entry point into internal systems); fragmenting protocol servers per team with no shared governance; and locking into a single vendor's proprietary agent protocol when an open standard would preserve future flexibility.\n\nReal-world implementation: a large enterprise builds an internal 'Agent Gateway' that fronts all MCP servers exposing internal systems (CRM, ticketing, data warehouse), enforcing org-wide authentication, audit logging, and rate limits centrally, so any team's agent — built on any framework — gets governed, secure access to internal capabilities through one consistent, protocol-compliant boundary.\n\nInterview questions: 'How would you decide whether to adopt an open agent protocol versus building a proprietary integration layer?' 'How do you govern and secure a growing catalog of protocol servers across an organization?' 'What's your migration strategy if the agent protocol your platform depends on changes its security model?'"
    },
    "deepDive": {
      "junior": "Using a protocol like MCP, you don't write custom glue code per tool — you point your agent at a server and it lists its own tools and their parameters, much like calling a Swagger/OpenAPI endpoint to discover what an API offers.",
      "senior": "An MCP server exposes a manifest of tools with JSON-Schema parameters; your agent's tool router treats every server the same way regardless of what it wraps internally (a database, a file system, a SaaS API).",
      "architect": "Stand up protocol servers as owned, versioned platform services with their own auth and rate limits, so any compliant agent — built by any team, on any framework — gets the same governed access path into a system."
    },
    "deepDiveCode": {
      "language": "json",
      "caption": "A simplified MCP-style tool manifest entry a protocol server exposes to any agent",
      "snippet": "{\n  \"name\": \"search_tickets\",\n  \"description\": \"Search the internal ticketing system by keyword and status\",\n  \"inputSchema\": {\n    \"type\": \"object\",\n    \"properties\": {\n      \"query\": { \"type\": \"string\" },\n      \"status\": { \"type\": \"string\", \"enum\": [\"open\", \"closed\", \"any\"] }\n    },\n    \"required\": [\"query\"]\n  }\n}"
    },
    "images": [
      {
        "url": "images/agent-protocol-flow.svg",
        "caption": "A client application communicating through a protocol layer to a tool server"
      },
      {
        "url": "images/agent-protocol-layers.svg",
        "caption": "Agent protocol architecture spanning agent, protocol, and external systems"
      }
    ],
    "references": [
      {
        "title": "Model Context Protocol (MCP) Specification",
        "url": "https://modelcontextprotocol.io/"
      },
      {
        "title": "Anthropic - Introducing MCP",
        "url": "https://www.anthropic.com/news/model-context-protocol"
      },
      {
        "title": "Google - Agent2Agent (A2A) Protocol",
        "url": "https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/"
      }
    ]
  },
  {
    "id": "tools",
    "title": "Tools",
    "keywords": [
      "tools",
      "function calling",
      "tool use",
      "api calling",
      "actions",
      "tool registry"
    ],
    "summary": {
      "junior": "Tools let an AI model do things beyond generating text — like calling a method in C# — by letting it request a specific function call with arguments, which your code then executes and returns the result of.",
      "senior": "Tool use is implemented as schema-defined function signatures the model can invoke; the application is responsible for executing the call, validating arguments, and returning structured results back into the model's context.",
      "architect": "A tool layer is effectively an API gateway for your agent ecosystem — its design (granularity, permissioning, registry, versioning) determines the system's security posture, reliability, and how cleanly new capabilities can be added without re-architecting."
    },
    "details": {
      "junior": "By default, an LLM can only produce text — it can't check today's weather, query a database, or send an email on its own. Tools (also called 'function calling') solve this: you describe a function to the model (its name, what it does, and what parameters it takes, much like a method signature in C#), and when the model decides it needs that capability, it doesn't run the code itself — it outputs a structured request like 'call get_weather with city=London', and your application code actually executes that function and feeds the result back to the model.\n\nArchitecture overview: LLM Decision -> Tool Call (JSON args) -> Tool Execution -> Result Returned to LLM. This loop can repeat — the model can call multiple tools in sequence, using each result to decide its next step, similar to how a method might call several other methods before returning a final value.\n\nBest practices: write clear, specific tool descriptions (the model relies on them to decide when to use a tool, just like good XML doc comments help other developers use your methods correctly), and validate every argument the model sends before executing it — never trust the model's output blindly. Common mistakes: vague tool descriptions that confuse the model about when to use them, and executing a tool's arguments without validation (e.g., directly using a model-provided string as a SQL query, which opens you up to injection).\n\nReal-world implementation: a travel-booking agent has a search_flights tool with parameters origin, destination, and date — the model decides when the user's request calls for it, your backend executes the actual flight search API call, and the result is handed back to the model to summarize for the user.\n\nInterview questions: 'What is function calling / tool use in the context of an LLM?' 'Who actually executes the tool code — the model or your application?' 'Why must you validate tool arguments even though they came from your own AI agent?'",
      "senior": "As an implementer, you own the full lifecycle of tool integration: defining a tool's JSON Schema contract (name, description, typed parameters), routing the model's tool-call request to the correct handler, executing it with proper error handling, and serializing the result back into the conversation in a format the model can use effectively. This is structurally identical to designing a well-typed internal API layer — the model is simply another caller, and your tool router is the equivalent of a controller dispatch layer in ASP.NET Core.\n\nArchitecture overview: LLM -> Tool Router -> Tool Registry (APIs, DB, Search) -> External Systems. The Tool Registry holds the canonical list of available tools and their schemas; the Router matches the model's requested tool name to the correct handler and validates arguments against the schema before execution.\n\nBest practices: keep tools narrow and composable rather than building a few giant, do-everything tools (mirrors single-responsibility principle); enforce strict argument validation and least-privilege execution (a 'query_orders' tool should not have the same DB permissions as a full admin connection); handle and surface tool execution errors back to the model in a structured way so it can recover or ask the user for clarification instead of failing silently; and cache or short-circuit expensive/idempotent tool calls where appropriate. Common mistakes: giving the model one overly broad tool (e.g., 'run_sql') instead of several scoped, parameterized ones; not handling tool execution failures gracefully (the model needs to know a call failed, not just receive nothing); and forgetting that tool results consume context window — large raw results should be summarized or truncated before being returned.\n\nReal-world implementation: an internal support-agent system exposes get_customer_account, get_recent_orders, and issue_refund (capped, with required approval for amounts over a threshold) as three distinct, scoped tools rather than one generic 'database access' tool, mirroring proper API endpoint design.\n\nInterview questions: 'How do you decide the right granularity for a tool — one broad tool or several narrow ones?' 'How do you handle a tool execution failure mid-conversation?' 'How would you prevent a model from misusing an overly powerful tool?'",
      "architect": "At the architecture level, the tool layer functions as an API gateway for your entire agent ecosystem, and its design choices directly determine your system's security posture, blast radius, and extensibility. The central architectural question is tool granularity and permissioning: a small number of broad, powerful tools is easy to build but creates a large blast radius and is harder to secure and audit; many narrow, well-scoped tools mirror good microservice/API design, are easier to permission and reason about, but require more upfront design and a registry to manage at scale.\n\nArchitecture overview: LLM -> Tool Router -> Tool Registry (APIs, DB, Search) -> External Systems, where at scale the Tool Registry becomes a managed catalog (often backed by an agent protocol like MCP) with ownership, versioning, and access-control metadata per tool, similar to an internal API catalog/service mesh.\n\nKey trade-offs: tool granularity (security and auditability vs. development overhead), centralized tool gateway (consistent policy enforcement, single point of control, but added latency and a critical dependency) vs. tools embedded per-agent (faster to build, fragmented governance), and synchronous vs. async tool execution (long-running tools — report generation, batch jobs — need a different invocation pattern than fast lookups, often requiring the agent loop to poll or be notified rather than block).\n\nBest practices at scale: apply least-privilege scoped credentials per tool rather than one shared powerful service account; require human approval gates for tools with irreversible or high-cost side effects (financial transactions, infrastructure changes, mass communications); build observability into every tool call — latency, error rate, argument patterns — the same SRE discipline applied to any production API; and design tool contracts to be independently versioned so a tool's implementation can evolve without breaking every agent that depends on it. Common mistakes: under-scoping tool permissions because it's 'just for the agent' (agents are not inherently more trustworthy callers than any other client); building tools reactively per-agent instead of as shared, governed platform capabilities; and no circuit breaker or rate limiting on tool calls, allowing a misbehaving agent loop to hammer downstream systems.\n\nReal-world implementation: a large organization runs a centralized Tool Gateway service that all internal agents call through — it enforces auth, rate limits, and approval workflows uniformly, exposes a versioned tool catalog teams register against, and emits unified telemetry, so tool governance scales independently of how many agents or teams are built on top of it.\n\nInterview questions: 'How would you design a tool permissioning model that scales across many teams and agents?' 'What's your approach to approval gates for tools with irreversible side effects?' 'How do you version a tool's contract without breaking agents already depending on it?'"
    },
    "deepDive": {
      "junior": "A tool definition is just a name, a description, and a parameter schema — the model picks the name and fills in the parameters; your code is the only thing that actually calls the real function.",
      "senior": "Keep the schema and the handler colocated in a small registry so adding a tool is one entry, and validate every argument against the schema before the handler ever runs.",
      "architect": "Treat the registry as a governed catalog with per-tool scoped credentials and audit logging, so permissioning and observability live at the platform layer, not inside individual agent prompts."
    },
    "deepDiveCode": {
      "language": "javascript",
      "caption": "A small tool registry: schema-validated dispatch from a model's tool call to the real handler",
      "snippet": "const tools = {\n  get_weather: {\n    schema: { city: 'string' },\n    handler: ({ city }) => weatherApi.fetch(city),\n  },\n};\n\nasync function callTool(name, args) {\n  const tool = tools[name];\n  if (!tool) return { error: `Unknown tool: ${name}` };\n  validateAgainstSchema(args, tool.schema); // throws on bad/missing args\n  return tool.handler(args);\n}"
    },
    "images": [
      {
        "url": "images/tools-flow.svg",
        "caption": "An LLM deciding to call a tool, which executes and returns a result"
      },
      {
        "url": "images/tools-layers.svg",
        "caption": "Tool architecture from the LLM through a router to external systems"
      }
    ],
    "references": [
      {
        "title": "OpenAI - Function Calling Guide",
        "url": "https://platform.openai.com/docs/guides/function-calling"
      },
      {
        "title": "Anthropic - Tool Use Documentation",
        "url": "https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/overview"
      },
      {
        "title": "JSON Schema Specification",
        "url": "https://json-schema.org/"
      }
    ]
  },
  {
    "id": "memory",
    "title": "Memory",
    "keywords": [
      "memory",
      "vector database",
      "embeddings",
      "long-term memory",
      "short-term memory",
      "context window",
      "rag"
    ],
    "summary": {
      "junior": "Memory is how an AI agent remembers things beyond the current conversation — like saving session data so a web app remembers you between requests, instead of forgetting everything after each page load.",
      "senior": "Memory systems combine short-term context (the active conversation/context window), episodic memory for the current session, and long-term memory typically backed by a vector store for semantic retrieval across past interactions.",
      "architect": "Memory architecture is a data-platform decision involving storage tiers, retrieval strategy, consistency, privacy/retention policy, and cost — the agent equivalent of designing caching, session state, and a data warehouse layer together."
    },
    "details": {
      "junior": "By default, an LLM has no memory between separate conversations — each request starts fresh, similar to a stateless HTTP request with no session or cookies. Memory is the set of techniques used to make an agent remember things: the simplest form is just including prior conversation turns in the prompt (like passing session state along with each request), but that only works while the conversation is short enough to fit in the model's context window.\n\nArchitecture overview: Conversation -> Short-Term Context -> Summarize/Embed -> Long-Term Store (Vector DB). When a conversation grows too long, older messages get summarized or converted into embeddings (numeric representations of meaning) and stored in a vector database, so the agent can later retrieve only the relevant pieces instead of replaying the entire history.\n\nBest practices: only persist what's actually useful for future interactions (user preferences, key facts) rather than every raw message, and be transparent with users about what is being remembered, especially for personal information. Common mistakes: trying to stuff an ever-growing conversation history directly into the prompt until it breaks or becomes slow/expensive, and storing sensitive data in long-term memory without considering privacy implications.\n\nReal-world implementation: a customer support agent remembers a user's subscription tier and past complaints across sessions by storing key facts in a small persistent profile, retrieved and injected into context at the start of each new conversation — similar to loading a user's profile from a database at the start of a web session.\n\nInterview questions: 'Why doesn't an LLM remember previous conversations by default?' 'What's the difference between short-term and long-term memory for an agent?' 'What would you store, and what would you deliberately not store, in long-term memory?'",
      "senior": "As an implementer, you should design memory as a multi-tier system, much like you'd design caching layers (L1 in-process cache, L2 distributed cache, durable database): Working Memory is the live context window (fast, limited, expensive per token); Episodic Memory captures the current session's state (can be summarized and compacted as the session grows); and Long-Term Memory is typically a vector store holding embeddings of important facts/interactions, retrieved via semantic similarity search (RAG-style) when relevant to the current turn.\n\nArchitecture overview: Working Memory (context window) -> Episodic Memory (session) -> Long-Term Memory (vector store) -> Retrieval Layer, where the Retrieval Layer decides, per turn, what (if anything) needs to be pulled from long-term storage and injected into the active prompt.\n\nBest practices: summarize and compact context proactively rather than waiting until you hit a hard token limit (similar to log rotation); chunk and embed long-term memories at a sensible granularity — too coarse loses precision in retrieval, too fine loses context; tag memories with metadata (recency, source, confidence) so retrieval can rank and filter, not just match by similarity; and implement memory expiry/decay for stale or superseded facts, the same way you'd cache-invalidate stale data. Common mistakes: treating the vector store as infinite and never pruning it (retrieval quality degrades as noise accumulates); retrieving too many or irrelevant memories and flooding the context window, drowning out the actually relevant ones; and conflating 'memory' with 'general RAG over documents' — user/session memory and document knowledge bases often need different retrieval strategies and lifecycle policies.\n\nReal-world implementation: a coding assistant keeps the current file and recent edits in working memory, summarizes earlier parts of a long session into episodic memory, and stores durable facts ('this project uses PostgreSQL with Dapper, not EF Core') in long-term memory, retrieved automatically whenever relevant to the current task.\n\nInterview questions: 'How would you design a tiered memory system for an agent that runs long sessions?' 'How do you decide what's worth promoting from short-term to long-term memory?' 'How do you keep retrieval-augmented memory from flooding the context window with irrelevant results?'",
      "architect": "At the architecture level, memory is a data platform problem: you're designing storage tiers, retrieval strategy, consistency guarantees, retention/privacy policy, and cost controls together, much like architecting caching, session state, and a data warehouse as one coherent system rather than separate concerns. The central trade-off is recall vs. cost/latency vs. risk: richer, more persistent memory improves personalization and continuity but increases storage cost, retrieval latency, and — critically — privacy and compliance exposure, since long-term memory often means long-term storage of personal or sensitive data.\n\nArchitecture overview: Working Memory (context window) -> Episodic Memory (session) -> Long-Term Memory (vector store) -> Retrieval Layer, with the Long-Term Memory tier typically backed by a dedicated vector database (or a hybrid vector + relational store) that must be designed for the organization's actual scale, query patterns, and data-governance requirements rather than bolted on ad hoc.\n\nKey trade-offs: per-user/tenant isolation vs. shared knowledge stores (multi-tenant memory systems must guarantee strict isolation — cross-tenant memory leakage is a severe class of bug); eager vs. on-demand retrieval (always injecting relevant memory adds latency and cost to every turn; on-demand retrieval requires a reliable trigger for 'when is memory actually relevant'); and memory retention policy as a compliance decision, not just an engineering one — GDPR/CCPA-style 'right to be forgotten' requirements mean long-term agent memory needs deletion and audit capabilities, not just write paths.\n\nBest practices at scale: design memory retention and deletion policies upfront, including per-user data export/delete capabilities; instrument retrieval quality (precision/recall of what gets pulled into context) as a first-class metric, not an afterthought; isolate memory stores per tenant/customer with the same rigor as any other multi-tenant data boundary; and version your embedding model/pipeline, since changing embedding models invalidates prior vector representations and requires a re-embedding migration strategy. Common mistakes: treating memory as a single global store with no tenant isolation; no data retention or deletion strategy until a compliance request forces one reactively; and underestimating the operational cost of vector search at scale (index rebuild time, embedding model drift, storage growth) compared to traditional relational query costs.\n\nReal-world implementation: an enterprise AI assistant platform isolates each customer's long-term memory into a dedicated namespace within a managed vector database, enforces a 90-day retention policy with automated expiry, provides an explicit 'forget this' API surfaced to end users for compliance, and tracks retrieval precision metrics to detect when stale or noisy memories are degrading response quality.\n\nInterview questions: 'How would you design tenant isolation for a multi-customer agent memory system?' 'How do you handle a user's right-to-be-forgotten request against a vector-based long-term memory store?' 'What would change in your memory architecture if you had to support 10 million users instead of 10 thousand?'"
    },
    "deepDive": {
      "junior": "Short-term memory is usually nothing more than an array of past messages you re-send with every request; long-term memory means saving a few important facts somewhere durable and loading them back in next time.",
      "senior": "Embed a memory as a vector, store it with metadata (recency, source), and on each turn run a similarity search to pull back only the handful of memories actually relevant to the current message.",
      "architect": "Namespace memory storage per tenant, version your embedding model, and build an explicit delete/export path so long-term memory can satisfy a right-to-be-forgotten request, not just accumulate forever."
    },
    "deepDiveCode": {
      "language": "javascript",
      "caption": "Retrieving only the relevant long-term memories before assembling the prompt",
      "snippet": "async function buildContext(userId, currentMessage) {\n  const queryVector = await embed(currentMessage);\n  const memories = await vectorStore.query({\n    namespace: userId,           // tenant isolation\n    vector: queryVector,\n    topK: 3,                     // only the most relevant facts\n  });\n  return memories.map((m) => m.text).join('\\n');\n}"
    },
    "images": [
      {
        "url": "images/memory-flow.svg",
        "caption": "Conversation flowing from short-term context into a long-term vector store"
      },
      {
        "url": "images/memory-layers.svg",
        "caption": "Tiered memory architecture from working memory to long-term retrieval"
      }
    ],
    "references": [
      {
        "title": "Anthropic - Context Engineering and Memory",
        "url": "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents"
      },
      {
        "title": "Pinecone - Vector Database Fundamentals",
        "url": "https://www.pinecone.io/learn/vector-database/"
      },
      {
        "title": "LangChain - Memory Concepts",
        "url": "https://python.langchain.com/docs/concepts/memory/"
      }
    ]
  },
  {
    "id": "context-management",
    "title": "Context Management",
    "keywords": [
      "context management",
      "context window",
      "rag",
      "chunking",
      "token budget",
      "retrieval augmented generation"
    ],
    "summary": {
      "junior": "Context management is deciding what information actually gets sent to the AI model in each request, since the model can only 'see' what's in its limited context window — like deciding what data to load into memory instead of loading an entire database table.",
      "senior": "Context management covers chunking, embedding, retrieval (RAG), and prompt assembly strategies that fit the most relevant information into a finite, costly token budget while preserving response quality.",
      "architect": "Context engineering is a systems-level discipline balancing retrieval precision, latency, cost, and model attention limits — treating the context window as a scarce, contested resource that must be actively curated rather than passively filled."
    },
    "details": {
      "junior": "Every AI model has a context window — a maximum amount of text it can consider at once, similar to how a method has a maximum stack size or a SQL query has a maximum parameter count. Context management is the practice of deciding what actually goes into that limited space: you can't just dump an entire knowledge base or an entire conversation history into every request, so you have to be selective, the same way you wouldn't SELECT * from a million-row table when you only need ten relevant rows.\n\nArchitecture overview: Raw Documents -> Chunking -> Embedding -> Retrieval -> Prompt Assembly. Large documents get split into smaller chunks, each chunk is converted into an embedding (a numeric representation of its meaning), and when a user asks a question, the system retrieves only the chunks that are semantically relevant and assembles them into the final prompt sent to the model — this overall pattern is called RAG (Retrieval-Augmented Generation).\n\nBest practices: chunk documents at sensible boundaries (paragraphs or sections, not arbitrary character counts) so each piece retains meaning, and always include the system instructions and the user's actual question alongside any retrieved content. Common mistakes: chunking too small (loses context) or too large (wastes token budget on irrelevant text), and retrieving too many chunks 'just to be safe', which can bury the relevant information in noise.\n\nReal-world implementation: a documentation chatbot splits a product manual into section-sized chunks, embeds them, and for each user question retrieves only the 3-5 most relevant sections to include in the prompt instead of the entire manual.\n\nInterview questions: 'What is a context window and why does it matter?' 'What is RAG and why is it needed?' 'What happens if you retrieve too much or too little context for a given question?'",
      "senior": "As an implementer, context management is the engineering discipline of treating the context window as a finite, expensive resource budget — every token included is a token you're paying for (in latency and API cost) and a token competing for the model's attention. You are responsible for the full RAG pipeline: chunking strategy (fixed-size vs. semantic/structural chunking), embedding model selection, vector index design, retrieval ranking (often hybrid: vector similarity plus keyword/BM25 re-ranking), and final prompt assembly ordering.\n\nArchitecture overview: Context Window holds System Instructions, Retrieved Chunks (RAG), Conversation History, and the remaining Available Token Budget — all four compete for the same finite space, and the assembly logic must prioritize what to include, truncate, or omit when the budget is tight, similar to a cache eviction policy under memory pressure.\n\nBest practices: order context deliberately — research shows models attend most reliably to the start and end of a long context, so place critical instructions accordingly; use re-ranking after initial vector retrieval to filter out near-duplicate or low-relevance chunks before they consume budget; summarize or compact older conversation turns rather than truncating them blindly; and continuously evaluate retrieval quality (precision/recall against a labeled test set), not just 'it seems to work'. Common mistakes: relying on vector similarity alone without re-ranking, leading to plausible-but-irrelevant chunks crowding out the right answer; never measuring retrieval quality, so degradation goes unnoticed until users complain; and treating the context window as effectively unlimited on newer long-context models, which still suffer attention degradation and cost scaling even when they technically fit more tokens.\n\nReal-world implementation: a legal-research assistant uses hybrid retrieval (vector + keyword) over a chunked case-law corpus, re-ranks the top candidates with a smaller cross-encoder model, and assembles the final prompt with system instructions first, the highest-confidence chunks closest to the user's question, and a hard token budget enforced before the call is made.\n\nInterview questions: 'How would you measure whether your RAG retrieval is actually working well?' 'Why might a model miss information that is technically inside its context window?' 'How do you decide what to cut when you're over your token budget?'",
      "architect": "At the architecture level, context management — often called context engineering — is a systems discipline that determines the ceiling on your entire agentic system's accuracy and reliability, regardless of how capable the underlying model is: a state-of-the-art model fed poorly curated context will consistently underperform a modest model fed excellent context. The architectural mandate is to design the context pipeline (ingestion, chunking, embedding, indexing, retrieval, ranking, assembly) as a product-quality data pipeline with the same rigor as a search or recommendation system, not as an afterthought bolted onto a chatbot.\n\nArchitecture overview: Context Window (System Instructions / Retrieved Chunks / Conversation History / Token Budget) sits atop an ingestion and retrieval pipeline (Raw Documents -> Chunking -> Embedding -> Retrieval) that must be independently scalable, monitorable, and continuously evaluated as a standalone system, because its output quality directly bounds agent quality.\n\nKey trade-offs: retrieval precision vs. latency/cost (more sophisticated multi-stage retrieval and re-ranking improves quality but adds latency and infrastructure cost to every request); long-context models vs. RAG (very large context windows reduce the need for precise retrieval but don't eliminate it — cost scales with tokens sent, and model attention still degrades with excessive irrelevant content, so the two approaches are complementary, not substitutes); and static knowledge bases vs. continuously updated ones (stale embeddings/chunks silently degrade answer quality, requiring a re-indexing and freshness strategy).\n\nBest practices at scale: build a continuous evaluation harness for retrieval and end-to-end answer quality (golden question sets, automated regression testing on every pipeline change); design re-indexing and embedding-model-migration strategy from day one, since switching embedding models invalidates the entire vector index; separate context curation concerns by source type (structured data, documents, conversation history, tool outputs) since each has different freshness, chunking, and ranking needs; and treat the token budget as an explicit, governed resource with prioritization rules, not a first-come-first-served buffer. Common mistakes: under-investing in retrieval evaluation until a high-profile failure forces attention; assuming a bigger context window solves a context-quality problem rather than a context-curation problem; and ignoring data freshness, leading to retrieval of outdated or superseded information with high confidence.\n\nReal-world implementation: an enterprise knowledge platform runs a dedicated context pipeline team that owns chunking standards, embedding model lifecycle, hybrid retrieval and re-ranking, and a continuous evaluation suite that gates any pipeline change — treated as core infrastructure shared across dozens of downstream agents, exactly like a shared search platform team would operate.\n\nInterview questions: 'How would you build a continuous evaluation pipeline for RAG retrieval quality?' 'When would you choose long-context over RAG, and when would you combine them?' 'How do you manage embedding-model migrations without breaking an existing production vector index?'"
    },
    "deepDive": {
      "junior": "In code this is just: split a document into chunks, embed each chunk once, and at query time fetch the few chunks closest in meaning to the user's question before building the prompt.",
      "senior": "Combine vector similarity with a re-ranking pass so near-duplicate or low-relevance chunks get filtered before they consume your token budget, and log retrieval precision so quality regressions are visible.",
      "architect": "Run the ingestion/retrieval pipeline as its own evaluated service with a golden test set gating changes, since the whole agent's accuracy ceiling is bounded by what this pipeline hands the model."
    },
    "deepDiveCode": {
      "language": "javascript",
      "caption": "Chunk, retrieve, and assemble only the relevant context into the final prompt",
      "snippet": "async function assemblePrompt(question, knowledgeBase) {\n  const chunks = chunkBySection(knowledgeBase);     // not by raw char count\n  const relevant = await retrieveTopK(question, chunks, 5);\n\n  return [\n    SYSTEM_INSTRUCTIONS,\n    ...relevant.map((c) => `Source: ${c.title}\\n${c.text}`),\n    `Question: ${question}`,\n  ].join('\\n\\n');\n}"
    },
    "images": [
      {
        "url": "images/context-management-flow.svg",
        "caption": "Documents chunked, embedded, retrieved, and assembled into a prompt"
      },
      {
        "url": "images/context-management-layers.svg",
        "caption": "Context window composition competing for a finite token budget"
      }
    ],
    "references": [
      {
        "title": "Anthropic - Effective Context Engineering for AI Agents",
        "url": "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents"
      },
      {
        "title": "OpenAI - Retrieval Augmented Generation Guide",
        "url": "https://platform.openai.com/docs/guides/retrieval"
      },
      {
        "title": "Pinecone - Chunking Strategies for RAG",
        "url": "https://www.pinecone.io/learn/chunking-strategies/"
      }
    ]
  },
  {
    "id": "hooks",
    "title": "Hooks",
    "keywords": [
      "hooks",
      "middleware",
      "lifecycle events",
      "pre-tool-use",
      "post-tool-use",
      "interceptors"
    ],
    "summary": {
      "junior": "Hooks are points where you can run your own code before or after something an agent does — similar to middleware in an ASP.NET Core pipeline that runs before or after a request reaches your controller.",
      "senior": "Hooks are lifecycle interception points (pre-tool-call, post-tool-call, on-error, on-completion) that let you inject validation, logging, transformation, or blocking logic into an agent loop without modifying the agent's core reasoning.",
      "architect": "A hook system is the extensibility and policy-enforcement backbone of an agent platform — it determines how observability, security, and governance get layered onto agent behavior consistently, without every team re-implementing the same controls inside each agent."
    },
    "details": {
      "junior": "If you've written ASP.NET Core middleware or an Angular HTTP interceptor, you already understand hooks: they are code that automatically runs at specific points in an agent's execution, without the agent's core logic needing to know about it. For example, a 'before tool call' hook can run right before the agent executes any tool, letting you log it, validate it, or even block it — and a 'after tool call' hook runs right after, letting you inspect or modify the result before it goes back to the model.\n\nArchitecture overview: Event (PreToolUse) -> Hook Handler -> Allow/Block/Modify -> Continue Execution. The hook handler sits between the agent's decision to act and the actual execution, giving you a clean injection point for cross-cutting concerns.\n\nBest practices: use hooks for cross-cutting concerns (logging, validation, security checks) rather than core business logic, which belongs in the agent's tools/prompts themselves, and keep hook logic fast since it runs on every relevant event. Common mistakes: putting essential business logic only in a hook where it's easy to forget it exists, and writing slow hooks that bottleneck every single agent action.\n\nReal-world implementation: a coding agent has a PreToolUse hook that blocks any 'delete' or 'force push' tool call without explicit user confirmation, exactly like a confirmation dialog intercepting a destructive UI action before it executes.\n\nInterview questions: 'What is a hook in the context of an AI agent, and what's a real-world software pattern it resembles?' 'Why would you use a hook instead of putting that logic directly in the agent's prompt?' 'What's a good use case for a post-tool-call hook?'",
      "senior": "As an implementer, hooks are your primary mechanism for cross-cutting concerns in an agent loop without polluting the agent's core prompt or tool logic — directly analogous to middleware pipelines (ASP.NET Core, Express) or AOP-style interceptors. Common hook points include PreToolUse (before any tool executes — ideal for validation, permission checks, rate limiting), PostToolUse (after a tool returns — ideal for logging, redaction of sensitive data, result transformation), OnError (when a tool or the model call fails — ideal for retry logic or fallback), and OnSessionEnd/OnCompletion (for cleanup, billing, or analytics).\n\nArchitecture overview: Agent Loop with Hook: Pre-Action, Hook: Post-Action, and Hook: On-Error attached at each relevant lifecycle point, executing synchronously and able to short-circuit ('block') the action they wrap, similar to how middleware can short-circuit a request pipeline by returning early.\n\nBest practices: design hooks to be composable and ordered explicitly (hook execution order matters, just like middleware registration order); make hooks side-effect-aware — a logging hook should never be able to silently swallow an error that should propagate; keep hook logic stateless and fast, offloading anything slow (e.g., async audit writes) to a background process; and write hooks defensively, since a buggy hook can break every single agent action if it's in the critical path. Common mistakes: chaining too many hooks without clear ordering guarantees, causing unpredictable behavior; using hooks for core business logic that should be explicit and testable in the main agent code; and not handling hook failures gracefully — a hook that throws should have a defined fallback behavior, not silently crash the whole agent loop.\n\nReal-world implementation: a production agent platform has a PreToolUse hook chain: rate-limit check -> permission check -> PII redaction-aware logging -> the actual tool execution, with each hook able to block and return an explanation if it rejects the action, fully decoupled from the agent's own reasoning logic.\n\nInterview questions: 'How would you design a hook system that supports multiple hooks running in a defined order?' 'What's the difference between handling something in a hook versus inside the tool implementation itself?' 'How do you prevent a single buggy hook from breaking your entire agent pipeline?'",
      "architect": "At the architecture level, a hook system is the extensibility and governance backbone of an agent platform: it's what lets you enforce organization-wide policies (security, compliance, observability, cost control) consistently across every agent and team, without requiring every agent builder to reimplement those controls themselves — the same strategic role that a shared middleware/interceptor framework plays in a large microservices platform.\n\nArchitecture overview: the Agent Loop has well-defined extension points (Pre-Action, Post-Action, On-Error, and often On-Plan/On-Decision for more advanced systems) that platform teams use to inject mandatory, non-bypassable controls — audit logging, PII redaction, cost tracking, rate limiting, and security policy enforcement — independently of whatever individual application teams build on top.\n\nKey trade-offs: mandatory platform-level hooks (consistent governance, but rigid and can slow down agent builders) vs. optional, per-agent hooks (flexible, but inconsistent enforcement across the organization); synchronous hooks that can block/modify actions (necessary for hard policy enforcement, but add latency to every action) vs. asynchronous hooks for observability-only concerns (no latency impact, but can't prevent a bad action); and where hook logic lives — in-process within the agent runtime (fast, simple) vs. an external policy service the hook calls out to (centralized, consistent across many agent runtimes, but adds network latency and a critical dependency).\n\nBest practices at scale: separate hard-enforcement hooks (security, compliance — must run synchronously and can block) from soft-observability hooks (logging, analytics — can run asynchronously without blocking); version and test hooks like any other shared platform code, since a hook bug has blast radius across every agent using it; provide a clear, documented hook registration and ordering contract so teams building on the platform have predictable behavior; and instrument the hook layer itself (latency, failure rate, block rate) since it becomes a critical-path dependency for the whole platform. Common mistakes: under-engineering the hook execution contract (unclear ordering, unclear error semantics) leading to fragile, hard-to-debug agent behavior; putting expensive synchronous calls (e.g., a full policy-service round-trip) on every single tool call without considering latency budget; and not having a kill-switch or bypass mechanism for an emergency when a hook itself is misbehaving and blocking legitimate, safe actions.\n\nReal-world implementation: a regulated enterprise's agent platform implements a centralized 'policy hook service' that every agent's PreToolUse event must call synchronously — enforcing data-access policy, redacting PII before logging, and recording an immutable audit trail — while lower-stakes observability hooks (usage analytics, performance metrics) run asynchronously via an event stream so they never add latency to the user-facing agent loop.\n\nInterview questions: 'How would you design a hook architecture that enforces organization-wide policy without becoming a single point of failure?' 'How do you separate hooks that must block an action from those that are purely observational?' 'What's your strategy for safely rolling out a change to a shared hook used by every agent on the platform?'"
    },
    "deepDive": {
      "junior": "A hook is just a function the surrounding code calls automatically right before or after a tool runs — the agent itself never has to know the hook exists.",
      "senior": "Register hooks per event type in an ordered array and let any hook short-circuit the chain by returning a 'blocked' result, the same shape as middleware short-circuiting a request pipeline.",
      "architect": "Separate hard-enforcement hooks (must run synchronously, can block) from observability-only hooks (can run async off the critical path), so a slow logging hook can never add latency to every agent action."
    },
    "deepDiveCode": {
      "language": "javascript",
      "caption": "A PreToolUse hook chain that can block a tool call before it executes",
      "snippet": "const preToolHooks = [rateLimitCheck, permissionCheck, piiRedactionLog];\n\nasync function runWithHooks(toolName, args) {\n  for (const hook of preToolHooks) {\n    const result = await hook(toolName, args);\n    if (result?.blocked) return { ok: false, reason: result.reason };\n  }\n  return executeTool(toolName, args); // only reached if every hook passed\n}"
    },
    "images": [
      {
        "url": "images/hooks-flow.svg",
        "caption": "A lifecycle event intercepted by a hook handler before execution continues"
      },
      {
        "url": "images/hooks-layers.svg",
        "caption": "Hooks attached at pre-action, post-action, and error points in the agent loop"
      }
    ],
    "references": [
      {
        "title": "Claude Code - Hooks Reference",
        "url": "https://docs.claude.com/en/docs/claude-code/hooks"
      },
      {
        "title": "ASP.NET Core Middleware Documentation",
        "url": "https://learn.microsoft.com/aspnet/core/fundamentals/middleware/"
      },
      {
        "title": "Aspect-Oriented Programming Overview",
        "url": "https://en.wikipedia.org/wiki/Aspect-oriented_programming"
      }
    ]
  },
  {
    "id": "prompt-engineering",
    "title": "Prompt Engineering",
    "keywords": [
      "prompt engineering",
      "system prompt",
      "few-shot",
      "prompt design",
      "instruction tuning",
      "output schema"
    ],
    "summary": {
      "junior": "Prompt engineering is writing clear, specific instructions for an AI model to get reliable results — similar to writing a precise method signature and doc comment so other developers (or in this case, the model) use your code correctly.",
      "senior": "Prompt engineering is the systematic design of system instructions, few-shot examples, and output format constraints, treated as a versioned, testable artifact rather than ad hoc text tweaking.",
      "architect": "At scale, prompt engineering becomes prompt lifecycle management — versioning, automated evaluation, regression testing, and rollout strategy for the instructions that materially drive system behavior and risk, equivalent in rigor to managing production configuration or business rules."
    },
    "details": {
      "junior": "Prompt engineering is the skill of writing instructions that get an AI model to behave the way you want, consistently. It's tempting to think of it as 'just writing English', but it functions much more like writing a precise API contract: vague instructions produce vague, inconsistent results, just like an ambiguous method signature leads to misuse. Good prompts are specific about the task, the constraints, the desired format, and ideally include an example or two of exactly what a good response looks like.\n\nArchitecture overview: Task -> System Prompt + Examples -> Model Output -> Evaluate & Iterate. You write the prompt, observe what the model produces, and refine the prompt based on where it falls short — an iterative loop much like debugging.\n\nBest practices: be explicit rather than assuming the model will 'figure out' an unstated expectation, give examples of correct (and sometimes incorrect) outputs when the format matters, and ask for output in a structured format (like JSON) when you need to parse the result programmatically. Common mistakes: writing prompts that are too vague ('write something good'), not testing the prompt against edge cases, and forgetting that small wording changes can meaningfully change model behavior.\n\nReal-world implementation: instead of prompting 'summarize this', a well-engineered prompt says 'Summarize this support ticket in exactly 2 sentences, focusing on the customer's core issue and any deadline mentioned, and respond in plain text with no preamble.'\n\nInterview questions: 'Why does prompt wording meaningfully affect output quality?' 'What's a few-shot example and when would you use one?' 'How would you get a model to reliably return JSON instead of free-form text?'",
      "senior": "As an implementer, you should treat prompts as a versioned engineering artifact with the same rigor as code: a system prompt is effectively a specification, few-shot examples are test fixtures that demonstrate desired behavior, and an output schema is a contract the rest of your system depends on. Prompt engineering at this level includes structuring the system prompt (role, rules, constraints, in priority order), selecting representative few-shot examples that cover edge cases, and enforcing structured output (JSON mode or schema-constrained generation) so downstream code can parse results reliably without brittle string parsing.\n\nArchitecture overview: System Prompt (role + rules) -> Few-Shot Examples -> User Input -> Output Schema/Format, assembled in a deliberate order, since instruction position within the prompt measurably affects how reliably the model follows it.\n\nBest practices: write prompts with explicit priority ordering (most important constraints first and reiterated near the end); use few-shot examples sparingly but deliberately — pick ones that cover tricky edge cases, not just the easy path; enforce output format with schema-constrained generation/JSON mode rather than asking nicely and hoping; and maintain a prompt regression test suite — a set of representative inputs with expected output properties, run automatically whenever the prompt changes. Common mistakes: changing a production prompt without any regression testing, causing silent behavior drift; over-stuffing the prompt with redundant instructions that dilute attention to the actually important ones; and not accounting for model-version sensitivity — a prompt finely tuned for one model version can behave differently after a model upgrade.\n\nReal-world implementation: a code-review agent's system prompt explicitly orders its rules (security issues first, then correctness, then style), includes two few-shot examples of well-formatted review comments, enforces a JSON output schema with fields like severity and lineNumber, and is run against a regression suite of 50 sample diffs before any prompt change ships to production.\n\nInterview questions: 'How would you regression-test a prompt change before deploying it to production?' 'Why does instruction position within a prompt matter?' 'How do you enforce structured, parseable output from a model reliably?'",
      "architect": "At the architecture level, prompt engineering matures into prompt lifecycle management — because system prompts function as executable business logic and risk policy in natural-language form, they need the same governance as production configuration: version control, change review, staged rollout, automated evaluation, and rollback capability, especially once prompts are co-owned by multiple teams or directly encode compliance-relevant rules.\n\nArchitecture overview: Task -> System Prompt + Examples -> Model Output -> Evaluate & Iterate, but at scale the 'Evaluate' step becomes a continuous, automated evaluation pipeline (golden test sets, LLM-as-judge scoring, human review sampling) gating every prompt change before it reaches production, the same discipline as a CI pipeline gating code changes.\n\nKey trade-offs: prompt complexity vs. maintainability (a highly tuned, long prompt with many edge-case instructions performs well but becomes fragile and hard to modify safely — similar to an overgrown conditional block accumulating special cases); model-specific tuning vs. portability (prompts hand-tuned to one model's quirks may need significant rework on model upgrades or provider switches); and centralized prompt ownership (consistency, easier governance, but a bottleneck) vs. distributed ownership per team (faster iteration, but inconsistent quality and risk exposure across the organization.\n\nBest practices at scale: store prompts as versioned artifacts (not embedded as string literals scattered through code), with diffable history and clear ownership; build an automated evaluation harness that runs on every prompt change, covering both quality regression and safety/policy regression; stage prompt rollouts (canary a new prompt version to a small percentage of traffic before full rollout, exactly like a feature flag rollout); and maintain a model-upgrade testing protocol, since model version changes can silently shift prompt behavior even with no prompt edits at all. Common mistakes: treating prompts as disposable strings instead of governed artifacts, leading to untracked behavior drift across an organization; no automated evaluation, so prompt regressions are only caught by user complaints; and re-tuning prompts reactively after every model upgrade instead of having a proactive testing protocol that catches drift before it reaches users.\n\nReal-world implementation: a large customer-facing AI platform stores every system prompt in version control with required peer review, runs a nightly evaluation suite (hundreds of golden test cases scored by both automated graders and human spot-checks) against the current production prompt and any pending prompt change, and uses canary rollout with automatic rollback if evaluation scores regress beyond a defined threshold.\n\nInterview questions: 'How would you build an automated evaluation pipeline to catch prompt regressions before they reach production?' 'How do you manage prompt behavior drift across model version upgrades?' 'What governance would you put around prompts that encode compliance-relevant business rules?'"
    },
    "deepDive": {
      "junior": "Treat a prompt like a template string with placeholders for the task-specific bits, and keep the instructions, examples, and the user's actual input in clearly separated sections.",
      "senior": "Pin the output format with a schema (or JSON mode) so downstream code can parse the response without brittle string matching, and keep a small regression test set of inputs with expected output properties.",
      "architect": "Store prompts as versioned, reviewed artifacts with an automated evaluation suite gating every change, and re-run that suite whenever the underlying model version changes."
    },
    "deepDiveCode": {
      "language": "javascript",
      "caption": "A structured prompt template that keeps instructions, examples, and input separated",
      "snippet": "const SYSTEM_PROMPT = `You triage support tickets. Output JSON only: {\"severity\": \"low|medium|high\", \"summary\": string}.`;\n\nconst FEW_SHOT = [\n  { input: 'App crashes on login', output: '{\"severity\":\"high\",\"summary\":\"Login crash\"}' },\n];\n\nfunction buildMessages(ticketText) {\n  return [\n    { role: 'system', content: SYSTEM_PROMPT },\n    ...FEW_SHOT.flatMap((ex) => [\n      { role: 'user', content: ex.input },\n      { role: 'assistant', content: ex.output },\n    ]),\n    { role: 'user', content: ticketText },\n  ];\n}"
    },
    "images": [
      {
        "url": "images/prompt-engineering-flow.svg",
        "caption": "Iterating a prompt against model output until it meets requirements"
      },
      {
        "url": "images/prompt-engineering-layers.svg",
        "caption": "Prompt architecture from system instructions through to output schema"
      }
    ],
    "references": [
      {
        "title": "Anthropic - Prompt Engineering Overview",
        "url": "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview"
      },
      {
        "title": "OpenAI - Prompt Engineering Guide",
        "url": "https://platform.openai.com/docs/guides/prompt-engineering"
      },
      {
        "title": "Prompting Guide",
        "url": "https://www.promptingguide.ai/"
      }
    ]
  },
  {
    "id": "agent-loop",
    "title": "Agent Loop",
    "keywords": [
      "agent loop",
      "react",
      "perceive plan act",
      "autonomous loop",
      "reasoning loop",
      "observe act"
    ],
    "summary": {
      "junior": "The agent loop is the repeating cycle an AI agent uses to work on a task on its own — think, act, observe the result, then think again — continuing until the task is done, similar to a while loop that keeps iterating until a condition is met.",
      "senior": "The agent loop (often ReAct-style: Reason, Act, Observe) is implemented as an explicit control loop where the model proposes the next action, your code executes it, and the result is fed back in, repeating until a stop condition or termination signal is reached.",
      "architect": "The agent loop is the runtime engine of agentic autonomy, and its design — termination conditions, cost/iteration limits, error recovery, and observability — determines whether autonomous behavior is a manageable capability or an unbounded operational risk."
    },
    "details": {
      "junior": "The agent loop is the core mechanism that lets an AI agent work on a task across multiple steps instead of producing one single response. It works like a while loop: the agent looks at the current situation (Perceive), decides what to do next (Plan), does it (Act), checks what happened (Observe), and then repeats — using what it just observed to decide the next action — until the task is finished or it decides to stop.\n\nArchitecture overview: Perceive -> Plan -> Act -> Observe, then back to Perceive again. Each time through the loop, the agent has more information than before (the result of its last action), which is what makes it different from a single one-shot AI response.\n\nBest practices: always have a clear stopping condition (task complete, or a maximum number of steps) so the agent doesn't loop forever, and show or log each step so a human can see what the agent is doing and intervene if needed. Common mistakes: no maximum iteration limit (an agent can get stuck repeating similar actions indefinitely), and not handling the case where an action fails — the agent needs to know an attempt didn't work so it can try something different.\n\nReal-world implementation: a research agent given the goal 'find the three best-reviewed laptops under $1000' loops through: search the web, observe the results, decide it needs more detail on one model, search again, observe, and only stops once it has gathered enough information to answer confidently.\n\nInterview questions: 'What is the agent loop and how is it like a while loop in regular programming?' 'Why does an agent need a maximum step limit?' 'What happens if an action inside the loop fails?'",
      "senior": "As an implementer, the agent loop is most commonly built as a ReAct-style (Reason + Act) control loop: at each iteration, the model receives the current state (goal, history, available tools, last observation) and produces either a tool call or a final answer; your code executes any tool call, appends the result to the conversation/state, and feeds it back in for the next iteration. This is structurally a state machine with the LLM as the transition function deciding the next state, and it requires the same operational rigor as any long-running process: timeouts, retries, and resource limits.\n\nArchitecture overview: Goal -> Planner (LLM) -> Executor (Tools) -> Memory/State -> Stop Condition, with the Stop Condition checked every iteration — task completion signaled by the model itself, a maximum iteration/cost budget, a timeout, or an explicit user interrupt.\n\nBest practices: enforce hard limits on iteration count and cumulative cost/token usage per run, since a model can get into unproductive loops; persist intermediate state so a long-running agent loop can be paused, inspected, or resumed rather than being an opaque black box; detect repetitive/unproductive behavior (the same failing action retried identically) and intervene rather than letting it continue; and stream intermediate steps to give visibility into what the agent is doing in near real time, rather than waiting silently for a final answer. Common mistakes: no iteration or cost ceiling, leading to runaway loops that are expensive and slow; treating every loop iteration as a fresh, full LLM call with the entire history re-sent uncompressed, causing cost and latency to balloon as the loop runs longer; and not distinguishing between 'the agent decided it's done' and 'the agent gave up/got stuck' when terminating a loop.\n\nReal-world implementation: a DevOps remediation agent loops through Diagnose -> Propose Fix -> Apply (in a sandboxed environment) -> Verify, capped at 8 iterations and a defined cost budget, with every step logged and a human approval gate before any fix is applied to a production system.\n\nInterview questions: 'How would you prevent an agent loop from running away indefinitely, both in steps and in cost?' 'How do you detect that an agent is stuck repeating an unproductive action?' 'How would you make a long-running agent loop pausable and resumable?'",
      "architect": "At the architecture level, the agent loop is the runtime engine that turns a capable model into an autonomous system, and its design choices directly determine whether autonomy is a controlled, valuable capability or an unbounded operational and financial risk. The central architectural responsibility is bounding the loop: defining clear, layered termination conditions (task-complete signal, max iterations, cost ceiling, wall-clock timeout, human interrupt) so autonomy is always exercised within an explicit, enforced envelope rather than open-ended.\n\nArchitecture overview: Goal -> Planner (LLM) -> Executor (Tools) -> Memory/State -> Stop Condition, but at scale this loop runs inside a managed runtime that handles concurrency (many agent loops running simultaneously across users/tasks), durability (loops that must survive process restarts), and resource governance (per-loop and aggregate cost/rate limits across the whole platform).\n\nKey trade-offs: loop autonomy vs. predictability (a tightly bounded loop with frequent checkpoints is safer and cheaper to reason about, but less capable of solving genuinely novel multi-step problems; a loosely bounded loop is more capable but harder to predict, cost, and secure); single-loop-per-task vs. nested loops/sub-agents (decomposing a complex loop into bounded sub-loops improves containment and debuggability at the cost of added orchestration complexity, connecting directly to swarm/workflow design decisions); and synchronous human-in-the-loop checkpoints vs. full autonomy (checkpoints reduce risk for consequential actions but reintroduce latency and human bottlenecks at scale).\n\nBest practices at scale: enforce hard, non-bypassable resource ceilings (iteration count, token/cost budget, wall-clock time) at the platform/runtime level, not just as a polite suggestion in the agent's own logic; build comprehensive loop observability — full step-by-step execution traces, replayable for audit and debugging, the same standard as distributed tracing for microservices; design explicit escalation paths for stuck or low-confidence loops (route to a human, not an infinite retry); and treat loop termination logic itself as safety-critical code requiring the same testing rigor as any other production control system. Common mistakes: relying solely on the model's own judgement to know when to stop, with no external enforcement; insufficient observability into long-running loops, making failures nearly impossible to diagnose after the fact; and no graceful degradation path when a loop hits its limits — the system should hand off cleanly to a human or a safe fallback, not simply error out.\n\nReal-world implementation: a large platform running thousands of concurrent autonomous agent loops enforces per-loop cost and iteration ceilings at the runtime/infrastructure level (independent of any single agent's prompt), captures full execution traces for every loop for audit and replay, and automatically escalates any loop that exceeds a stuck-behavior heuristic (e.g., near-duplicate actions repeated several times) to a human review queue rather than letting it continue unsupervised.\n\nInterview questions: 'How would you design resource governance for thousands of concurrent autonomous agent loops running across an organization?' 'What's your strategy for detecting and handling a stuck or runaway agent loop in production?' 'How do you decide the right balance between loop autonomy and human-in-the-loop checkpoints for a given use case?'"
    },
    "deepDive": {
      "junior": "The agent loop is concretely a `while` loop: ask the model what to do next, run it if it's a tool call, feed the result back in, and repeat until the model says it's done.",
      "senior": "Cap the loop with a max-iteration count and a cost budget checked every pass, and persist the running state so a long loop can be inspected or resumed instead of being a black box.",
      "architect": "Enforce iteration/cost ceilings at the runtime level (not just in the agent's own logic), capture a full step-by-step trace for every run, and auto-escalate loops that look stuck to a human queue."
    },
    "deepDiveCode": {
      "language": "javascript",
      "caption": "A bounded perceive-plan-act-observe loop with a hard iteration ceiling",
      "snippet": "async function runAgentLoop(goal, { maxSteps = 8 } = {}) {\n  let state = { goal, history: [] };\n\n  for (let step = 0; step < maxSteps; step++) {\n    const decision = await planNextAction(state);      // Perceive + Plan\n    if (decision.done) return decision.finalAnswer;\n\n    const observation = await executeTool(decision);    // Act\n    state.history.push({ decision, observation });       // Observe\n  }\n  throw new Error('Agent loop exceeded max steps without completing.');\n}"
    },
    "images": [
      {
        "url": "images/agent-loop-flow.svg",
        "caption": "The perceive, plan, act, observe cycle repeating until the task completes"
      },
      {
        "url": "images/agent-loop-layers.svg",
        "caption": "Agent loop architecture with planner, executor, memory, and stop condition"
      }
    ],
    "references": [
      {
        "title": "ReAct: Synergizing Reasoning and Acting in Language Models",
        "url": "https://arxiv.org/abs/2210.03629"
      },
      {
        "title": "Anthropic - Building Effective Agents",
        "url": "https://www.anthropic.com/research/building-effective-agents"
      },
      {
        "title": "LangGraph - Agent Loop Concepts",
        "url": "https://langchain-ai.github.io/langgraph/concepts/agentic_concepts/"
      }
    ]
  }
];
