import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth/AuthForm";
import { safeNext } from "@/lib/safe-next";
import { getSessionUser } from "@/lib/auth";

export const metadata: Metadata = { title: "Connexion" };

type Props = {
  searchParams: Promise<{ next?: string }>;
};

export default async function Page({ searchParams }: Props) {
  const { next } = await searchParams;
  if (await getSessionUser()) redirect(safeNext(next));
  return <AuthForm mode="login" next={next} />;
}
