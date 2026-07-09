import Link from "next/link";
import { formatEuro, getStudio17Data } from "@/server/studio17-data";

const phaseLabels: Record<string, string> = {
  lead: "Lead",
  concept: "Concepto",
  budget: "Presupuesto",
  design: "Diseno",
  worksite: "Obra",
  delivery: "Entrega",
  closed: "Cerrado"
};

export default async function ProjectsPage() {
  const data = await getStudio17Data();

  return (
    <>
      <section className="hero">
        <p>Proyectos</p>
        <h1>Axis y Garridos ya viven en ATLAS</h1>
        <p>Vista corta: fase, salud, honorarios y proxima decision. Lo justo para situarte rapido.</p>
      </section>

      <section className="grid">
        {data.projects.map((project) => {
          const projectTasks = data.tasks.filter((task) => task.project_id === project.id && !task.done);
          const projectDecisions = data.decisions.filter((decision) => decision.project_id === project.id);
          const projectMoney = data.moneyMovements.filter((movement) => movement.project_id === project.id);
          const pending = projectMoney
            .filter((movement) => movement.status === "pending")
            .reduce((total, movement) => total + Number(movement.amount), 0);

          return (
            <article className="panel large" key={project.id}>
              <div className="panel-header">
                <div>
                  <p className="eyebrow">{phaseLabels[project.phase] ?? project.phase}</p>
                  <h2>{project.name}</h2>
                </div>
                <strong>{project.health}%</strong>
              </div>
              <div className="bar">
                <span style={{ width: `${project.health}%` }} />
              </div>
              <p>{project.description}</p>
              <div className="facts">
                <span>Presupuesto {formatEuro(Number(project.budget))}</span>
                <span>Honorarios {formatEuro(Number(project.fee))}</span>
                <span>Cobrado {project.fee_paid_percent}%</span>
                <span>Pendiente {formatEuro(pending)}</span>
              </div>
              <h3>Ahora mismo</h3>
              <div className="table-list">
                {projectTasks.slice(0, 2).map((task) => (
                  <div className="row" key={task.id}>
                    <div>
                      <strong>{task.title}</strong>
                      <p className="muted">Tarea pendiente</p>
                    </div>
                    <form action="/api/update" method="post">
                      <input type="hidden" name="entity" value="task" />
                      <input type="hidden" name="id" value={task.id} />
                      <input type="hidden" name="done" value="true" />
                      <input type="hidden" name="redirect" value="/projects" />
                      <button type="submit">Hecho</button>
                    </form>
                  </div>
                ))}
                {projectDecisions.slice(0, 1).map((decision) => (
                  <div className="row" key={decision.id}>
                    <div>
                      <strong>{decision.title}</strong>
                      <p className="muted">Decision pendiente</p>
                    </div>
                    <form action="/api/convert/decision-task" method="post">
                      <input type="hidden" name="decision_id" value={decision.id} />
                      <input type="hidden" name="project_id" value={project.id} />
                      <input type="hidden" name="title" value={decision.title} />
                      <input type="hidden" name="redirect" value="/projects" />
                      <button className="subtle" type="submit">Crear tarea</button>
                    </form>
                  </div>
                ))}
                {!projectTasks.length && !projectDecisions.length ? <p className="muted">Sin bloqueos importantes registrados.</p> : null}
              </div>
              <div className="action-row">
                <Link className="button-link subtle" href={`/projects/${project.id}`}>Abrir ficha</Link>
                <Link className="button-link subtle" href="/new?type=task">+ Tarea</Link>
                <Link className="button-link subtle" href="/new?type=document-upload">Subir documento</Link>
              </div>
              <details className="edit-box">
                <summary>Editar rapido</summary>
                <form action="/api/update" method="post" className="quick-form">
                  <input type="hidden" name="entity" value="project" />
                  <input type="hidden" name="id" value={project.id} />
                  <input type="hidden" name="redirect" value="/projects" />
                  <select name="phase" defaultValue={project.phase}>
                    <option value="concept">Concepto</option>
                    <option value="budget">Presupuesto</option>
                    <option value="design">Diseno</option>
                    <option value="worksite">Obra</option>
                    <option value="delivery">Entrega</option>
                    <option value="closed">Cerrado</option>
                  </select>
                  <input name="health" type="number" min="0" max="100" defaultValue={project.health} />
                  <input name="budget" type="number" defaultValue={Number(project.budget)} />
                  <input name="fee" type="number" defaultValue={Number(project.fee)} />
                  <input name="fee_paid_percent" type="number" min="0" max="100" defaultValue={project.fee_paid_percent} />
                  <button type="submit">Guardar cambios</button>
                </form>
              </details>
            </article>
          );
        })}

        {!data.projects.length ? (
          <article className="panel large">
            <h2>Aun no hay proyectos</h2>
            <p>Ve a Sistema y crea Studio 17 con los datos iniciales.</p>
          </article>
        ) : null}
      </section>
    </>
  );
}
