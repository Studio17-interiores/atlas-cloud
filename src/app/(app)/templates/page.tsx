import { getStudio17Data } from "@/server/studio17-data";

export default async function TemplatesPage() {
  const data = await getStudio17Data();

  return (
    <>
      <section className="hero">
        <p>Plantillas</p>
        <h1>Documentos reutilizables</h1>
        <p>Contratos, presupuestos, briefs, checklists y SOPs preparados para subir archivos reales.</p>
      </section>
      <section className="grid">
        {data.templates.map((template) => (
          <article className="panel" key={template.id}>
            <p className="eyebrow">{template.type}</p>
            <h2>{template.title}</h2>
            <p>{template.notes}</p>
            <p className="muted">{template.file_name ?? "Pendiente de archivo"}</p>
            {"storage_path" in template && template.storage_path ? (
              <a className="button-link subtle" href={`/api/download?path=${encodeURIComponent(String(template.storage_path))}`}>Descargar</a>
            ) : null}
          </article>
        ))}
        {!data.templates.length ? (
          <article className="panel large">
            <h2>Aun no hay plantillas</h2>
            <p>Ejecuta el relleno completo de Studio 17 desde Sistema.</p>
          </article>
        ) : null}
      </section>
    </>
  );
}
