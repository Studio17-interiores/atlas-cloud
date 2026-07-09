import Link from "next/link";
import { formatEuro, getStudio17Data } from "@/server/studio17-data";

const rules = [
  ["Reunion manana", "Si hay reunion manana, preparar objetivo y checklist."],
  ["Contrato faltante", "Si falta contrato, el proyecto no deberia considerarse sano."],
  ["Cobro pendiente", "Si hay dinero pendiente, aparece como alerta operativa."],
  ["Cliente con seguimiento", "Si un cliente tiene siguiente accion, no se puede enfriar."],
  ["Entrega cercana", "Si una tarea tiene fecha, aparece en Calendario y Semana."],
  ["Proyecto bajo de salud", "Si la salud baja, pasa a vigilancia."]
] as const;

export default async function AutomationsPage() {
  const data = await getStudio17Data();
  const pendingMoney = data.moneyMovements.filter((movement) => movement.status === "pending");
  const projectsWithoutContract = data.projects.filter((project) => !data.documents.some((document) => document.project_id === project.id && document.type === "contract"));
  const weakProjects = data.projects.filter((project) => project.health < 70);
  const warmClients = data.clients.filter((client) => client.next_action);
  const datedTasks = data.tasks.filter((task) => !task.done && task.due_date);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowDate = tomorrow.toISOString().slice(0, 10);
  const meetingsTomorrow = data.meetings.filter((meeting) => meeting.meeting_at.slice(0, 10) === tomorrowDate);

  const detected = [
    ...pendingMoney.map((movement) => ({
      title: `Dinero pendiente: ${movement.title}`,
      body: formatEuro(Number(movement.amount)),
      href: "/money"
    })),
    ...projectsWithoutContract.map((project) => ({
      title: `Falta contrato: ${project.name}`,
      body: "Sube contrato o marca documento equivalente.",
      href: `/projects/${project.id}`
    })),
    ...weakProjects.map((project) => ({
      title: `Proyecto bajo de salud: ${project.name}`,
      body: `${project.health}% de salud`,
      href: `/projects/${project.id}`
    })),
    ...warmClients.map((client) => ({
      title: `Seguimiento cliente: ${client.name}`,
      body: client.next_action ?? "",
      href: "/clients"
    })),
    ...meetingsTomorrow.map((meeting) => ({
      title: `Reunion manana: ${meeting.title}`,
      body: "Prepara objetivo, dudas y siguiente paso.",
      href: "/calendar"
    })),
    ...datedTasks.slice(0, 5).map((task) => ({
      title: `Tarea con fecha: ${task.title}`,
      body: task.due_date ?? "",
      href: "/calendar"
    }))
  ];

  return (
    <>
      <section className="hero compact-hero">
        <p>Automatizaciones</p>
        <h1>Alertas que evitan olvidos</h1>
        <p>ATLAS revisa reglas simples y te muestra lo que necesita accion.</p>
        <Link className="button-link" href="/new?type=automation">Crear regla</Link>
      </section>

      <section className="grid">
        <article className="panel large">
          <h2>Detectado ahora</h2>
          <div className="table-list">
            {detected.map((item) => (
              <Link className="row row-link" href={item.href} key={`${item.title}-${item.body}`}>
                <div>
                  <strong>{item.title}</strong>
                  <p className="muted">{item.body}</p>
                </div>
                <span className="pill">Abrir</span>
              </Link>
            ))}
            {!detected.length ? <p className="muted">No hay alertas operativas ahora mismo.</p> : null}
          </div>
        </article>

        <article className="panel">
          <h2>Reglas base</h2>
          <ul className="clean-list">
            {rules.map(([title, body]) => (
              <li key={title}><strong>{title}:</strong> {body}</li>
            ))}
          </ul>
        </article>

        <article className="panel full">
          <h2>Reglas personalizadas</h2>
          <div className="table-list">
            {data.automations.map((automation) => (
              <div className="row" key={automation.id}>
                <div>
                  <strong>{automation.name}</strong>
                  <p className="muted">{automation.rule_type}</p>
                </div>
                <span className="pill">{automation.enabled ? "Activa" : "Pausada"}</span>
              </div>
            ))}
            {!data.automations.length ? <p className="muted">No hay reglas personalizadas todavia.</p> : null}
          </div>
        </article>
      </section>
    </>
  );
}
