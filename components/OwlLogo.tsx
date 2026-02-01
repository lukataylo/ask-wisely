export function OwlLogo({ size = 24, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role="img"
      aria-label="Ask Wisely home"
    >
      {/* Head outline */}
      <path d="M12 3C7 3 4 7 4 12c0 4 2.5 7 5 8.5L12 22l3-1.5c2.5-1.5 5-4.5 5-8.5 0-5-3-9-8-9z" />
      {/* Ear tufts */}
      <path d="M7.5 5.5L6 2" />
      <path d="M16.5 5.5L18 2" />
      {/* Left eye */}
      <circle cx="9.5" cy="11" r="2" />
      <circle cx="9.5" cy="11" r="0.75" fill="currentColor" stroke="none" />
      {/* Right eye */}
      <circle cx="14.5" cy="11" r="2" />
      <circle cx="14.5" cy="11" r="0.75" fill="currentColor" stroke="none" />
      {/* Beak */}
      <path d="M12 13.5l-1 1.5h2z" fill="currentColor" stroke="none" />
    </svg>
  );
}
