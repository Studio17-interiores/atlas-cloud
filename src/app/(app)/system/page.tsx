import { getStudio17Data } from "@/server/studio17-data";

type SystemPageProps = {
  searchParams?: {
    setup?: string;
    message?: string;
    goals?: string;
  };
};

export default async function SystemPage({ searchParams }: SystemPageProps) {
  const data = await getStudio17Data();
  const setupDone = searchParams?.setup === "done";
  const setupError = searchParams?.setup === "error";
  const recentEvents = [...data.historyEvents].reverse().slice(0, 12);

  return (
    <>
      <section className="hero compact-hero">
        <p>Sistema</p>
        <h1>Seguridad, backups e historial</h1>
        <p>La parte tranquila de ATLAS: proteger datos, revisar cambios y mantener la base cloud sana.</p>
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
          <h2>Backup</h2>
          <p>Descarga una copia JSON completa. Hazlo antes de cambios grandes.</p>
          <a className="button-link subtle" href="/api/export">Exportar datos</a>
        </article>

        <article className="panel">
          <h2>Objetivos reales</h2>
          <p>Limpia objetivos provisionales y crea estructura mensual, trimestral y anual.</p>
          <form action="/api/setup/real-goals" method="post">
            <button type="submit">Crear objetivos reales</button>
          </form>
        </article>

        <article className="panel">
          <h2>Estado cloud</h2>
          <ul className="clean-list">
            <li>Organizacion: {data.organization?.name ?? "no inicializada"}.</li>
            <li>Proyectos: {data.projects.length}.</li>
            <li>Documentos: {data.documents.length}.</li>
            <li>Plantillas: {data.templates.length}.</li>
          </ul>
        </article>

        <article className="panel full">
          <h2>Historial reciente</h2>
          <div className="table-list">
            {recentEvents.map((event) => {
              const project = data.projects.find((item) => item.id === event.project_id);
              return (
                <div className="row" key={event.id}>
                  <div>
                    <strong>{event.body}</strong>
                    <p className="muted">{event.type} · {project?.name ?? "Studio 17"}</p>
                  </div>
                  <span className="pill">{new Date(event.created_at).toLocaleDateString("es-ES")}</span>
                </div>
              );
            })}
            {!recentEvents.length ? <p className="muted">Todavia no hay eventos registrados.</p> : null}
          </div>
        </article>

        <article className="panel large">
          <h2>Seguridad</h2>
          <ul className="clean-list">
            <li>Login privado activo.</li>
            <li>Datos separados por organizacion.</li>
            <li>Documentos en storage privado.</li>
            <li>Boton cerrar sesion en el menu lateral.</li>
          </ul>
        </article>
      </section>
    </>
  );
}
