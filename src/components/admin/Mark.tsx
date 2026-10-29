import { cn } from "@/lib/cn";

const tones = {
  ink: "bg-tertiary-container text-on-tertiary",
  accent: "bg-primary-fixed text-on-primary-fixed",
  signal: "bg-tertiary-fixed text-on-tertiary-fixed",
  quiet: "bg-surface-container text-on-surface-variant",
} as const;

export function statusTone(status: string) {
  if (status === "ACTIVE" || status === "TRIALING") return "accent" as const;
  if (status === "PAST_DUE") return "signal" as const;
  return "quiet" as const;
}

export function Mark({ children, tone = "quiet" }: { children: React.ReactNode; tone?: keyof typeof tones }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-label-sm", tones[tone])}>{children}</span>
  );
}
