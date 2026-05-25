const MODEL = process.env.OLLAMA_MODEL || 'gemma4:e2b';
const HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';

async function runAgent({ role, task, context = '' }) {
  const userMessage = context
    ? `Context from other agents:\n${context}\n\nYour task:\n${task}`
    : task;

  console.log(`\n[${role}] Starting...`);

  const res = await fetch(`${HOST}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      stream: false,
      messages: [
        { role: 'system', content: `You are a ${role}. Be concise and practical.` },
        { role: 'user', content: userMessage },
      ],
    }),
  });

  if (!res.ok) throw new Error(`Ollama error ${res.status}: ${await res.text()}`);

  const data = await res.json();
  const result = data.message.content;
  console.log(`[${role}] Done.`);
  return result;
}

module.exports = { runAgent };
