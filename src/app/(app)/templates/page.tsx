import Link from "next/link";
import { getStudio17Data } from "@/server/studio17-data";

export default async function TemplatesPage() {
  const data = await getStudio17Data();

  return (
    <>
      <section className="hero compact-hero">
        <p>Documentos</p>
        <h1>Plantillas y archivos importantes</h1>
        <p>Contratos, presupuestos, fotos, facturas, briefs, checklists y SOPs con estado claro.</p>
        <div className="action-row">
          <Link className="button-link" href="/new?type=document-upload">Subir documento</Link>
          <Link className="button-link subtle" href="/new?type=template-upload">Subir plantilla</Link>
        </div>
      </section>

      <section className="grid">
        <article className="panel full">
          <h2>Documentos de proyectos</h2>
          <div className="table-list">
            {data.documents.map((document) => {
              const project = data.projects.find((item) => item.id === document.project_id);
              return (
                <div className="row" key={document.id}>
                  <div>
                    <strong>{document.title}</strong>
                    <p className="muted">{project?.name ?? "Sin proyecto"} · {document.type} · {document.status} · {document.file_name ?? "sin archivo"}</p>
                  </div>
                  <div className="action-row tight">
                    {document.storage_path ? <a className="button-link subtle" href={`/api/download?path=${encodeURIComponent(document.storage_path)}`}>Descargar</a> : null}
                    <form action="/api/update" method="post">
                      <input type="hidden" name="entity" value="document" />
                      <input type="hidden" name="id" value={document.id} />
                      <input type="hidden" name="title" value={document.title} />
                      <input type="hidden" name="type" value={document.type} />
                      <input type="hidden" name="redirect" value="/templates" />
                      <select name="status" defaultValue={document.status}>
                        <option value="pending">Pendiente</option>
                        <option value="reviewed">Revisado</option>
                        <option value="signed">Firmado</option>
                        <option value="sent">Enviado</option>
                        <option value="uploaded">Subido</option>
                      </select>
                      <button className="subtle" type="submit">Estado</button>
                    </form>
                    <form action="/api/delete" method="post">
                      <input type="hidden" name="entity" value="document" />
                      <input type="hidden" name="id" value={document.id} />
                      <input type="hidden" name="storage_path" value={document.storage_path ?? ""} />
                      <input type="hidden" name="redirect" value="/templates" />
                      <button className="danger" type="submit">Borrar</button>
                    </form>
                  </div>
                </div>
              );
            })}
            {!data.documents.length ? <p className="muted">Todavia no hay documentos de proyecto.</p> : null}
          </div>
        </article>

        <article className="panel full">
          <h2>Plantillas reutilizables</h2>
          <div className="table-list">
            {data.templates.map((template) => (
              <div className="row" key={template.id}>
                <div>
                  <strong>{template.title}</strong>
                  <p className="muted">{template.type} · {template.notes ?? "sin notas"} · {template.file_name ?? "sin archivo"}</p>
                </div>
                <div className="action-row tight">
                  {template.storage_path ? <a className="button-link subtle" href={`/api/download?path=${encodeURIComponent(String(template.storage_path))}`}>Descargar</a> : null}
                  <details className="edit-box small-edit">
                    <summary>Editar</summary>
                    <form action="/api/update" method="post" className="quick-form">
                      <input type="hidden" name="entity" value="template" />
                      <input type="hidden" name="id" value={template.id} />
                      <input type="hidden" name="redirect" value="/templates" />
                      <input name="title" defaultValue={template.title} />
                      <input name="type" defaultValue={template.type} />
                      <textarea name="notes" defaultValue={template.notes ?? ""} />
                      <button type="submit">Guardar</button>
                    </form>
                  </details>
                  <form action="/api/delete" method="post">
                    <input type="hidden" name="entity" value="template" />
                    <input type="hidden" name="id" value={template.id} />
                    <input type="hidden" name="storage_path" value={template.storage_path ?? ""} />
                    <input type="hidden" name="redirect" value="/templates" />
                    <button className="danger" type="submit">Borrar</button>
                  </form>
                </div>
              </div>
            ))}
            {!data.templates.length ? <p className="muted">Todavia no hay plantillas.</p> : null}
          </div>
        </article>
      </section>
    </>
  );
}
