export function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="#6366f1" />
      <rect x="7" y="9"     width="12" height="2.5" rx="1.25" fill="white" opacity="0.95" />
      <rect x="7" y="14.75" width="18" height="2.5" rx="1.25" fill="white" opacity="0.95" />
      <rect x="7" y="20.5"  width="8"  height="2.5" rx="1.25" fill="white" opacity="0.95" />
    </svg>
  )
}
