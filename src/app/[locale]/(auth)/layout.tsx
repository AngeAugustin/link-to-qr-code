import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthModuleGrid } from "@/components/auth/AuthModuleGrid";
import { AuthShowcase } from "@/components/auth/AuthShowcase";

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="relative flex min-h-dvh flex-1 flex-col">
      <AuthModuleGrid />
      <AuthHeader />
      <div className="relative z-10 mx-auto grid w-full max-w-7xl flex-1 items-center gap-8 px-4 pb-[max(3.5rem,env(safe-area-inset-bottom))] pt-3 sm:gap-10 sm:px-6 sm:pb-14 sm:pt-4 md:gap-12 lg:grid-cols-2 lg:gap-16 lg:pb-20 lg:pt-6">
        <AuthShowcase />
        <div className="mx-auto w-full min-w-0 max-w-md lg:mx-0 lg:max-w-lg">{children}</div>
      </div>
    </div>
  );
}
