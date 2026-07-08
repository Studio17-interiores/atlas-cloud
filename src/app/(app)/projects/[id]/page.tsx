import Link from "next/link";
import { formatEuro, getStudio17Data } from "@/server/studio17-data";

type ProjectDetailPageProps = {
  params: {
    id: string;
  };
};

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const data = await getStudio17Data();
  const project = data.projects.find((item) => item.id === params.id);

  if (!project) {
    return (
      <article className="panel large">
        <h1>Proyecto no encontrado</h1>
        <Link href="/projects">Volver a proyectos</Link>
      </article>
    );
  }

  const tasks = data.tasks.filter((task) => task.project_id === project.id);
  const documents = data.documents.filter((document) => document.project_id === project.id);
  const money = data.moneyMovements.filter((movement) => movement.project_id === project.id);
  const decisions = data.decisions.filter((decision) => decision.project_id === project.id);
  const notes = data.notes.filter((note) => note.project_id === project.id);
  const pending = money.filter((movement) => movement.status === "pending").reduce((total, movement) => total + Number(movement.amount), 0);

  return (
    <>
      <section className="hero">
        <p>Proyecto</p>
        <h1>{project.name}</h1>
        <p>{project.description}</p>
      </section>

      <section className="grid">
        <article className="panel large">
          <div className="panel-header">
            <div>
              <p className="eyebrow">{project.phase}</p>
              <h2>Resumen ejecutivo</h2>
            </div>
            <strong>{project.health}%</strong>
          </div>
          <div className="bar"><span style={{ width: `${project.health}%` }} /></div>
          <div className="facts">
            <span>Presupuesto {formatEuro(Number(project.budget))}</span>
            <span>Honorarios {formatEuro(Number(project.fee))}</span>
            <span>Cobrado {project.fee_paid_percent}%</span>
            <span>Pendiente {formatEuro(pending)}</span>
          </div>
          <div className="action-row">
            <Link className="button-link" href={`/new?type=document-upload`}>Subir documento</Link>
            <Link className="button-link subtle" href={`/new?type=note`}>Anadir nota</Link>
            <Link className="button-link subtle" href={`/new?type=money`}>Anadir dinero</Link>
          </div>
        </article>

        <article className="panel">
          <h2>Riesgo ATLAS</h2>
          <p>{project.health < 70 ? "Hay que apretar. Revisa bloqueos, cobros y decisiones." : "Proyecto razonablemente controlado."}</p>
        </article>

        <article className="panel large">
          <h2>Tareas</h2>
          <div className="table-list">
            {tasks.map((task) => (
              <div className="row" key={task.id}>
                <div>
                  <strong>{task.done ? "Hecho: " : ""}{task.title}</strong>
                  <p className="muted">Importancia {task.importance}/10</p>
                </div>
                {!task.done ? (
                  <form action="/api/update" method="post">
                    <input type="hidden" name="entity" value="task" />
                    <input type="hidden" name="id" value={task.id} />
                    <input type="hidden" name="done" value="true" />
                    <input type="hidden" name="redirect" value={`/projects/${project.id}`} />
                    <button type="submit">Hecho</button>
                  </form>
                ) : null}
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <h2>Decisiones</h2>
          <ul className="clean-list">
            {decisions.map((decision) => (
              <li key={decision.id}>{decision.title}</li>
            ))}
          </ul>
        </article>

        <article className="panel full">
          <h2>Documentos</h2>
          <div className="table-list">
            {documents.map((document) => (
              <div className="row" key={document.id}>
                <div>
                  <strong>{document.title}</strong>
                  <p className="muted">{document.type} · {document.status} · {document.file_name ?? "sin archivo"}</p>
                </div>
                {document.storage_path ? <a className="button-link subtle" href={`/api/download?path=${encodeURIComponent(document.storage_path)}`}>Descargar</a> : null}
              </div>
            ))}
            {!documents.length ? <p className="muted">Todavia no hay documentos.</p> : null}
          </div>
        </article>

        <article className="panel large">
          <h2>Dinero</h2>
          <div className="table-list">
            {money.map((movement) => (
              <div className="row" key={movement.id}>
                <div>
                  <strong>{movement.title}</strong>
                  <p className="muted">{movement.type} · {movement.status}</p>
                </div>
                <strong>{formatEuro(Number(movement.amount))}</strong>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <h2>Notas</h2>
          <ul className="clean-list">
            {notes.slice(0, 5).map((note) => (
              <li key={note.id}>{note.body}</li>
            ))}
          </ul>
        </article>
      </section>
    </>
  );
}
