// Simple line-based LCS diff for showing original vs. improved documents.

export type DiffOp = 'same' | 'add' | 'del';

export interface DiffLine {
  op: DiffOp;
  text: string;
}

export function diffLines(before: string, after: string): DiffLine[] {
  const a = before.replace(/\r\n/g, '\n').split('\n');
  const b = after.replace(/\r\n/g, '\n').split('\n');
  const n = a.length;
  const m = b.length;

  // Guard against pathological sizes — fall back to whole-document replace.
  if (n * m > 4_000_000) {
    return [
      ...a.map(text => ({ op: 'del' as DiffOp, text })),
      ...b.map(text => ({ op: 'add' as DiffOp, text })),
    ];
  }

  // LCS table (m+1 columns per row, flattened)
  const width = m + 1;
  const table = new Uint32Array((n + 1) * width);
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      table[i * width + j] = a[i] === b[j]
        ? table[(i + 1) * width + j + 1] + 1
        : Math.max(table[(i + 1) * width + j], table[i * width + j + 1]);
    }
  }

  const out: DiffLine[] = [];
  let i = 0, j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      out.push({ op: 'same', text: a[i] });
      i++; j++;
    } else if (table[(i + 1) * width + j] >= table[i * width + j + 1]) {
      out.push({ op: 'del', text: a[i] });
      i++;
    } else {
      out.push({ op: 'add', text: b[j] });
      j++;
    }
  }
  while (i < n) out.push({ op: 'del', text: a[i++] });
  while (j < m) out.push({ op: 'add', text: b[j++] });
  return out;
}
