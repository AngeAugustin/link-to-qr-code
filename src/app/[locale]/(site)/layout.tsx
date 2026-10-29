import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { VisitBeacon } from "@/components/site/VisitBeacon";
import { getSessionUser } from "@/lib/auth";

export default async function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await getSessionUser();

  return (
    <>
      <VisitBeacon />
      <SiteHeader user={user} />
      <main className="min-w-0 flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}
