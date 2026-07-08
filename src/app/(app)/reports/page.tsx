import { formatEuro, getStudio17Data } from "@/server/studio17-data";

export default async function ReportsPage() {
  const data = await getStudio17Data();
  const openTasks = data.tasks.filter((task) => !task.done);
  const pendingMoney = data.moneyMovements
    .filter((movement) => movement.status === "pending")
    .reduce((total, movement) => total + Number(movement.amount), 0);
  const paidMoney = data.moneyMovements
    .filter((movement) => movement.status === "paid")
    .reduce((total, movement) => total + Number(movement.amount), 0);

  return (
    <>
      <section className="hero">
        <p>Informe</p>
        <h1>Resumen semanal Studio 17</h1>
        <p>Una version exportable y legible de como va el estudio.</p>
      </section>

      <section className="grid">
        <article className="panel">
          <p className="eyebrow">Proyectos</p>
          <h2>{data.projects.length}</h2>
          <p className="muted">Activos en ATLAS.</p>
        </article>
        <article className="panel">
          <p className="eyebrow">Tareas abiertas</p>
          <h2>{openTasks.length}</h2>
          <p className="muted">Ordenadas por importancia.</p>
        </article>
        <article className="panel">
          <p className="eyebrow">Pendiente</p>
          <h2>{formatEuro(pendingMoney)}</h2>
          <p className="muted">Cobros o pagos no cerrados.</p>
        </article>

        <article className="panel large">
          <h2>Lectura ejecutiva</h2>
          <ul className="clean-list">
            <li>💸 Cobrado registrado: {formatEuro(paidMoney)}.</li>
            <li>📌 Decisiones abiertas: {data.decisions.length}.</li>
            <li>🎯 Objetivos activos: {data.goals.length}.</li>
            <li>📎 Documentos registrados: {data.documents.length}.</li>
          </ul>
        </article>
        <article className="panel">
          <h2>Backup</h2>
          <p>Descarga una copia JSON de ATLAS Cloud.</p>
          <a className="button-link" href="/api/export">Exportar datos</a>
        </article>
      </section>
    </>
  );
}
