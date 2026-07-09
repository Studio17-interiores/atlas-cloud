import Link from "next/link";
import { getTodayBrief } from "@/server/brief";
import { formatEuro, getStudio17Data } from "@/server/studio17-data";

export default async function TodayPage() {
  const [brief, data] = await Promise.all([getTodayBrief(), getStudio17Data()]);
  const openTasks = data.tasks.filter((task) => !task.done);
  const topTasks = openTasks.slice(0, 3);
  const restTasks = openTasks.slice(3);
  const pendingMoney = data.moneyMovements.filter((movement) => movement.status === "pending");
  const blockedDecisions = data.decisions.slice(0, 4);
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
            {topTasks.map((task) => (
              <TaskRow key={task.id} task={task} projects={data.projects} featured />
            ))}
            {!topTasks.length ? <p className="muted">No hay tareas abiertas. Crea una prioridad real para hoy.</p> : null}
          </div>
        </article>

        <article className="panel">
          <p className="eyebrow">Dinero pendiente</p>
          <h2>{formatEuro(pendingTotal)}</h2>
          <div className="table-list mini-list">
            {pendingMoney.slice(0, 3).map((movement) => (
              <div className="row" key={movement.id}>
                <div>
                  <strong>{movement.title}</strong>
                  <p className="muted">{formatEuro(Number(movement.amount))}</p>
                </div>
                <MarkMoneyPaid movement={movement} />
              </div>
            ))}
            {!pendingMoney.length ? <p className="muted">Sin dinero pendiente.</p> : null}
          </div>
        </article>

        <article className="panel">
          <p className="eyebrow">Clientes que no se pueden enfriar</p>
          <ul className="clean-list">
            {coldClients.map((client) => (
              <li key={client.id}>
                <strong>{client.name}:</strong> {client.next_action}
                <form action="/api/update" method="post" className="inline-action">
                  <input type="hidden" name="entity" value="client" />
                  <input type="hidden" name="id" value={client.id} />
                  <input type="hidden" name="action" value="followed_up" />
                  <input type="hidden" name="status" value={client.status} />
                  <input type="hidden" name="redirect" value="/" />
                  <button className="subtle tiny-button" type="submit">Hecho</button>
                </form>
              </li>
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
                  <div className="action-row tight">
                    <form action="/api/convert/decision-task" method="post">
                      <input type="hidden" name="decision_id" value={decision.id} />
                      <input type="hidden" name="project_id" value={decision.project_id ?? ""} />
                      <input type="hidden" name="title" value={decision.title} />
                      <input type="hidden" name="redirect" value="/" />
                      <button className="subtle" type="submit">Convertir en tarea</button>
                    </form>
                    <form action="/api/update" method="post">
                      <input type="hidden" name="entity" value="decision" />
                      <input type="hidden" name="id" value={decision.id} />
                      <input type="hidden" name="status" value="closed" />
                      <input type="hidden" name="redirect" value="/" />
                      <button className="subtle" type="submit">Cerrar</button>
                    </form>
                  </div>
                </div>
              );
            })}
            {!blockedDecisions.length ? <p className="muted">No hay decisiones bloqueadas.</p> : null}
          </div>
        </article>

        <article className="panel full">
          <details>
            <summary className="section-summary">Ver y editar todas las tareas abiertas ({openTasks.length})</summary>
            <div className="table-list">
              {restTasks.map((task) => (
                <TaskRow key={task.id} task={task} projects={data.projects} />
              ))}
              {!restTasks.length ? <p className="muted">No hay mas tareas abiertas.</p> : null}
            </div>
          </details>
        </article>
      </section>
    </>
  );
}

type Task = {
  id: string;
  title: string;
  importance: number;
  project_id: string | null;
  area?: string | null;
  due_date?: string | null;
};

function TaskRow({ task, projects, featured = false }: { task: Task; projects: Array<{ id: string; name: string }>; featured?: boolean }) {
  const project = projects.find((item) => item.id === task.project_id);

  return (
    <div className={featured ? "row featured-row" : "row"}>
      <div>
        <strong>{task.title}</strong>
        <p className="muted">{project?.name ?? "Studio 17"} · importancia {task.importance}/10{task.due_date ? ` · ${task.due_date}` : ""}</p>
      </div>
      <div className="action-row tight">
        <TaskButton id={task.id} done />
        <TaskButton id={task.id} postpone />
        <form action="/api/delete" method="post">
          <input type="hidden" name="entity" value="task" />
          <input type="hidden" name="id" value={task.id} />
          <input type="hidden" name="redirect" value="/" />
          <button className="danger" type="submit">Borrar</button>
        </form>
      </div>
      <details className="edit-box full-details">
        <summary>Editar tarea</summary>
        <form action="/api/update" method="post" className="quick-form inline-form">
          <input type="hidden" name="entity" value="task" />
          <input type="hidden" name="id" value={task.id} />
          <input type="hidden" name="redirect" value="/" />
          <input name="title" defaultValue={task.title} />
          <input name="area" defaultValue={task.area ?? ""} placeholder="Area" />
          <input name="importance" type="number" min="1" max="10" defaultValue={task.importance} />
          <input name="due_date" type="date" defaultValue={task.due_date ?? ""} />
          <input type="hidden" name="done" value="false" />
          <button type="submit">Guardar</button>
        </form>
      </details>
    </div>
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

function MarkMoneyPaid({ movement }: { movement: { id: string; title: string; amount: number; type: string; category?: string | null } }) {
  return (
    <form action="/api/update" method="post">
      <input type="hidden" name="entity" value="money" />
      <input type="hidden" name="id" value={movement.id} />
      <input type="hidden" name="title" value={movement.title} />
      <input type="hidden" name="amount" value={movement.amount} />
      <input type="hidden" name="type" value={movement.type} />
      <input type="hidden" name="category" value={movement.category ?? ""} />
      <input type="hidden" name="status" value="paid" />
      <input type="hidden" name="redirect" value="/" />
      <button className="subtle" type="submit">Pagado</button>
    </form>
  );
}
