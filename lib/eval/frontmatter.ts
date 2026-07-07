// Minimal YAML frontmatter parser for SKILL.md files.
// Supports the subset skills actually use: scalar values, quoted strings,
// inline arrays, dash lists, and one level of nested maps (e.g. metadata:).

export interface FrontmatterResult {
  /** Parsed key/value pairs. Nested maps become Record<string, string>, lists become string[]. */
  data: Record<string, unknown>;
  /** Raw frontmatter text between the --- fences (without fences). */
  raw: string | null;
  /** Markdown body after the closing fence (or whole input if no frontmatter). */
  body: string;
  /** True when a frontmatter block was found. */
  found: boolean;
  /** True when the opening fence exists but the closing fence is missing. */
  unterminated: boolean;
  /** 1-based line number in the source where each top-level key appears. */
  keyLines: Record<string, number>;
}

function unquote(value: string): string {
  const v = value.trim();
  if (v.length >= 2 && ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'")))) {
    return v.slice(1, -1);
  }
  return v;
}

function parseInlineArray(value: string): string[] | null {
  const v = value.trim();
  if (!v.startsWith('[') || !v.endsWith(']')) return null;
  const inner = v.slice(1, -1).trim();
  if (!inner) return [];
  return inner.split(',').map(s => unquote(s));
}

export function parseFrontmatter(source: string): FrontmatterResult {
  const normalized = source.replace(/\r\n/g, '\n');
  const empty: FrontmatterResult = {
    data: {}, raw: null, body: normalized, found: false, unterminated: false, keyLines: {},
  };

  if (!normalized.startsWith('---')) return empty;
  const firstLineEnd = normalized.indexOf('\n');
  if (firstLineEnd === -1 || normalized.slice(0, firstLineEnd).trim() !== '---') return empty;

  const rest = normalized.slice(firstLineEnd + 1);
  const closeMatch = rest.match(/^---\s*$/m);
  if (!closeMatch || closeMatch.index === undefined) {
    return { ...empty, found: true, unterminated: true, raw: rest, body: '' };
  }

  const raw = rest.slice(0, closeMatch.index);
  const body = rest.slice(closeMatch.index).replace(/^---\s*\n?/, '');
  const data: Record<string, unknown> = {};
  const keyLines: Record<string, number> = {};

  const lines = raw.split('\n');
  let currentKey: string | null = null;
  let listBuffer: string[] | null = null;
  let mapBuffer: Record<string, string> | null = null;
  let blockBuffer: string[] | null = null;
  let blockIndent = -1;

  const flush = () => {
    if (currentKey === null) return;
    if (blockBuffer !== null) data[currentKey] = blockBuffer.join('\n').trim();
    else if (listBuffer !== null) data[currentKey] = listBuffer;
    else if (mapBuffer !== null) data[currentKey] = mapBuffer;
    currentKey = null;
    listBuffer = null;
    mapBuffer = null;
    blockBuffer = null;
    blockIndent = -1;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const indent = line.length - line.trimStart().length;
    const trimmed = line.trim();

    // Continuation of a block scalar (| or >)
    if (blockBuffer !== null) {
      if (trimmed === '' || indent > 0) {
        if (blockIndent === -1 && trimmed !== '') blockIndent = indent;
        blockBuffer.push(blockIndent > 0 ? line.slice(Math.min(indent, blockIndent)) : line);
        continue;
      }
      flush();
    }

    if (trimmed === '' || trimmed.startsWith('#')) continue;

    // Dash list item under current key
    if (trimmed.startsWith('- ') && indent > 0 && currentKey !== null) {
      if (listBuffer === null) listBuffer = [];
      listBuffer.push(unquote(trimmed.slice(2)));
      continue;
    }

    // Nested map entry under current key
    if (indent > 0 && currentKey !== null && trimmed.includes(':')) {
      if (mapBuffer === null) mapBuffer = {};
      const ci = trimmed.indexOf(':');
      mapBuffer[trimmed.slice(0, ci).trim()] = unquote(trimmed.slice(ci + 1));
      continue;
    }

    // Top-level key
    const colonIdx = trimmed.indexOf(':');
    if (indent === 0 && colonIdx > 0) {
      flush();
      const key = trimmed.slice(0, colonIdx).trim();
      const valueRaw = trimmed.slice(colonIdx + 1).trim();
      keyLines[key] = i + 2; // +1 for 0-index, +1 for opening fence line

      if (valueRaw === '|' || valueRaw === '>' || valueRaw === '|-' || valueRaw === '>-') {
        currentKey = key;
        blockBuffer = [];
      } else if (valueRaw === '') {
        currentKey = key;
        data[key] = ''; // may be replaced by list/map buffer on flush
      } else {
        const arr = parseInlineArray(valueRaw);
        data[key] = arr !== null ? arr : unquote(valueRaw);
      }
    }
  }
  flush();

  return { data, raw, body, found: true, unterminated: false, keyLines };
}

/** Serialize a flat frontmatter object back to YAML, quoting only when needed. */
export function serializeFrontmatter(data: Record<string, unknown>): string {
  // Quote number/boolean-looking values too, so "1.10" stays a string.
  const needsQuotes = (s: string) =>
    /[:#\[\]{}&*!|>'"%@`]/.test(s) || s !== s.trim() || s === '' ||
    /^-?[\d.]+$/.test(s) || /^(true|false|null|yes|no|on|off)$/i.test(s);
  const lines: string[] = ['---'];
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) {
      lines.push(`${key}:`);
      for (const item of value) lines.push(`  - ${String(item)}`);
    } else if (typeof value === 'object') {
      lines.push(`${key}:`);
      for (const [k, v] of Object.entries(value as Record<string, string>)) {
        lines.push(`  ${k}: ${String(v)}`);
      }
    } else {
      const s = String(value);
      lines.push(needsQuotes(s) ? `${key}: ${JSON.stringify(s)}` : `${key}: ${s}`);
    }
  }
  lines.push('---');
  return lines.join('\n');
}
