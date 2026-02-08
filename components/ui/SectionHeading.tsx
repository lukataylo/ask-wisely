import React from 'react';

const SectionHeading: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  return (
    <h3 className={`text-xs font-bold text-stone-400 uppercase tracking-widest mb-4 ${className}`}>
      {children}
    </h3>
  );
};

export default React.memo(SectionHeading);
