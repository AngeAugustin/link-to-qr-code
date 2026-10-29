import { cn } from "@/lib/cn";

export function Ledger({ caption, children, className }: { caption: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("overflow-x-auto border border-outline-variant bg-surface-container-lowest", className)}>
      <table className="w-full min-w-[44rem] border-collapse text-left">
        <caption className="sr-only">{caption}</caption>
        {children}
      </table>
    </div>
  );
}

export const th = "whitespace-nowrap px-4 py-2.5 text-label-sm font-medium text-on-surface-variant";
export const td = "px-4 py-3 align-middle text-body-sm";
export const tr = "border-t border-outline-variant hover:bg-surface-container-low";
