import { getStudio17Data } from "@/server/studio17-data";

export default async function CalendarPage() {
  const data = await getStudio17Data();
  const items = [
    ...data.meetings.map((meeting) => ({ title: meeting.title, type: "Reunion", date: meeting.meeting_at, project_id: meeting.project_id })),
    ...data.moneyMovements
      .filter((movement) => movement.status === "pending")
      .map((movement) => ({ title: movement.title, type: "Cobro pendiente", date: "", project_id: movement.project_id })),
    ...data.decisions.map((decision) => ({ title: decision.title, type: "Decision", date: "", project_id: decision.project_id }))
  ];

  return (
    <>
      <section className="hero">
        <p>Calendario</p>
        <h1>Agenda operativa</h1>
        <p>Reuniones, cobros y decisiones en una sola vista simple.</p>
      </section>
      <section className="grid">
        <article className="panel full">
          <h2>Proximos hitos</h2>
          <div className="table-list">
            {items.map((item) => {
              const project = data.projects.find((projectItem) => projectItem.id === item.project_id);
              return (
                <div className="row" key={`${item.type}-${item.title}`}>
                  <div>
                    <strong>{item.title}</strong>
                    <p className="muted">{item.type} · {project?.name ?? "Studio 17"}</p>
                  </div>
                  <span>{item.date ? new Date(item.date).toLocaleDateString("es-ES") : "Sin fecha"}</span>
                </div>
              );
            })}
          </div>
        </article>
      </section>
    </>
  );
}
