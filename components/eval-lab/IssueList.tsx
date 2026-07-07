import React from 'react';
import { AlertCircle, AlertTriangle, Info, Wrench, CheckCircle2 } from 'lucide-react';
import type { LintIssue, Severity } from '../../lib/eval/types';

const SEVERITY_STYLES: Record<Severity, { icon: React.ReactNode; badge: string; label: string }> = {
  error: {
    icon: <AlertCircle size={15} className="text-red-500 shrink-0 mt-0.5" />,
    badge: 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900',
    label: 'Error',
  },
  warning: {
    icon: <AlertTriangle size={15} className="text-[#FA7506] shrink-0 mt-0.5" />,
    badge: 'bg-orange-50 dark:bg-orange-950/40 text-[#FA7506] border-orange-200 dark:border-orange-900',
    label: 'Warning',
  },
  info: {
    icon: <Info size={15} className="text-stone-400 shrink-0 mt-0.5" />,
    badge: 'bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 border-stone-200 dark:border-stone-700',
    label: 'Tip',
  },
};

interface IssueListProps {
  issues: LintIssue[];
  strengths: string[];
}

const IssueList: React.FC<IssueListProps> = ({ issues, strengths }) => {
  const ordered = [...issues].sort((a, b) => {
    const rank: Record<Severity, number> = { error: 0, warning: 1, info: 2 };
    return rank[a.severity] - rank[b.severity];
  });

  return (
    <div className="space-y-6">
      {ordered.length === 0 && (
        <div className="flex items-center gap-3 p-5 rounded-2xl border border-green-200 dark:border-green-900 bg-green-50/50 dark:bg-green-950/20">
          <CheckCircle2 size={18} className="text-green-600 dark:text-green-400" />
          <p className="text-sm text-green-700 dark:text-green-300">No issues found. This passes every check.</p>
        </div>
      )}

      {ordered.length > 0 && (
        <ul className="space-y-3">
          {ordered.map((issue, idx) => {
            const style = SEVERITY_STYLES[issue.severity];
            return (
              <li key={`${issue.ruleId}-${idx}`} className="p-4 rounded-2xl border border-[var(--bg-card-border)] bg-[var(--bg-card)]">
                <div className="flex items-start gap-3">
                  {style.icon}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-sm font-semibold text-stone-800 dark:text-stone-200">{issue.title}</span>
                      <span className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border ${style.badge}`}>
                        {style.label}
                      </span>
                      <span className="text-[10px] font-mono text-stone-400 dark:text-stone-500">
                        {issue.ruleId}{issue.line ? ` · L${issue.line}` : ''}
                      </span>
                    </div>
                    <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed mb-2">{issue.detail}</p>
                    <div className="flex items-start gap-1.5 text-xs text-stone-500 dark:text-stone-400">
                      <Wrench size={12} className="shrink-0 mt-0.5 text-stone-400" />
                      <span><span className="font-semibold">Fix:</span> {issue.fix}</span>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {strengths.length > 0 && (
        <div>
          <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">What's working</h3>
          <ul className="space-y-2">
            {strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-stone-600 dark:text-stone-400">
                <CheckCircle2 size={14} className="text-green-600 dark:text-green-500 shrink-0 mt-0.5" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default React.memo(IssueList);
