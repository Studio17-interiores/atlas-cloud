import Link from "next/link";
import { formatEuro, getStudio17Data } from "@/server/studio17-data";

export default async function ReportsPage() {
  const data = await getStudio17Data();
  const openTasks = data.tasks.filter((task) => !task.done);
  const pendingMoney = data.moneyMovements.filter((movement) => movement.status === "pending");
  const paidMoney = data.moneyMovements
    .filter((movement) => movement.status === "paid")
    .reduce((total, movement) => total + Number(movement.amount), 0);
  const pendingTotal = pendingMoney.reduce((total, movement) => total + Number(movement.amount), 0);
  const weakestProject = [...data.projects].sort((a, b) => a.health - b.health)[0];
  const warmClients = data.clients.filter((client) => client.next_action);
  const missingContracts = data.projects.filter((project) => !data.documents.some((document) => document.project_id === project.id && document.type === "contract"));

  const weeklyText = [
    "INFORME SEMANAL STUDIO 17",
    "",
    `Proyectos activos: ${data.projects.length}`,
    `Tareas abiertas: ${openTasks.length}`,
    `Dinero pendiente: ${formatEuro(pendingTotal)}`,
    `Cobrado/pagado registrado: ${formatEuro(paidMoney)}`,
    `Decisiones abiertas: ${data.decisions.length}`,
    "",
    `Proyecto que mas atencion necesita: ${weakestProject?.name ?? "sin datos"} (${weakestProject?.health ?? 0}%)`,
    `Clientes a seguir: ${warmClients.map((client) => client.name).join(", ") || "ninguno"}`,
    `Contratos faltantes: ${missingContracts.map((project) => project.name).join(", ") || "ninguno"}`,
    "",
    "Top tareas:",
    ...openTasks.slice(0, 5).map((task, index) => `${index + 1}. ${task.title}`)
  ].join("\n");

  return (
    <>
      <section className="hero compact-hero">
        <p>Informe</p>
        <h1>Resumen semanal Studio 17</h1>
        <p>Una lectura ejecutiva: que va bien, que hay que apretar y que no puede olvidarse.</p>
        <div className="action-row">
          <a className="button-link" href="/api/export">Exportar JSON</a>
          <Link className="button-link subtle" href="/assistant?mode=plan">Crear plan de accion</Link>
        </div>
      </section>

      <section className="grid">
        <article className="panel">
          <p className="eyebrow">Tareas abiertas</p>
          <h2>{openTasks.length}</h2>
          <p className="muted">Las 5 primeras aparecen abajo.</p>
        </article>
        <article className="panel">
          <p className="eyebrow">Dinero pendiente</p>
          <h2>{formatEuro(pendingTotal)}</h2>
          <p className="muted">Cobros o pagos no cerrados.</p>
        </article>
        <article className="panel">
          <p className="eyebrow">Proyecto a vigilar</p>
          <h2>{weakestProject?.name ?? "Sin datos"}</h2>
          <p className="muted">{weakestProject ? `${weakestProject.health}% de salud` : "No hay proyectos cargados."}</p>
        </article>

        <article className="panel large">
          <h2>Lectura ejecutiva</h2>
          <ul className="clean-list">
            <li>Dinero registrado como cerrado: {formatEuro(paidMoney)}.</li>
            <li>Decisiones abiertas: {data.decisions.length}.</li>
            <li>Clientes con seguimiento pendiente: {warmClients.length}.</li>
            <li>Proyectos sin contrato asociado: {missingContracts.length}.</li>
          </ul>
        </article>

        <article className="panel">
          <h2>Esta semana hay que apretar</h2>
          <ul className="clean-list">
            {openTasks.slice(0, 5).map((task) => (
              <li key={task.id}>{task.title}</li>
            ))}
            {!openTasks.length ? <li>No hay tareas abiertas.</li> : null}
          </ul>
        </article>

        <article className="panel full">
          <h2>Informe listo para copiar</h2>
          <textarea className="report-copy" readOnly defaultValue={weeklyText} />
        </article>
      </section>
    </>
  );
}
