import React from 'react';
import type { LintReport } from '../../lib/eval/types';

const GRADE_COLORS: Record<LintReport['grade'], string> = {
  A: '#16a34a',
  B: '#65a30d',
  C: '#FA7506',
  D: '#ea580c',
  F: '#dc2626',
};

interface ScoreGaugeProps {
  score: number;
  grade: LintReport['grade'];
  label: string;
}

const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, grade, label }) => {
  const r = 52;
  const circumference = 2 * Math.PI * r;
  const filled = (score / 100) * circumference;
  const color = GRADE_COLORS[grade];

  return (
    <div className="flex flex-col items-center" role="img" aria-label={`${label}: ${score} out of 100, grade ${grade}`}>
      <div className="relative w-32 h-32">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          <circle cx="60" cy="60" r={r} fill="none" strokeWidth="8" className="stroke-stone-200 dark:stroke-stone-700" />
          <circle
            cx="60" cy="60" r={r} fill="none" strokeWidth="8" strokeLinecap="round"
            stroke={color}
            strokeDasharray={`${filled} ${circumference - filled}`}
            style={{ transition: 'stroke-dasharray 0.6s ease, stroke 0.6s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="serif text-4xl font-medium text-stone-900 dark:text-stone-100">{score}</span>
          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color }}>Grade {grade}</span>
        </div>
      </div>
      <span className="mt-2 text-[10px] font-bold uppercase tracking-widest text-stone-400">{label}</span>
    </div>
  );
};

export default React.memo(ScoreGauge);
