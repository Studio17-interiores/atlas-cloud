import Link from "next/link";
import { getTodayBrief } from "@/server/brief";
import { formatEuro, getStudio17Data } from "@/server/studio17-data";

export default async function TodayPage() {
  const [brief, data] = await Promise.all([getTodayBrief(), getStudio17Data()]);
  const openTasks = data.tasks.filter((task) => !task.done);
  const topTasks = openTasks.slice(0, 3);
  const pendingMoney = data.moneyMovements
    .filter((movement) => movement.status === "pending")
    .reduce((total, movement) => total + Number(movement.amount), 0);
  const coldClients = data.clients.filter((client) => client.next_action).slice(0, 3);
  const blockedDecisions = data.decisions.slice(0, 3);
  const weakestProject = [...data.projects].sort((a, b) => a.health - b.health)[0];

  return (
    <>
      <section className="hero">
        <p>Revision de 5 minutos</p>
        <h1>{brief.title}</h1>
        <p>{brief.message}</p>
      </section>

      <section className="grid">
        <article className="panel large command-panel">
          <p className="eyebrow">✨ Haz esto primero</p>
          <h2>{brief.firstAction}</h2>
          {topTasks[0] ? (
            <form action="/api/update" method="post">
              <input type="hidden" name="entity" value="task" />
              <input type="hidden" name="id" value={topTasks[0].id} />
              <input type="hidden" name="done" value="true" />
              <input type="hidden" name="redirect" value="/" />
              <button type="submit">Marcar como hecho</button>
            </form>
          ) : null}
        </article>

        <article className="panel">
          <p className="eyebrow">💸 Dinero pendiente</p>
          <h2>{formatEuro(pendingMoney)}</h2>
          <p className="muted">Que ATLAS no debe dejar escapar.</p>
          <Link className="button-link subtle" href="/money">Ver dinero</Link>
        </article>

        <article className="panel">
          <p className="eyebrow">🔥 Hay que apretar</p>
          <h2>{weakestProject?.name ?? "Sin proyecto"}</h2>
          <p>{brief.growth}</p>
        </article>

        <article className="panel large">
          <h2>Si solo haces 3 cosas</h2>
          <div className="table-list">
            {topTasks.map((task) => {
              const project = data.projects.find((item) => item.id === task.project_id);
              return (
                <div className="row" key={task.id}>
                  <div>
                    <strong>{task.title}</strong>
                    <p className="muted">{project?.name ?? "Studio 17"} · importancia {task.importance}/10</p>
                  </div>
                  <form action="/api/update" method="post">
                    <input type="hidden" name="entity" value="task" />
                    <input type="hidden" name="id" value={task.id} />
                    <input type="hidden" name="done" value="true" />
                    <input type="hidden" name="redirect" value="/" />
                    <button type="submit">Hecho</button>
                  </form>
                </div>
              );
            })}
          </div>
        </article>

        <article className="panel">
          <h2>📌 No olvides</h2>
          <p>{brief.watch}</p>
        </article>

        <article className="panel">
          <h2>Clientes que no enfriar</h2>
          <ul className="clean-list">
            {coldClients.map((client) => (
              <li key={client.id}><strong>{client.name}:</strong> {client.next_action}</li>
            ))}
          </ul>
        </article>

        <article className="panel full">
          <h2>Decisiones bloqueadas</h2>
          <div className="table-list">
            {blockedDecisions.map((decision) => {
              const project = data.projects.find((item) => item.id === decision.project_id);
              return (
                <div className="row" key={decision.id}>
                  <div>
                    <strong>{decision.title}</strong>
                    <p className="muted">{project?.name ?? "Studio 17"} · {decision.impact}</p>
                  </div>
                  <Link className="button-link subtle" href={`/new?type=task`}>Crear tarea</Link>
                </div>
              );
            })}
            {!blockedDecisions.length ? <p className="muted">No hay decisiones abiertas.</p> : null}
          </div>
        </article>
      </section>
    </>
  );
}
