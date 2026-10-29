"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { safeNext } from "@/lib/safe-next";

const inputClass =
  "h-11 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-space-md outline-none focus:border-primary-container focus:ring-4 focus:ring-primary-fixed";

export function AuthForm({ mode, next }: { mode: "login" | "register"; next?: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const target = safeNext(next);
  const register = mode === "register";

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);
    const form = new FormData(event.currentTarget);
    try {
      const res = await fetch(register ? "/api/auth/register" : "/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(form)),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(
          data.code === "invalid" && register
            ? "Vérifiez les champs : un e-mail valide et un mot de passe d'au moins 8 caractères."
            : (data.error ?? "Erreur serveur."),
        );
        return;
      }
      router.push(target);
      router.refresh();
    } catch {
      setError("Erreur réseau. Réessayez.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-14">
      <h1 className="text-headline-lg">{register ? "Créer un compte" : "Connexion"}</h1>
      <p className="mt-2 text-body-md text-on-surface-variant">
        {register
          ? "Enregistrez vos QR codes, rendez-les dynamiques et suivez leurs scans."
          : "Retrouvez vos QR codes et leurs statistiques."}
      </p>
      <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-space-md rounded-2xl border border-outline-variant bg-surface-container-lowest p-space-lg">
        {register ? (
          <div className="flex flex-col gap-1.5">
            <label htmlFor="auth-name" className="text-label-sm text-on-surface-variant">Nom</label>
            <input id="auth-name" name="name" required maxLength={80} autoComplete="name" className={inputClass} />
          </div>
        ) : null}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="auth-email" className="text-label-sm text-on-surface-variant">E-mail</label>
          <input id="auth-email" name="email" type="email" required autoComplete="email" className={inputClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="auth-password" className="text-label-sm text-on-surface-variant">Mot de passe</label>
          <input
            id="auth-password"
            name="password"
            type="password"
            required
            minLength={register ? 8 : 1}
            autoComplete={register ? "new-password" : "current-password"}
            className={inputClass}
          />
          {register ? <p className="text-body-sm text-on-surface-variant">8 caractères minimum.</p> : null}
        </div>
        {error ? (
          <p role="alert" className="rounded-lg bg-error-container px-space-md py-space-sm text-body-sm text-on-error-container">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={pending}
          className={cn(
            "h-11 rounded-lg bg-tertiary-container text-label-md text-on-tertiary transition-colors hover:bg-tertiary",
            pending && "opacity-60",
          )}
        >
          {pending ? "Un instant…" : register ? "Créer mon compte" : "Se connecter"}
        </button>
      </form>
      <p className="mt-6 text-center text-body-sm text-on-surface-variant">
        {register ? "Déjà un compte ? " : "Pas encore de compte ? "}
        <Link
          href={`${register ? "/connexion" : "/inscription"}${next ? `?next=${encodeURIComponent(target)}` : ""}`}
          className="font-semibold text-primary-container hover:underline"
        >
          {register ? "Se connecter" : "Créer un compte"}
        </Link>
      </p>
    </div>
  );
}
