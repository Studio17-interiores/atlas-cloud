type SystemPageProps = {
  searchParams?: {
    setup?: string;
    message?: string;
  };
};

export default function SystemPage({ searchParams }: SystemPageProps) {
  const setupDone = searchParams?.setup === "done";
  const setupError = searchParams?.setup === "error";

  return (
    <>
      <section className="hero">
        <p>Sistema</p>
        <h1>Studio 17 Cloud</h1>
        <p>Login activo. Ahora toca crear la organizacion, permisos y datos iniciales.</p>
      </section>
      <section className="grid">
        <article className="panel large">
          <h2>Crear base de Studio 17</h2>
          <p>Esto crea tu organizacion, te marca como propietaria y carga Axis, Garridos, objetivos y tareas iniciales.</p>
          <form action="/api/setup/studio17" method="post">
            <button type="submit">Crear Studio 17 y datos iniciales</button>
          </form>
          {setupDone ? <p className="muted">Listo: Studio 17 ya esta inicializado en la nube.</p> : null}
          {setupError ? <p className="muted">Error: {searchParams?.message ?? "No se ha podido inicializar."}</p> : null}
        </article>
        <article className="panel">
          <h2>Estado</h2>
          <p>Login cloud activo. Siguiente: conectar las pantallas a datos reales.</p>
        </article>
        <article className="panel">
          <h2>Despues</h2>
          <p>Importaremos documentos, plantillas y movimientos nuevos desde ATLAS local.</p>
        </article>
      </section>
    </>
  );
}
