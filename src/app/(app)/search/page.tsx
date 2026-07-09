import Link from "next/link";
import { formatEuro, getStudio17Data } from "@/server/studio17-data";

type SearchPageProps = {
  searchParams?: {
    q?: string;
  };
};

type Result =
  | { kind: "project"; id: string; title: string; text: string; href: string }
  | { kind: "client"; id: string; title: string; text: string; href: string; status: string }
  | { kind: "task"; id: string; title: string; text: string; href: string; done: boolean }
  | { kind: "money"; id: string; title: string; text: string; href: string; amount: number; type: string; category?: string | null; status: string }
  | { kind: "document"; id: string; title: string; text: string; href: string; storage_path?: string | null }
  | { kind: "template"; id: string; title: string; text: string; href: string; storage_path?: string | null }
  | { kind: "supplier"; id: string; title: string; text: string; href: string };

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const q = (searchParams?.q ?? "").trim().toLowerCase();
  const data = await getStudio17Data();
  const records: Result[] = [
    ...data.projects.map((item) => ({ kind: "project" as const, id: item.id, title: item.name, text: item.description ?? "", href: `/projects/${item.id}` })),
    ...data.clients.map((item) => ({ kind: "client" as const, id: item.id, title: item.name, text: `${item.next_action ?? ""} ${item.sentiment ?? ""}`, href: "/clients", status: item.status })),
    ...data.tasks.map((item) => ({ kind: "task" as const, id: item.id, title: item.title, text: `Importancia ${item.importance}${item.due_date ? ` · ${item.due_date}` : ""}`, href: item.project_id ? `/projects/${item.project_id}` : "/" , done: item.done })),
    ...data.moneyMovements.map((item) => ({ kind: "money" as const, id: item.id, title: item.title, text: `${item.status} · ${formatEuro(Number(item.amount))}`, href: item.project_id ? `/projects/${item.project_id}` : "/money", amount: Number(item.amount), type: item.type, category: item.category, status: item.status })),
    ...data.documents.map((item) => ({ kind: "document" as const, id: item.id, title: item.title, text: `${item.type} · ${item.file_name ?? "sin archivo"}`, href: item.project_id ? `/projects/${item.project_id}` : "/templates", storage_path: item.storage_path })),
    ...data.templates.map((item) => ({ kind: "template" as const, id: item.id, title: item.title, text: `${item.type} · ${item.notes ?? ""}`, href: "/templates", storage_path: item.storage_path })),
    ...data.suppliers.map((item) => ({ kind: "supplier" as const, id: item.id, title: item.name, text: `${item.category ?? ""} ${item.notes ?? ""}`, href: "/studio" }))
  ];
  const results = q
    ? records.filter((record) => `${record.kind} ${record.title} ${record.text}`.toLowerCase().includes(q))
    : records.slice(0, 16);

  return (
    <>
      <section className="hero compact-hero">
        <p>Buscar</p>
        <h1>Encuentra y actua</h1>
        <p>Busca Omar, Axis, contrato, cobro, arquitecto, plantilla o proveedor. Si se puede resolver, ATLAS te deja hacerlo aqui.</p>
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
              <div className="row" key={`${result.kind}-${result.id}`}>
                <Link className="row-link" href={result.href}>
                  <strong>{result.title}</strong>
                  <p className="muted">{label(result.kind)} · {result.text || "Sin detalle"}</p>
                </Link>
                <ResultActions result={result} />
              </div>
            ))}
            {!results.length ? <p className="muted">No he encontrado nada con esa busqueda.</p> : null}
          </div>
        </article>
      </section>
    </>
  );
}

function ResultActions({ result }: { result: Result }) {
  if (result.kind === "task" && !result.done) {
    return (
      <form action="/api/update" method="post">
        <input type="hidden" name="entity" value="task" />
        <input type="hidden" name="id" value={result.id} />
        <input type="hidden" name="done" value="true" />
        <input type="hidden" name="redirect" value="/search" />
        <button type="submit">Hecho</button>
      </form>
    );
  }

  if (result.kind === "money" && result.status !== "paid") {
    return (
      <form action="/api/update" method="post">
        <input type="hidden" name="entity" value="money" />
        <input type="hidden" name="id" value={result.id} />
        <input type="hidden" name="title" value={result.title} />
        <input type="hidden" name="amount" value={result.amount} />
        <input type="hidden" name="type" value={result.type} />
        <input type="hidden" name="category" value={result.category ?? ""} />
        <input type="hidden" name="status" value="paid" />
        <input type="hidden" name="redirect" value="/search" />
        <button className="subtle" type="submit">Pagado</button>
      </form>
    );
  }

  if ((result.kind === "document" || result.kind === "template") && result.storage_path) {
    return <a className="button-link subtle" href={`/api/download?path=${encodeURIComponent(result.storage_path)}`}>Descargar</a>;
  }

  return <Link className="button-link subtle" href={result.href}>Abrir</Link>;
}

function label(kind: Result["kind"]) {
  const labels: Record<Result["kind"], string> = {
    project: "Proyecto",
    client: "Cliente",
    task: "Tarea",
    money: "Dinero",
    document: "Documento",
    template: "Plantilla",
    supplier: "Proveedor"
  };

  return labels[kind];
}
