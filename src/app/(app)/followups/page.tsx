import { getStudio17Data } from "@/server/studio17-data";

export default async function FollowupsPage() {
  const data = await getStudio17Data();
  const pendingMoney = data.moneyMovements.filter((movement) => movement.status === "pending");
  const openDecisions = data.decisions.filter((decision) => decision.status === "open");

  return (
    <>
      <section className="hero">
        <p>Seguimientos</p>
        <h1>A quien escribir sin pensarlo</h1>
        <p>Mensajes y recordatorios que evitan que algo se quede flotando.</p>
      </section>
      <section className="grid">
        <article className="panel large">
          <h2>Clientes</h2>
          <ul className="clean-list">
            {data.clients.map((client) => (
              <li key={client.id}><strong>{client.name}:</strong> {client.next_action}</li>
            ))}
          </ul>
        </article>
        <article className="panel">
          <h2>Cobros</h2>
          <ul className="clean-list">
            {pendingMoney.map((movement) => (
              <li key={movement.id}>{movement.title}</li>
            ))}
            {!pendingMoney.length ? <li>No hay cobros pendientes.</li> : null}
          </ul>
        </article>
        <article className="panel full">
          <h2>Decisiones abiertas</h2>
          <ul className="clean-list">
            {openDecisions.map((decision) => (
              <li key={decision.id}><strong>{decision.title}</strong> · {decision.impact}</li>
            ))}
          </ul>
        </article>
      </section>
    </>
  );
}
