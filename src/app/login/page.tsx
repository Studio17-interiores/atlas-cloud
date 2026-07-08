import { AuthForm } from "./ui";

type LoginPageProps = {
  searchParams?: {
    error?: string;
  };
};

export default function LoginPage({ searchParams }: LoginPageProps) {
  return (
    <main className="main">
      <section className="hero">
        <p>Acceso privado</p>
        <h1>Entrar en ATLAS</h1>
        <p>Studio 17 Cloud requiere autenticacion para proteger proyectos, clientes y documentos.</p>
      </section>
      <section className="grid">
        <article className="panel large">
          <AuthForm error={searchParams?.error} />
        </article>
      </section>
    </main>
  );
}
