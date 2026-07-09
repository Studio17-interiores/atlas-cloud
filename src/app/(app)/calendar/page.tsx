import Link from "next/link";
import { getStudio17Data } from "@/server/studio17-data";

export default async function CalendarPage() {
  const data = await getStudio17Data();
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const monthName = today.toLocaleDateString("es-ES", { month: "long", year: "numeric" });
  const firstDay = new Date(year, month, 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = Array.from({ length: startOffset + daysInMonth }, (_, index) => {
    const day = index - startOffset + 1;
    return day > 0 ? day : null;
  });

  const meetings = data.meetings.map((meeting) => ({
    id: meeting.id,
    title: meeting.title,
    type: "Reunion",
    date: new Date(meeting.meeting_at),
    project_id: meeting.project_id
  }));

  const tasks = data.tasks
    .filter((task) => task.due_date && !task.done)
    .map((task) => ({
      id: task.id,
      title: task.title,
      type: "Tarea",
      date: new Date(`${task.due_date}T12:00:00`),
      project_id: task.project_id
    }));

  const floatingItems = [
    ...data.tasks
      .filter((task) => !task.done && !task.due_date)
      .map((task) => ({ id: task.id, title: task.title, type: "Tarea sin fecha", project_id: task.project_id })),
    ...data.moneyMovements
      .filter((movement) => movement.status === "pending")
      .map((movement) => ({ id: movement.id, title: movement.title, type: "Dinero pendiente", project_id: movement.project_id })),
    ...data.decisions.map((decision) => ({ id: decision.id, title: decision.title, type: "Decision", project_id: decision.project_id }))
  ];

  return (
    <>
      <section className="hero compact-hero">
        <p>Calendario</p>
        <h1>{monthName}</h1>
        <p>Reuniones y tareas con fecha. Cada dia debe dejar claro que toca y que puedes crear ahi mismo.</p>
      </section>

      <section className="grid">
        <article className="panel full">
          <div className="calendar-grid">
            {["L", "M", "X", "J", "V", "S", "D"].map((day) => (
              <div className="calendar-head" key={day}>{day}</div>
            ))}
            {cells.map((day, index) => {
              const dayDate = day ? toIsoDate(year, month, day) : "";
              const items = day
                ? [...meetings, ...tasks].filter((item) => item.date.getDate() === day && item.date.getMonth() === month)
                : [];
              return (
                <div className="calendar-cell" key={`${day ?? "blank"}-${index}`}>
                  {day ? (
                    <>
                      <div className="calendar-day-head">
                        <strong>{day}</strong>
                        <div className="calendar-actions">
                          <Link href={`/new?type=task&date=${dayDate}`}>+ tarea</Link>
                          <Link href={`/new?type=meeting&date=${dayDate}`}>+ reunion</Link>
                        </div>
                      </div>
                      {items.map((item) => {
                        const project = data.projects.find((projectItem) => projectItem.id === item.project_id);
                        return (
                          <div className="calendar-pill" key={`${item.type}-${item.id}`}>
                            <span>{item.type}: {item.title}</span>
                            <small>{project?.name ?? "Studio 17"}</small>
                            {item.type === "Tarea" ? (
                              <form action="/api/update" method="post">
                                <input type="hidden" name="entity" value="task" />
                                <input type="hidden" name="id" value={item.id} />
                                <input type="hidden" name="done" value="true" />
                                <input type="hidden" name="redirect" value="/calendar" />
                                <button className="tiny-button" type="submit">Hecho</button>
                              </form>
                            ) : null}
                          </div>
                        );
                      })}
                    </>
                  ) : null}
                </div>
              );
            })}
          </div>
        </article>

        <article className="panel full">
          <h2>Sin fecha, pero importantes</h2>
          <div className="table-list">
            {floatingItems.map((item) => {
              const project = data.projects.find((projectItem) => projectItem.id === item.project_id);
              return (
                <div className="row" key={`${item.type}-${item.id}`}>
                  <div>
                    <strong>{item.title}</strong>
                    <p className="muted">{item.type} · {project?.name ?? "Studio 17"}</p>
                  </div>
                  {item.type === "Tarea sin fecha" ? (
                    <Link className="button-link subtle" href={`/new?type=task&project=${item.project_id ?? ""}`}>Recrear con fecha</Link>
                  ) : (
                    <span className="pill">Sin fecha</span>
                  )}
                </div>
              );
            })}
            {!floatingItems.length ? <p className="muted">Nada sin fecha. Bien ordenado.</p> : null}
          </div>
        </article>
      </section>
    </>
  );
}

function toIsoDate(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}
