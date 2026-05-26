# Claude Code — From Solo Chat to Team of Agents

Experiments in multi-agent orchestration, evolving from a single chat interaction to a coordinated team of agents running against locally-hosted models via [Ollama](https://ollama.com).

Inspired by [@0x_rody](https://x.com/0x_rody/status/2058475548242784649).

> **Note:** The agent-generated output (backend, frontend, tests) was scaffolded by `gemma4:e2b` via Claude Code's subagent feature, then completed and fixed using **Claude Desktop on macOS with Claude Sonnet 4.6**.

## The 3 levels

| Level | What it is | Best for |
|---|---|---|
| 1 — Subagents | Single session, report back | Repeatable tasks |
| 2 — Agent View | Dashboard, sessions persist | 3–10 independent tasks |
| 3 — Agent Teams | Lead + teammates, shared context | Dependent multi-file features |

## The experiment: auth system

The team prompt used across all runs:

```
I need to build a user authentication system. Spawn separate agents to handle:

1. Backend: Create Express.js routes for login, signup, and token refresh
2. Frontend: Build React login and signup forms with validation
3. Testing: Write integration tests for all auth endpoints
4. Review: Review all code produced by the other agents for security issues
```

Claude Code reliably spawned 4 parallel agents. `gemma4:e2b` completed the task but struggled with file editing and hallucinated scripts. The generated code was then corrected and completed with Sonnet 4.6.

## Running the example

### Prerequisites

- [Node.js](https://nodejs.org) running locally
- [Ollama](https://ollama.com) running locally with your target model pulled

### Start everything

```bash
npm run start:app
```

Starts the Express backend, waits until it's healthy, then opens `http://localhost:3000` in your browser. The backend serves both the API and the React frontend — no separate build step needed.

### Run the tests

With the backend running in another terminal:

```bash
npm test
```

Runs 9 integration tests against the live server using Node.js's built-in `node:test` runner.

## npm scripts

```bash
npm start                # launch Claude Code with gemma4:e2b via Ollama
npm run launch:gemma4    # ollama launch claude --model gemma4:e2b
npm run launch:gpt-oss   # ollama launch claude --model gpt-oss:20b
npm run start:backend    # node server.js (serves API + frontend at :3000)
npm run start:frontend   # open http://localhost:3000
npm test                 # node --test tests/auth.test.js
```

To add a new model:
```json
"launch:<model>": "ollama launch claude --model <ollama-model-tag>"
```

## Related

- [ollama-model-comparison](https://github.com/TheRobBrennan/ollama-model-comparison) — side-by-side model comparisons on coding scenarios
