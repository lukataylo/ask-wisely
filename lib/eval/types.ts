// Shared types for the Eval Lab lint engine, fixer, and test runner.

export type Severity = 'error' | 'warning' | 'info';

export interface LintIssue {
  ruleId: string;
  severity: Severity;
  title: string;
  detail: string;
  fix: string;
  /** 1-based line in the source document, when the issue can be located. */
  line?: number;
  /** True when the mechanical fixer can resolve this automatically. */
  autoFixable?: boolean;
}

export interface DocStats {
  lines: number;
  words: number;
  /** Rough token estimate (chars / 4). */
  tokens: number;
  headings: number;
  codeBlocks: number;
  examples: boolean;
}

export interface LintReport {
  issues: LintIssue[];
  /** 0-100 quality score derived from issue severity and positive signals. */
  score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  stats: DocStats;
  /** Positive signals detected (shown as "what's working"). */
  strengths: string[];
}

export const SEVERITY_WEIGHT: Record<Severity, number> = {
  error: 15,
  warning: 6,
  info: 2,
};

export function scoreFromIssues(issues: LintIssue[], strengthBonus: number): { score: number; grade: LintReport['grade'] } {
  const penalty = issues.reduce((sum, i) => sum + SEVERITY_WEIGHT[i.severity], 0);
  const score = Math.max(0, Math.min(100, 100 - penalty + strengthBonus));
  const grade = score >= 90 ? 'A' : score >= 75 ? 'B' : score >= 60 ? 'C' : score >= 40 ? 'D' : 'F';
  return { score, grade };
}

export function computeStats(body: string): DocStats {
  const lines = body.split('\n').length;
  const words = body.split(/\s+/).filter(Boolean).length;
  return {
    lines,
    words,
    tokens: Math.round(body.length / 4),
    headings: (body.match(/^#{1,6}\s/gm) || []).length,
    codeBlocks: Math.floor((body.match(/^```/gm) || []).length / 2),
    examples: /example|for instance|e\.g\.|input:|output:/i.test(body),
  };
}
