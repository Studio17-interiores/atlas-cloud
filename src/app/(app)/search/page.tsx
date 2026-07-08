import Link from "next/link";
import { getStudio17Data } from "@/server/studio17-data";

type SearchPageProps = {
  searchParams?: {
    q?: string;
  };
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const q = (searchParams?.q ?? "").trim().toLowerCase();
  const data = await getStudio17Data();
  const records = [
    ...data.projects.map((item) => ({ type: "Proyecto", title: item.name, text: item.description ?? "", href: "/projects" })),
    ...data.clients.map((item) => ({ type: "Cliente", title: item.name, text: `${item.next_action ?? ""} ${item.sentiment ?? ""}`, href: "/clients" })),
    ...data.tasks.map((item) => ({ type: "Tarea", title: item.title, text: `Importancia ${item.importance}`, href: "/week" })),
    ...data.moneyMovements.map((item) => ({ type: "Dinero", title: item.title, text: `${item.status} ${item.amount}`, href: "/money" })),
    ...data.documents.map((item) => ({ type: "Documento", title: item.title, text: item.file_name ?? "", href: "/templates" })),
    ...data.templates.map((item) => ({ type: "Plantilla", title: item.title, text: item.notes ?? "", href: "/templates" })),
    ...data.suppliers.map((item) => ({ type: "Proveedor", title: item.name, text: item.notes ?? "", href: "/studio" }))
  ];
  const results = q
    ? records.filter((record) => `${record.type} ${record.title} ${record.text}`.toLowerCase().includes(q))
    : records.slice(0, 12);

  return (
    <>
      <section className="hero">
        <p>Buscar</p>
        <h1>Encuentra cualquier cosa</h1>
        <p>Omar, Axis, contrato, cobro, arquitecto, plantilla o proveedor.</p>
      </section>

      <form className="search-form" action="/search">
        <input name="q" placeholder="Buscar en ATLAS..." defaultValue={searchParams?.q ?? ""} />
        <button type="submit">Buscar</button>
      </form>

      <section className="grid">
        <article className="panel full">
          <h2>{q ? `${results.length} resultado(s)` : "Ultimos registros"}</h2>
          <div className="table-list">
            {results.map((result) => (
              <Link className="row row-link" href={result.href} key={`${result.type}-${result.title}`}>
                <div>
                  <strong>{result.title}</strong>
                  <p className="muted">{result.type} · {result.text || "Sin detalle"}</p>
                </div>
                <span>Ver</span>
              </Link>
            ))}
          </div>
        </article>
      </section>
    </>
  );
}
