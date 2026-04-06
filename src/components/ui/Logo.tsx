export function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="oklch(75% 0.18 65)" />
      <rect x="8" y="9" width="10" height="2.5" rx="1.25" fill="oklch(11% 0.005 260)" />
      <rect x="8" y="14.75" width="16" height="2.5" rx="1.25" fill="oklch(11% 0.005 260)" />
      <rect x="8" y="20.5" width="7" height="2.5" rx="1.25" fill="oklch(11% 0.005 260)" />
    </svg>
  )
}
