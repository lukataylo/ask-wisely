import React from 'react';

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

const ActionButton: React.FC<ActionButtonProps> = ({ variant = 'secondary', className = '', children, ...props }) => {
  const base = 'flex items-center gap-2 rounded-full transition-all text-sm';
  const styles = variant === 'primary'
    ? 'px-8 py-3 font-bold bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-stone-200 shadow-lg hover:shadow-xl'
    : 'px-4 py-3 border border-stone-200 dark:border-stone-700 font-medium text-stone-500 dark:text-stone-400 hover:border-stone-400 dark:hover:border-stone-500 hover:text-stone-700 dark:hover:text-stone-300';

  return (
    <button type="button" className={`${base} ${styles} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default React.memo(ActionButton);
