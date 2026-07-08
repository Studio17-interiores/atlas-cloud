import { getStudio17Data } from "@/server/studio17-data";

export default async function WeekPage() {
  const data = await getStudio17Data();
  const topTasks = data.tasks.filter((task) => !task.done).slice(0, 5);

  return (
    <>
      <section className="hero">
        <p>Semana</p>
        <h1>Si solo haces 5 cosas</h1>
        <p>La semana se ordena por impacto, no por ruido.</p>
      </section>
      <section className="grid">
        <article className="panel large">
          <h2>Top 5 operativo</h2>
          <ul className="clean-list">
            {topTasks.map((task) => {
              const project = data.projects.find((item) => item.id === task.project_id);
              return <li key={task.id}><strong>{task.importance}/10</strong> · {task.title} {project ? `(${project.name})` : ""}</li>;
            })}
          </ul>
        </article>
        <article className="panel">
          <h2>No abrir mas</h2>
          <p>Esta semana ATLAS prioriza cerrar Axis y ordenar Garridos antes de sumar nuevos frentes.</p>
        </article>
      </section>
    </>
  );
}
