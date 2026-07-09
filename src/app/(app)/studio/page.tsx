import Link from "next/link";
import { formatEuro, getStudio17Data } from "@/server/studio17-data";

const studioLinks = [
  ["/assistant", "ATLAS IA", "Revisar riesgos, preparar reuniones y crear planes de accion."],
  ["/week", "Semana", "Plan semanal y tareas de foco."],
  ["/growth", "Objetivos", "Mensual, trimestral y anual."],
  ["/marketing", "Marketing", "Ideas, redes, SEO y contenido de obra."],
  ["/templates", "Documentos", "Contratos, presupuestos, fotos, facturas y plantillas."],
  ["/reports", "Informes", "Resumen semanal listo para copiar."],
  ["/automations", "Alertas", "Reglas que evitan olvidos."],
  ["/search", "Buscar", "Encuentra y actua sobre cualquier cosa."],
  ["/edit", "Editar todo", "Mantenimiento completo."],
  ["/system", "Sistema", "Backups, seguridad y configuracion."]
] as const;

export default async function StudioPage() {
  const data = await getStudio17Data();
  const openTasks = data.tasks.filter((task) => !task.done);
  const pendingMoney = data.moneyMovements
    .filter((movement) => movement.status === "pending")
    .reduce((total, movement) => total + Number(movement.amount), 0);
  const activeClients = data.clients.filter((client) => client.next_action);
  const weakProjects = data.projects.filter((project) => project.health < 70);

  return (
    <>
      <section className="hero compact-hero">
        <p>Studio</p>
        <h1>Sala de maquinas de Studio 17</h1>
        <p>Lo diario vive en Hoy. Aqui estan estrategia, documentos, informes, alertas y configuracion.</p>
      </section>

      <section className="metric-strip">
        <div>
          <strong>{openTasks.length}</strong>
          <span>tareas abiertas</span>
        </div>
        <div>
          <strong>{formatEuro(pendingMoney)}</strong>
          <span>pendiente</span>
        </div>
        <div>
          <strong>{activeClients.length}</strong>
          <span>seguimientos</span>
        </div>
        <div>
          <strong>{weakProjects.length}</strong>
          <span>proyectos a vigilar</span>
        </div>
      </section>

      <section className="choice-grid">
        {studioLinks.map(([href, title, description]) => (
          <Link className="choice" href={href} key={href}>
            <strong>{title}</strong>
            <span>{description}</span>
          </Link>
        ))}
      </section>

      <section className="grid">
        <article className="panel large">
          <h2>Proveedores</h2>
          <div className="table-list">
            {data.suppliers.map((supplier) => (
              <div className="row" key={supplier.id}>
                <div>
                  <strong>{supplier.name}</strong>
                  <p className="muted">{supplier.category} · fiabilidad {supplier.reliability ?? 0}%</p>
                </div>
                <span>{supplier.notes}</span>
              </div>
            ))}
            {!data.suppliers.length ? <p className="muted">Aun no hay proveedores cargados.</p> : null}
          </div>
        </article>

        <article className="panel">
          <h2>Entrada rapida</h2>
          <div className="action-row">
            <Link className="button-link subtle" href="/new?type=supplier">+ Proveedor</Link>
            <Link className="button-link subtle" href="/new?type=template-upload">Subir plantilla</Link>
            <Link className="button-link subtle" href="/new?type=automation">Crear alerta</Link>
          </div>
        </article>
      </section>
    </>
  );
}
