// Direct-from-browser Anthropic Messages API client.
// The key never leaves the visitor's browser — requests go straight to
// api.anthropic.com using the CORS opt-in header Anthropic provides for
// client-side apps.

export interface ModelOption {
  id: string;
  label: string;
  note: string;
  /** USD per million tokens, for the run-cost estimate. */
  inputPerMTok: number;
  outputPerMTok: number;
}

export const MODEL_OPTIONS: ModelOption[] = [
  { id: 'claude-haiku-4-5', label: 'Claude Haiku 4.5', note: 'Fastest, cheapest — good for eval runs', inputPerMTok: 1, outputPerMTok: 5 },
  { id: 'claude-sonnet-5', label: 'Claude Sonnet 5', note: 'Balanced — good default for grading', inputPerMTok: 3, outputPerMTok: 15 },
  { id: 'claude-opus-4-8', label: 'Claude Opus 4.8', note: 'Most capable — best for improving', inputPerMTok: 5, outputPerMTok: 25 },
];

export const DEFAULT_MODEL = 'claude-sonnet-5';

export function estimateCost(modelId: string, inputTokens: number, outputTokens: number): number {
  const model = MODEL_OPTIONS.find(m => m.id === modelId);
  if (!model) return 0;
  return (inputTokens * model.inputPerMTok + outputTokens * model.outputPerMTok) / 1_000_000;
}

export interface MessageRequest {
  apiKey: string;
  model: string;
  system?: string;
  prompt: string;
  maxTokens?: number;
  signal?: AbortSignal;
}

export interface MessageResponse {
  text: string;
  inputTokens: number;
  outputTokens: number;
  stopReason: string | null;
}

export class AnthropicError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'AnthropicError';
  }
}

export async function sendMessage(req: MessageRequest): Promise<MessageResponse> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    signal: req.signal,
    headers: {
      'content-type': 'application/json',
      'x-api-key': req.apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    // No temperature/top_p: the newest Claude models reject sampling params.
    body: JSON.stringify({
      model: req.model,
      max_tokens: req.maxTokens ?? 1024,
      ...(req.system ? { system: req.system } : {}),
      messages: [{ role: 'user', content: req.prompt }],
    }),
  });

  if (!res.ok) {
    let detail = res.statusText;
    try {
      const err = await res.json();
      detail = err?.error?.message || detail;
    } catch { /* non-JSON error body */ }
    if (res.status === 401) detail = 'Invalid API key. Check the key and try again.';
    if (res.status === 429) detail = 'Rate limited by the Anthropic API. Wait a moment and retry.';
    throw new AnthropicError(res.status, detail);
  }

  const data = await res.json();
  const text = Array.isArray(data.content)
    ? data.content.filter((b: { type: string }) => b.type === 'text').map((b: { text: string }) => b.text).join('')
    : '';
  return {
    text,
    inputTokens: data.usage?.input_tokens ?? 0,
    outputTokens: data.usage?.output_tokens ?? 0,
    stopReason: data.stop_reason ?? null,
  };
}

/** Extract the first JSON object from a model response that may wrap it in prose or code fences. */
export function extractJson<T>(text: string): T | null {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidates = [fenced?.[1], text];
  for (const candidate of candidates) {
    if (!candidate) continue;
    const start = candidate.indexOf('{');
    const end = candidate.lastIndexOf('}');
    if (start === -1 || end <= start) continue;
    try {
      return JSON.parse(candidate.slice(start, end + 1)) as T;
    } catch { /* try next candidate */ }
  }
  return null;
}
