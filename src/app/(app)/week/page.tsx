import Link from "next/link";
import { formatEuro, getStudio17Data } from "@/server/studio17-data";

const weekDays = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes"];

export default async function WeekPage() {
  const data = await getStudio17Data();
  const openTasks = data.tasks.filter((task) => !task.done);
  const topTasks = openTasks.slice(0, 7);
  const datedTasks = openTasks.filter((task) => task.due_date);
  const pendingMoney = data.moneyMovements
    .filter((movement) => movement.status === "pending")
    .reduce((total, movement) => total + Number(movement.amount), 0);
  const weakestProject = [...data.projects].sort((a, b) => a.health - b.health)[0];

  return (
    <>
      <section className="hero compact-hero">
        <p>Semana</p>
        <h1>Plan semanal sin ruido</h1>
        <p>La semana no es una lista infinita. Es cerrar lo que sostiene el estudio.</p>
        <div className="action-row">
          <Link className="button-link" href="/new?type=task">+ Tarea</Link>
          <Link className="button-link subtle" href="/calendar">Ver calendario</Link>
        </div>
      </section>

      <section className="grid">
        <article className="panel">
          <p className="eyebrow">Proyecto a vigilar</p>
          <h2>{weakestProject?.name ?? "Sin datos"}</h2>
          <p className="muted">{weakestProject ? `${weakestProject.health}% de salud` : "No hay proyectos activos."}</p>
        </article>
        <article className="panel">
          <p className="eyebrow">Dinero pendiente</p>
          <h2>{formatEuro(pendingMoney)}</h2>
          <Link className="button-link subtle" href="/money">Resolver dinero</Link>
        </article>
        <article className="panel">
          <p className="eyebrow">Tareas abiertas</p>
          <h2>{openTasks.length}</h2>
          <p className="muted">{datedTasks.length} tienen fecha.</p>
        </article>

        <article className="panel large">
          <h2>Top operativo</h2>
          <div className="table-list">
            {topTasks.map((task) => {
              const project = data.projects.find((item) => item.id === task.project_id);
              return (
                <div className="row" key={task.id}>
                  <div>
                    <strong>{task.title}</strong>
                    <p className="muted">{project?.name ?? "Studio 17"} · importancia {task.importance}/10{task.due_date ? ` · ${task.due_date}` : ""}</p>
                  </div>
                  <div className="action-row tight">
                    <TaskDone id={task.id} />
                    <Link className="button-link subtle" href={`/new?type=task&project=${task.project_id ?? ""}`}>Duplicar con fecha</Link>
                  </div>
                </div>
              );
            })}
            {!topTasks.length ? <p className="muted">No hay tareas abiertas.</p> : null}
          </div>
        </article>

        <article className="panel">
          <h2>Bloqueo de foco</h2>
          <p>No abras frentes nuevos hasta cerrar una tarea de proyecto, un seguimiento comercial y un movimiento de dinero.</p>
        </article>

        <article className="panel full">
          <h2>Plantilla de semana</h2>
          <div className="week-board">
            {weekDays.map((day, index) => (
              <div className="week-day" key={day}>
                <strong>{day}</strong>
                <p>{topTasks[index]?.title ?? "Dejar hueco para imprevistos"}</p>
                <Link href={`/new?type=task&date=${nextWeekDay(index)}`}>+ tarea aqui</Link>
              </div>
            ))}
          </div>
        </article>
      </section>
    </>
  );
}

function TaskDone({ id }: { id: string }) {
  return (
    <form action="/api/update" method="post">
      <input type="hidden" name="entity" value="task" />
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="done" value="true" />
      <input type="hidden" name="redirect" value="/week" />
      <button type="submit">Hecho</button>
    </form>
  );
}

function nextWeekDay(index: number) {
  const date = new Date();
  const current = (date.getDay() + 6) % 7;
  const diff = index - current;
  date.setDate(date.getDate() + diff);
  return date.toISOString().slice(0, 10);
}
