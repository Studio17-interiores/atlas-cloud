import { formatEuro, getStudio17Data } from "@/server/studio17-data";

export default async function ClientsPage() {
  const data = await getStudio17Data();

  return (
    <>
      <section className="hero">
        <p>Clientes</p>
        <h1>Relaciones que no se pueden enfriar</h1>
        <p>Clientes activos, valor estimado y siguiente gesto claro.</p>
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
          </article>
        ))}
      </section>
    </>
  );
}
