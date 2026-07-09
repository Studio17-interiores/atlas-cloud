import Link from "next/link";
import { formatEuro, getStudio17Data } from "@/server/studio17-data";

const lanes = [
  ["lead", "Leads"],
  ["active", "Activos"],
  ["warm", "Templados"],
  ["won", "Ganados"],
  ["lost", "Perdidos"]
] as const;

export default async function ClientsPage() {
  const data = await getStudio17Data();
  const pipelineValue = data.clients
    .filter((client) => client.status !== "lost")
    .reduce((total, client) => total + Number(client.estimated_value), 0);
  const followups = data.clients.filter((client) => client.next_action);

  return (
    <>
      <section className="hero compact-hero">
        <p>Clientes</p>
        <h1>Pipeline comercial de Studio 17</h1>
        <p>Quien entra, quien esta caliente, quien hay que mover y quien puede convertirse en proyecto.</p>
        <div className="action-row">
          <Link className="button-link" href="/new?type=client">+ Cliente / lead</Link>
          <Link className="button-link subtle" href="/followups">Seguimientos</Link>
        </div>
      </section>

      <section className="metric-strip">
        <div>
          <strong>{data.clients.length}</strong>
          <span>contactos</span>
        </div>
        <div>
          <strong>{followups.length}</strong>
          <span>seguimientos</span>
        </div>
        <div>
          <strong>{formatEuro(pipelineValue)}</strong>
          <span>valor potencial</span>
        </div>
        <div>
          <strong>{data.clients.filter((client) => client.status === "won").length}</strong>
          <span>ganados</span>
        </div>
      </section>

      <section className="pipeline-board">
        {lanes.map(([status, title]) => {
          const clients = status === "lead"
            ? data.clients.filter((client) => client.type === "lead" && client.status === "active")
            : data.clients.filter((client) => client.status === status);

          return (
            <article className="pipeline-lane" key={status}>
              <h2>{title}</h2>
              <div className="table-list">
                {clients.map((client) => (
                  <div className="pipeline-card" key={client.id}>
                    <div className="panel-header">
                      <div>
                        <strong>{client.name}</strong>
                        <p className="muted">{client.sentiment || "Sin contexto"}</p>
                      </div>
                      <span>{formatEuro(Number(client.estimated_value))}</span>
                    </div>
                    <p className="muted">{client.next_action || "Sin siguiente accion"}</p>
                    <div className="action-row tight">
                      {client.next_action ? <FollowupDone id={client.id} status={client.status} /> : null}
                      <ClientStatus id={client.id} client={client} status="warm" label="Templar" />
                      <ClientStatus id={client.id} client={client} status="won" label="Ganado" />
                      <ClientStatus id={client.id} client={client} status="lost" label="Perdido" />
                    </div>
                    <div className="action-row tight">
                      <form action="/api/convert/client-project" method="post">
                        <input type="hidden" name="client_id" value={client.id} />
                        <input type="hidden" name="client_name" value={client.name} />
                        <input type="hidden" name="estimated_value" value={client.estimated_value} />
                        <input type="hidden" name="redirect" value="/clients" />
                        <button className="subtle" type="submit">Crear proyecto</button>
                      </form>
                      <Link className="button-link subtle" href="/new?type=task">Tarea</Link>
                    </div>
                    <details className="edit-box">
                      <summary>Editar</summary>
                      <form action="/api/update" method="post" className="quick-form">
                        <input type="hidden" name="entity" value="client" />
                        <input type="hidden" name="id" value={client.id} />
                        <input type="hidden" name="redirect" value="/clients" />
                        <input name="name" defaultValue={client.name} />
                        <input name="estimated_value" type="number" defaultValue={client.estimated_value} />
                        <input name="next_action" defaultValue={client.next_action ?? ""} placeholder="Siguiente accion" />
                        <textarea name="sentiment" defaultValue={client.sentiment ?? ""} placeholder="Contexto" />
                        <select name="status" defaultValue={client.status}>
                          <option value="active">Activo</option>
                          <option value="warm">Templado</option>
                          <option value="cold">Frio</option>
                          <option value="won">Ganado</option>
                          <option value="lost">Perdido</option>
                        </select>
                        <button type="submit">Guardar</button>
                      </form>
                    </details>
                  </div>
                ))}
                {!clients.length ? <p className="muted">Sin contactos aqui.</p> : null}
              </div>
            </article>
          );
        })}
      </section>
    </>
  );
}

function FollowupDone({ id, status }: { id: string; status: string }) {
  return (
    <form action="/api/update" method="post">
      <input type="hidden" name="entity" value="client" />
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="action" value="followed_up" />
      <input type="hidden" name="status" value={status} />
      <input type="hidden" name="redirect" value="/clients" />
      <button type="submit">Seguimiento hecho</button>
    </form>
  );
}

function ClientStatus({
  id,
  client,
  status,
  label
}: {
  id: string;
  client: { name: string; estimated_value: number; next_action: string | null; sentiment: string | null };
  status: string;
  label: string;
}) {
  return (
    <form action="/api/update" method="post">
      <input type="hidden" name="entity" value="client" />
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="name" value={client.name} />
      <input type="hidden" name="estimated_value" value={client.estimated_value} />
      <input type="hidden" name="next_action" value={client.next_action ?? ""} />
      <input type="hidden" name="sentiment" value={client.sentiment ?? ""} />
      <input type="hidden" name="status" value={status} />
      <input type="hidden" name="redirect" value="/clients" />
      <button className="subtle" type="submit">{label}</button>
    </form>
  );
}
