import React from 'react';

interface PillButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  compact?: boolean;
}

const PillButton: React.FC<PillButtonProps> = ({ active = false, compact = false, className = '', children, ...props }) => {
  return (
    <button
      type="button"
      className={`${compact ? 'px-4 py-1.5 text-[10px] tracking-[0.15em]' : 'px-5 py-2 text-[10px] tracking-[0.2em]'} shrink-0 rounded-full font-bold uppercase transition-all duration-300 border ${
        active
          ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 border-stone-900 dark:border-stone-100 shadow-sm'
          : 'bg-white dark:bg-stone-800 text-stone-400 border-stone-200 dark:border-stone-700 hover:border-stone-400 dark:hover:border-stone-500'
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default React.memo(PillButton);
