export default function SystemPage() {
  return (
    <>
      <section className="hero">
        <p>Sistema</p>
        <h1>Cloud readiness</h1>
        <p>Auth, base de datos, almacenamiento, backups, IA y automatizaciones.</p>
      </section>
      <section className="grid">
        <article className="panel">
          <h2>Supabase</h2>
          <p>Ejecutar schema y activar buckets.</p>
        </article>
        <article className="panel">
          <h2>Vercel</h2>
          <p>Configurar variables de entorno y dominio.</p>
        </article>
        <article className="panel">
          <h2>OpenAI</h2>
          <p>Conectar revisión diaria y lectura documental desde servidor.</p>
        </article>
      </section>
    </>
  );
}

