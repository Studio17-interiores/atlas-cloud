import Link from "next/link";
import { formatEuro, getStudio17Data } from "@/server/studio17-data";

export default async function ReviewPage() {
  const data = await getStudio17Data();
  const projectCards = data.projects.map((project) => {
    const documents = data.documents.filter((document) => document.project_id === project.id);
    const tasks = data.tasks.filter((task) => task.project_id === project.id && !task.done);
    const decisions = data.decisions.filter((decision) => decision.project_id === project.id);
    const money = data.moneyMovements.filter((movement) => movement.project_id === project.id && movement.status === "pending");
    const hasContract = documents.some((document) => document.type === "contract");
    const hasBudget = documents.some((document) => document.type === "budget");
    const pendingMoney = money.reduce((total, movement) => total + Number(movement.amount), 0);
    const issues = [
      !hasContract ? "Falta contrato" : "",
      !hasBudget ? "Falta presupuesto" : "",
      tasks.length ? `${tasks.length} tarea(s) abierta(s)` : "",
      decisions.length ? `${decisions.length} decision(es)` : "",
      pendingMoney ? `${formatEuro(pendingMoney)} pendiente` : "",
      project.health < 70 ? "Salud baja" : ""
    ].filter(Boolean);

    return {
      project,
      documents,
      tasks,
      decisions,
      money,
      pendingMoney,
      issues,
      score: Math.max(0, 100 - issues.length * 15)
    };
  });

  const globalTasks = data.tasks.filter((task) => !task.done && !task.project_id);
  const clients = data.clients.filter((client) => client.next_action);

  return (
    <>
      <section className="hero compact-hero">
        <p>Revision</p>
        <h1>Que puede escaparse ahora mismo</h1>
        <p>Una auditoria rapida para cerrar huecos antes de que se conviertan en problemas.</p>
        <div className="action-row">
          <Link className="button-link" href="/">Volver a Hoy</Link>
          <Link className="button-link subtle" href="/reports">Informe semanal</Link>
        </div>
      </section>

      <section className="grid">
        {projectCards.map(({ project, tasks, decisions, money, pendingMoney, issues, score }) => (
          <article className="panel large" key={project.id}>
            <div className="panel-header">
              <div>
                <p className="eyebrow">Proyecto</p>
                <h2>{project.name}</h2>
              </div>
              <strong>{score}%</strong>
            </div>
            <div className="bar">
              <span style={{ width: `${score}%` }} />
            </div>
            <p className="muted">{issues.length ? issues.join(" · ") : "Sin huecos importantes detectados."}</p>
            <div className="review-actions">
              {!issues.includes("Falta contrato") ? null : (
                <Link className="button-link subtle" href={`/new?type=document-upload&project=${project.id}`}>Subir contrato</Link>
              )}
              {!issues.includes("Falta presupuesto") ? null : (
                <Link className="button-link subtle" href={`/new?type=document-upload&project=${project.id}`}>Subir presupuesto</Link>
              )}
              <Link className="button-link subtle" href={`/new?type=task&project=${project.id}`}>+ Tarea</Link>
              <Link className="button-link subtle" href={`/projects/${project.id}`}>Abrir ficha</Link>
            </div>

            <details className="edit-box">
              <summary>Resolver desde aqui</summary>
              <div className="table-list">
                {tasks.slice(0, 3).map((task) => (
                  <div className="row" key={task.id}>
                    <div>
                      <strong>{task.title}</strong>
                      <p className="muted">Tarea abierta</p>
                    </div>
                    <form action="/api/update" method="post">
                      <input type="hidden" name="entity" value="task" />
                      <input type="hidden" name="id" value={task.id} />
                      <input type="hidden" name="done" value="true" />
                      <input type="hidden" name="project_id" value={project.id} />
                      <input type="hidden" name="redirect" value="/review" />
                      <button type="submit">Hecho</button>
                    </form>
                  </div>
                ))}
                {decisions.slice(0, 2).map((decision) => (
                  <div className="row" key={decision.id}>
                    <div>
                      <strong>{decision.title}</strong>
                      <p className="muted">Decision pendiente</p>
                    </div>
                    <form action="/api/convert/decision-task" method="post">
                      <input type="hidden" name="decision_id" value={decision.id} />
                      <input type="hidden" name="project_id" value={project.id} />
                      <input type="hidden" name="title" value={decision.title} />
                      <input type="hidden" name="redirect" value="/review" />
                      <button className="subtle" type="submit">Convertir</button>
                    </form>
                  </div>
                ))}
                {money.slice(0, 2).map((movement) => (
                  <div className="row" key={movement.id}>
                    <div>
                      <strong>{movement.title}</strong>
                      <p className="muted">{formatEuro(Number(movement.amount))}</p>
                    </div>
                    <form action="/api/update" method="post">
                      <input type="hidden" name="entity" value="money" />
                      <input type="hidden" name="id" value={movement.id} />
                      <input type="hidden" name="title" value={movement.title} />
                      <input type="hidden" name="amount" value={movement.amount} />
                      <input type="hidden" name="type" value={movement.type} />
                      <input type="hidden" name="category" value={movement.category ?? ""} />
                      <input type="hidden" name="status" value="paid" />
                      <input type="hidden" name="project_id" value={project.id} />
                      <input type="hidden" name="redirect" value="/review" />
                      <button className="subtle" type="submit">Pagado</button>
                    </form>
                  </div>
                ))}
                {!tasks.length && !decisions.length && !pendingMoney ? <p className="muted">Nada urgente que resolver aqui.</p> : null}
              </div>
            </details>
          </article>
        ))}

        <article className="panel">
          <h2>Sin proyecto</h2>
          <div className="table-list">
            {globalTasks.slice(0, 5).map((task) => (
              <div className="row" key={task.id}>
                <div>
                  <strong>{task.title}</strong>
                  <p className="muted">Tarea general</p>
                </div>
                <form action="/api/update" method="post">
                  <input type="hidden" name="entity" value="task" />
                  <input type="hidden" name="id" value={task.id} />
                  <input type="hidden" name="done" value="true" />
                  <input type="hidden" name="redirect" value="/review" />
                  <button type="submit">Hecho</button>
                </form>
              </div>
            ))}
            {!globalTasks.length ? <p className="muted">No hay tareas generales abiertas.</p> : null}
          </div>
        </article>

        <article className="panel">
          <h2>Clientes calientes</h2>
          <div className="table-list">
            {clients.slice(0, 5).map((client) => (
              <div className="row" key={client.id}>
                <div>
                  <strong>{client.name}</strong>
                  <p className="muted">{client.next_action}</p>
                </div>
                <form action="/api/update" method="post">
                  <input type="hidden" name="entity" value="client" />
                  <input type="hidden" name="id" value={client.id} />
                  <input type="hidden" name="action" value="followed_up" />
                  <input type="hidden" name="status" value={client.status} />
                  <input type="hidden" name="redirect" value="/review" />
                  <button className="subtle" type="submit">Hecho</button>
                </form>
              </div>
            ))}
            {!clients.length ? <p className="muted">Sin clientes pendientes de seguimiento.</p> : null}
          </div>
        </article>
      </section>
    </>
  );
}
