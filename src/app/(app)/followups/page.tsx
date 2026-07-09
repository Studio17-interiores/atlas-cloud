import Link from "next/link";
import { formatEuro, getStudio17Data } from "@/server/studio17-data";

export default async function FollowupsPage() {
  const data = await getStudio17Data();
  const clients = data.clients.filter((client) => client.next_action);
  const pendingMoney = data.moneyMovements.filter((movement) => movement.status === "pending");
  const openDecisions = data.decisions.filter((decision) => decision.status === "open");

  return (
    <>
      <section className="hero compact-hero">
        <p>Seguimientos</p>
        <h1>A quien escribir sin pensarlo</h1>
        <p>Una bandeja de pendientes humanos: clientes, cobros y decisiones que no deben enfriarse.</p>
        <Link className="button-link" href="/new?type=client">+ Lead / cliente</Link>
      </section>
      <section className="grid">
        <article className="panel large">
          <h2>Clientes a mover</h2>
          <div className="table-list">
            {clients.map((client) => (
              <div className="row" key={client.id}>
                <div>
                  <strong>{client.name}</strong>
                  <p className="muted">{client.next_action}</p>
                </div>
                <div className="action-row tight">
                  <form action="/api/update" method="post">
                    <input type="hidden" name="entity" value="client" />
                    <input type="hidden" name="id" value={client.id} />
                    <input type="hidden" name="action" value="followed_up" />
                    <input type="hidden" name="status" value={client.status} />
                    <input type="hidden" name="redirect" value="/followups" />
                    <button type="submit">Seguimiento hecho</button>
                  </form>
                  <Link className="button-link subtle" href="/new?type=task">Crear tarea</Link>
                </div>
              </div>
            ))}
            {!clients.length ? <p className="muted">No hay clientes con seguimiento pendiente.</p> : null}
          </div>
        </article>

        <article className="panel">
          <h2>Cobros y pagos</h2>
          <div className="table-list">
            {pendingMoney.map((movement) => (
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
                  <input type="hidden" name="redirect" value="/followups" />
                  <button className="subtle" type="submit">Pagado</button>
                </form>
              </div>
            ))}
            {!pendingMoney.length ? <p className="muted">No hay cobros pendientes.</p> : null}
          </div>
        </article>

        <article className="panel full">
          <h2>Decisiones abiertas</h2>
          <div className="table-list">
            {openDecisions.map((decision) => {
              const project = data.projects.find((item) => item.id === decision.project_id);
              return (
                <div className="row" key={decision.id}>
                  <div>
                    <strong>{decision.title}</strong>
                    <p className="muted">{project?.name ?? "Studio 17"} · {decision.impact}</p>
                  </div>
                  <div className="action-row tight">
                    <form action="/api/convert/decision-task" method="post">
                      <input type="hidden" name="decision_id" value={decision.id} />
                      <input type="hidden" name="project_id" value={decision.project_id ?? ""} />
                      <input type="hidden" name="title" value={decision.title} />
                      <input type="hidden" name="redirect" value="/followups" />
                      <button className="subtle" type="submit">Convertir en tarea</button>
                    </form>
                    <form action="/api/update" method="post">
                      <input type="hidden" name="entity" value="decision" />
                      <input type="hidden" name="id" value={decision.id} />
                      <input type="hidden" name="status" value="closed" />
                      <input type="hidden" name="project_id" value={decision.project_id ?? ""} />
                      <input type="hidden" name="redirect" value="/followups" />
                      <button className="subtle" type="submit">Cerrar</button>
                    </form>
                  </div>
                </div>
              );
            })}
            {!openDecisions.length ? <p className="muted">No hay decisiones abiertas.</p> : null}
          </div>
        </article>
      </section>
    </>
  );
}
