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
              <ul className="clean-list">
                {projectTasks.slice(0, 2).map((task) => (
                  <li key={task.id}>{task.title}</li>
                ))}
                {projectDecisions.slice(0, 1).map((decision) => (
                  <li key={decision.id}>{decision.title}</li>
                ))}
                {!projectTasks.length && !projectDecisions.length ? <li>Sin bloqueos importantes registrados.</li> : null}
              </ul>
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
