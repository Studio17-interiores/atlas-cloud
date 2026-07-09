import Link from "next/link";
import { getTodayBrief } from "@/server/brief";
import { formatEuro, getStudio17Data } from "@/server/studio17-data";

export default async function TodayPage() {
  const [brief, data] = await Promise.all([getTodayBrief(), getStudio17Data()]);
  const openTasks = data.tasks.filter((task) => !task.done);
  const topTasks = openTasks.slice(0, 3);
  const pendingMoney = data.moneyMovements.filter((movement) => movement.status === "pending");
  const blockedDecisions = data.decisions.slice(0, 3);
  const coldClients = data.clients.filter((client) => client.next_action).slice(0, 2);
  const pendingTotal = pendingMoney.reduce((total, movement) => total + Number(movement.amount), 0);

  return (
    <>
      <section className="hero compact-hero">
        <p>Revision de 5 minutos</p>
        <h1>{brief.firstAction}</h1>
        <p>{brief.message}</p>
        <div className="action-row">
          <Link className="button-link" href="/new?type=task">+ Tarea</Link>
          <Link className="button-link subtle" href="/new?type=money">+ Gasto / cobro</Link>
          <Link className="button-link subtle" href="/new?type=document-upload">Subir archivo</Link>
        </div>
      </section>

      <section className="grid">
        <article className="panel large command-panel">
          <p className="eyebrow">Si solo haces 3 cosas</p>
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
                    <TaskButton id={task.id} done />
                    <TaskButton id={task.id} postpone />
                  </div>
                </div>
              );
            })}
            {!topTasks.length ? <p className="muted">No hay tareas abiertas. Crea una prioridad real para hoy.</p> : null}
          </div>
        </article>

        <article className="panel">
          <p className="eyebrow">No olvides</p>
          <h2>{formatEuro(pendingTotal)}</h2>
          <p className="muted">Dinero pendiente.</p>
          <Link className="button-link subtle" href="/money">Resolver dinero</Link>
        </article>

        <article className="panel">
          <p className="eyebrow">Clientes que no se pueden enfriar</p>
          <ul className="clean-list">
            {coldClients.map((client) => (
              <li key={client.id}><strong>{client.name}:</strong> {client.next_action}</li>
            ))}
            {!coldClients.length ? <li>Sin seguimientos urgentes.</li> : null}
          </ul>
          <Link className="button-link subtle" href="/clients">Ver clientes</Link>
        </article>

        <article className="panel full">
          <p className="eyebrow">Decisiones bloqueadas</p>
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
            {!blockedDecisions.length ? <p className="muted">No hay decisiones bloqueadas.</p> : null}
          </div>
        </article>
      </section>
    </>
  );
}

function TaskButton({ id, done, postpone }: { id: string; done?: boolean; postpone?: boolean }) {
  return (
    <form action="/api/update" method="post">
      <input type="hidden" name="entity" value="task" />
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="redirect" value="/" />
      {done ? <input type="hidden" name="done" value="true" /> : null}
      {postpone ? <input type="hidden" name="action" value="postpone" /> : null}
      <button className={postpone ? "subtle" : ""} type="submit">{postpone ? "Posponer" : "Hecho"}</button>
    </form>
  );
}
