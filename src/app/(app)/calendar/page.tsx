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

  const datedItems = data.meetings.map((meeting) => ({
    title: meeting.title,
    type: "🤝 Reunion",
    date: new Date(meeting.meeting_at),
    project_id: meeting.project_id
  }));
  const floatingItems = [
    ...data.moneyMovements
      .filter((movement) => movement.status === "pending")
      .map((movement) => ({ title: movement.title, type: "💸 Cobro pendiente", project_id: movement.project_id })),
    ...data.decisions.map((decision) => ({ title: decision.title, type: "📌 Decision", project_id: decision.project_id }))
  ];

  return (
    <>
      <section className="hero">
        <p>Calendario</p>
        <h1>Calendario mensual</h1>
        <p>{monthName}. Reuniones, cobros y decisiones sin perder la cabeza.</p>
      </section>

      <section className="grid">
        <article className="panel full">
          <div className="calendar-grid">
            {["L", "M", "X", "J", "V", "S", "D"].map((day) => (
              <div className="calendar-head" key={day}>{day}</div>
            ))}
            {cells.map((day, index) => {
              const items = day
                ? datedItems.filter((item) => item.date.getDate() === day && item.date.getMonth() === month)
                : [];
              return (
                <div className="calendar-cell" key={`${day ?? "blank"}-${index}`}>
                  {day ? <strong>{day}</strong> : null}
                  {items.map((item) => {
                    const project = data.projects.find((projectItem) => projectItem.id === item.project_id);
                    return (
                      <span className="calendar-pill" key={item.title}>
                        {item.type}: {project?.name ?? item.title}
                      </span>
                    );
                  })}
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
                <div className="row" key={`${item.type}-${item.title}`}>
                  <div>
                    <strong>{item.title}</strong>
                    <p className="muted">{item.type} · {project?.name ?? "Studio 17"}</p>
                  </div>
                  <span>Sin fecha</span>
                </div>
              );
            })}
          </div>
        </article>
      </section>
    </>
  );
}
