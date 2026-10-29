/** Subtle QR-module checker used as auth page atmosphere. */
export function AuthModuleGrid() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{
        backgroundImage: `
          linear-gradient(to right, var(--c-outline-variant) 1px, transparent 1px),
          linear-gradient(to bottom, var(--c-outline-variant) 1px, transparent 1px)
        `,
        backgroundSize: "20px 20px",
        maskImage: "radial-gradient(ellipse 85% 70% at 50% 40%, black 20%, transparent 72%)",
        WebkitMaskImage: "radial-gradient(ellipse 85% 70% at 50% 40%, black 20%, transparent 72%)",
        opacity: 0.35,
      }}
    />
  );
}
