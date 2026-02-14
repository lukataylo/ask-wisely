export function OwlLogo({ size = 24, className = '' }: { size?: number; className?: string }) {
  return (
    <img
      src="/owl_logo.svg"
      width={size}
      height={size}
      className={className}
      role="img"
      alt="Ask Wisely home"
    />
  );
}
