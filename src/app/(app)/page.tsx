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
          <p className="eyebrow">Hoy manda esto</p>
          <h2>{brief.firstAction}</h2>
          {topTasks[0] ? (
            <div className="action-row">
              <DoneTaskForm id={topTasks[0].id} label="Marcar como hecho" />
              <PostponeTaskForm id={topTasks[0].id} />
              <Link className="button-link subtle" href="/new?type=task">Convertir en tarea</Link>
            </div>
          ) : (
            <Link className="button-link" href="/new?type=task">Crear primera tarea</Link>
          )}
        </article>

        <article className="panel">
          <p className="eyebrow">Dinero pendiente</p>
          <h2>{formatEuro(pendingMoney)}</h2>
          <p className="muted">Cobros, pagos o gastos que ATLAS no debe dejar escapar.</p>
          <Link className="button-link subtle" href="/money">Ver dinero</Link>
        </article>

        <article className="panel">
          <p className="eyebrow">Hay que apretar</p>
          <h2>{weakestProject?.name ?? "Sin proyecto critico"}</h2>
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
                  <div className="action-row tight">
                    <DoneTaskForm id={task.id} label="Hecho" />
                    <PostponeTaskForm id={task.id} />
                  </div>
                </div>
              );
            })}
            {!topTasks.length ? <p className="muted">No hay tareas abiertas. Buen momento para definir una prioridad real.</p> : null}
          </div>
        </article>

        <article className="panel">
          <h2>No olvides</h2>
          <p>{brief.watch}</p>
        </article>

        <article className="panel">
          <h2>Clientes que no se pueden enfriar</h2>
          <ul className="clean-list">
            {coldClients.map((client) => (
              <li key={client.id}><strong>{client.name}:</strong> {client.next_action}</li>
            ))}
            {!coldClients.length ? <li>No hay seguimientos urgentes.</li> : null}
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
                  <form action="/api/convert/decision-task" method="post">
                    <input type="hidden" name="decision_id" value={decision.id} />
                    <input type="hidden" name="project_id" value={decision.project_id ?? ""} />
                    <input type="hidden" name="title" value={decision.title} />
                    <input type="hidden" name="redirect" value="/" />
                    <button className="subtle" type="submit">Convertir en tarea</button>
                  </form>
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

function DoneTaskForm({ id, label }: { id: string; label: string }) {
  return (
    <form action="/api/update" method="post">
      <input type="hidden" name="entity" value="task" />
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="done" value="true" />
      <input type="hidden" name="redirect" value="/" />
      <button type="submit">{label}</button>
    </form>
  );
}

function PostponeTaskForm({ id }: { id: string }) {
  return (
    <form action="/api/update" method="post">
      <input type="hidden" name="entity" value="task" />
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="action" value="postpone" />
      <input type="hidden" name="redirect" value="/" />
      <button className="subtle" type="submit">Posponer</button>
    </form>
  );
}
