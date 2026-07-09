import Link from "next/link";
import { formatEuro, getStudio17Data } from "@/server/studio17-data";

export default async function ClientsPage() {
  const data = await getStudio17Data();

  return (
    <>
      <section className="hero compact-hero">
        <p>Clientes</p>
        <h1>Relaciones vivas, no una base de datos</h1>
        <p>Solo importa una cosa: quien necesita seguimiento y que tienes que hacer.</p>
        <Link className="button-link" href="/new?type=client">+ Cliente / lead</Link>
      </section>
      <section className="grid">
        {data.clients.map((client) => (
          <article className="panel large" key={client.id}>
            <div className="panel-header">
              <div>
                <p className="eyebrow">{client.type} · {client.status}</p>
                <h2>{client.name}</h2>
              </div>
              <strong>{formatEuro(Number(client.estimated_value))}</strong>
            </div>
            <p>{client.sentiment}</p>
            <div className="callout">
              <strong>Siguiente accion</strong>
              <p>{client.next_action ?? "Definir proximo seguimiento."}</p>
            </div>
            <details className="edit-box">
              <summary>Editar cliente</summary>
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
                <button type="submit">Guardar cambios</button>
              </form>
            </details>
          </article>
        ))}
        {!data.clients.length ? (
          <article className="panel large">
            <h2>Aun no hay clientes</h2>
            <p>Crea el primero desde + Nuevo.</p>
          </article>
        ) : null}
      </section>
    </>
  );
}
