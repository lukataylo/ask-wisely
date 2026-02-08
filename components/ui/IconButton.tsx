import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  active?: boolean;
}

const IconButton: React.FC<IconButtonProps> = ({
  label,
  active = false,
  className = '',
  children,
  ...props
}) => {
  return (
    <button
      type="button"
      aria-label={label}
      className={`p-2 rounded-full transition-colors ${
        active
          ? 'text-red-500'
          : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default React.memo(IconButton);
