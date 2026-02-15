export function OwlLogo({ size = 24, className = '' }: { size?: number; className?: string }) {
  return (
    <>
      <img
        src="/owl_logo.svg"
        width={size}
        height={size}
        className={`dark:hidden ${className}`}
        role="img"
        alt="Ask Wisely home"
      />
      <img
        src="/owl_logo_dark.svg"
        width={size}
        height={size}
        className={`hidden dark:block ${className}`}
        aria-hidden="true"
        alt=""
      />
    </>
  );
}
