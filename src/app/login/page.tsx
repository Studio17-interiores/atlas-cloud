import { AuthForm } from "./ui";

export default function LoginPage() {
  return (
    <main className="main">
      <section className="hero">
        <p>Acceso privado</p>
        <h1>Entrar en ATLAS</h1>
        <p>Studio 17 Cloud requiere autenticación para proteger proyectos, clientes y documentos.</p>
      </section>
      <section className="grid">
        <article className="panel large">
          <AuthForm />
        </article>
      </section>
    </main>
  );
}

