import React, { useMemo } from 'react';
import { diffLines } from '../../lib/eval/diff';

interface DiffViewProps {
  before: string;
  after: string;
}

const DiffView: React.FC<DiffViewProps> = ({ before, after }) => {
  const lines = useMemo(() => diffLines(before, after), [before, after]);

  return (
    <div className="rounded-2xl border border-[var(--bg-card-border)] bg-[var(--bg-card)] overflow-hidden">
      <div className="flex items-center gap-4 px-4 py-2.5 border-b border-[var(--bg-card-border)] text-[10px] font-bold uppercase tracking-widest text-stone-400">
        <span>Changes</span>
        <span className="text-green-600 dark:text-green-400 normal-case tracking-normal font-mono">
          +{lines.filter(l => l.op === 'add').length}
        </span>
        <span className="text-red-500 dark:text-red-400 normal-case tracking-normal font-mono">
          −{lines.filter(l => l.op === 'del').length}
        </span>
      </div>
      <div className="overflow-x-auto max-h-[480px] overflow-y-auto">
        <pre className="text-xs leading-relaxed font-mono min-w-full w-max">
          {lines.map((line, i) => (
            <div
              key={i}
              className={
                line.op === 'add'
                  ? 'bg-green-50 dark:bg-green-950/30 text-green-800 dark:text-green-300 px-4'
                  : line.op === 'del'
                    ? 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 px-4'
                    : 'text-stone-500 dark:text-stone-400 px-4'
              }
            >
              <span className="select-none inline-block w-4 text-stone-300 dark:text-stone-600">
                {line.op === 'add' ? '+' : line.op === 'del' ? '−' : ' '}
              </span>
              {line.text || ' '}
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
};

export default React.memo(DiffView);
