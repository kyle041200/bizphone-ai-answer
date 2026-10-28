export function StackedBricks({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="m3 13 6-3 6 3-6 3-6-3Zm6 3v5m-6-8v5l6 3 6-3v-5" />
    <path d="m9 5 6-3 6 3-6 3-6-3Zm6 3v5m-6-8v5m12-5v5l-6 3" />
    <path d="m15 13 6-3v5l-6 3" />
  </svg>;
}