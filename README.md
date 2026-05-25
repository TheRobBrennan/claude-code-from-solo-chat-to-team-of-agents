# Claude Code — From Solo Chat to Team of Agents

Experiments in multi-agent orchestration, evolving from a single chat interaction to a coordinated team of agents running against locally-hosted models via [Ollama](https://ollama.com).

Inspired by [@0x_rody](https://x.com/0x_rody/status/2058475548242784649).

## The 3 levels

| Level | What it is | Best for |
|---|---|---|
| 1 — Subagents | Single session, report back | Repeatable tasks |
| 2 — Agent View | Dashboard, sessions persist | 3–10 independent tasks |
| 3 — Agent Teams | Lead + teammates, shared context | Dependent multi-file features |

## Start here: run the prompt directly

The fastest way to try this is a single Ollama session. No scripts needed.

**Step 1 — Start the model:**
```bash
ollama run gemma4:e2b
```

**Step 2 — Paste this team prompt:**
```
I need to build a user authentication system. Spawn separate agents to handle:

1. Backend: Create Express.js routes for login, signup, and token refresh
2. Frontend: Build React login and signup forms with validation
3. Testing: Write integration tests for all auth endpoints
4. Review: Review all code produced by the other agents for security issues
```

Observe how the model handles role decomposition and whether it produces coherent, distinct outputs per agent.

## Prerequisites

- [Ollama](https://ollama.com) running locally
- The target model pulled: `ollama pull gemma4:e2b`

## npm scripts

The `package.json` scripts are convenience launchers for when we add a parallel orchestration layer.

```bash
npm start              # same as launch:gemma4
npm run launch:gemma4  # sets OLLAMA_MODEL=gemma4:e2b
```

To add a new model, add a script to `package.json`:
```json
"launch:<model>": "OLLAMA_MODEL=<ollama-model-tag> node index.js"
```

## Related

- [ollama-model-comparison](https://github.com/TheRobBrennan/ollama-model-comparison) — side-by-side model comparisons on coding scenarios
