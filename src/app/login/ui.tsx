"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

type AuthFormProps = {
  error?: string;
};

type ClientConfig = {
  url: string;
  anonKey: string;
  error?: string;
};

export function AuthForm({ error }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(error ?? "");
  const [isLoading, setIsLoading] = useState(false);

  async function signIn(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");

    const configResponse = await fetch("/api/public/client-config", { cache: "no-store" });
    const config = (await configResponse.json()) as ClientConfig;

    if (!configResponse.ok || !config.url || !config.anonKey) {
      setIsLoading(false);
      setMessage(config.error ?? "ATLAS no ha podido leer la configuracion de Supabase.");
      return;
    }

    const supabase = createBrowserClient(config.url, config.anonKey);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setIsLoading(false);
      setMessage(signInError.message);
      return;
    }

    window.location.replace("/");
  }

  return (
    <form onSubmit={signIn} style={{ display: "grid", gap: 10 }}>
      <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" type="email" required />
      <input value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Contrasena" type="password" required />
      <button type="submit" disabled={isLoading}>{isLoading ? "Entrando..." : "Entrar"}</button>
      {message ? <p className="muted">No se ha podido entrar: {message}</p> : null}
      <p className="muted">
        Si el login falla, abre <a href="/api/public/debug-config" target="_blank">diagnostico seguro</a>.
      </p>
    </form>
  );
}
