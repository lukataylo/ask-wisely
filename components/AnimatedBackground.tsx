
import React from 'react';

const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div
        className="absolute -top-1/4 -left-1/4 w-[150%] h-[150%] opacity-40 blur-[120px]"
        style={{
          background: 'radial-gradient(circle, #f5f0e1 0%, #fdfbf7 70%)',
          animation: 'float1 20s linear infinite',
        }}
      />
      <div
        className="absolute -bottom-1/4 -right-1/4 w-[150%] h-[150%] opacity-30 blur-[120px]"
        style={{
          background: 'radial-gradient(circle, #e8dfd0 0%, #fdfbf7 70%)',
          animation: 'float2 25s linear infinite',
        }}
      />
    </div>
  );
};

export default AnimatedBackground;
