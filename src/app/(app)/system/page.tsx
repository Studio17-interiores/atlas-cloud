type SystemPageProps = {
  searchParams?: {
    setup?: string;
    message?: string;
    goals?: string;
  };
};

export default function SystemPage({ searchParams }: SystemPageProps) {
  const setupDone = searchParams?.setup === "done";
  const setupError = searchParams?.setup === "error";

  return (
    <>
      <section className="hero">
        <p>Sistema</p>
        <h1>Seguridad, backups y base cloud</h1>
        <p>ATLAS ya funciona con login. Aqui se protege, se exporta y se prepara para crecer.</p>
      </section>
      <section className="grid">
        <article className="panel large">
          <h2>Crear base de Studio 17</h2>
          <p>Esto crea tu organizacion, permisos y datos iniciales si aun no existen.</p>
          <form action="/api/setup/studio17" method="post">
            <button type="submit">Crear Studio 17 y datos iniciales</button>
          </form>
          {setupDone ? <p className="notice">Listo: Studio 17 ya esta inicializado en la nube.</p> : null}
          {setupError ? <p className="notice error">Error: {searchParams?.message ?? "No se ha podido inicializar."}</p> : null}
        </article>

        <article className="panel">
          <h2>Objetivos reales</h2>
          <p>Limpia los objetivos provisionales y crea estructura mensual, trimestral y anual para facturacion, obras, decoraciones, medidores, leads y marketing.</p>
          <form action="/api/setup/real-goals" method="post">
            <button type="submit">Crear objetivos reales</button>
          </form>
        </article>

        <article className="panel">
          <h2>Backup</h2>
          <p>Exporta una copia JSON completa de tus datos principales.</p>
          <a className="button-link subtle" href="/api/export">Exportar datos</a>
        </article>

        <article className="panel">
          <h2>Seguridad</h2>
          <ul className="clean-list">
            <li>Login privado activo.</li>
            <li>Datos separados por organizacion.</li>
            <li>Documentos en storage privado.</li>
            <li>Boton cerrar sesion en el menu lateral.</li>
          </ul>
        </article>

        <article className="panel large">
          <h2>Siguiente nivel</h2>
          <p>Permisos por usuario, logs completos y backups automaticos programados. La base ya esta preparada para anadirlos sin rehacer ATLAS.</p>
        </article>
      </section>
    </>
  );
}
