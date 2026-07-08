"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function signIn(event: React.FormEvent) {
    event.preventDefault();
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setMessage(`No se ha podido entrar: ${error.message}`);
      return;
    }

    window.location.href = "/";
  }

  return (
    <form onSubmit={signIn} style={{ display: "grid", gap: 10 }}>
      <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" type="email" />
      <input value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Contrasena" type="password" />
      <button type="submit">Entrar</button>
      {message ? <p className="muted">{message}</p> : null}
      <p className="muted">
        Si el login falla, abre <a href="/api/public/debug-config" target="_blank">diagnostico seguro</a>.
      </p>
    </form>
  );
}
