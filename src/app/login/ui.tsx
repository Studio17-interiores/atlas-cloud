type AuthFormProps = {
  error?: string;
};

export function AuthForm({ error }: AuthFormProps) {
  return (
    <form action="/api/public/login" method="post" style={{ display: "grid", gap: 10 }}>
      <input name="email" placeholder="Email" type="email" required />
      <input name="password" placeholder="Contrasena" type="password" required />
      <button type="submit">Entrar</button>
      {error ? <p className="muted">No se ha podido entrar: {error}</p> : null}
      <p className="muted">
        Si el login falla, abre <a href="/api/public/debug-config" target="_blank">diagnostico seguro</a>.
      </p>
    </form>
  );
}
