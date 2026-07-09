import Link from "next/link";
import { getStudio17Data } from "@/server/studio17-data";

const contentIdeas = [
  ["Antes/despues", "Axis: de local en bruto a centro de fisioterapia y pilates", "Reel"],
  ["Proceso", "Como ordenar una obra antes de elegir materiales", "Stories"],
  ["Educativo", "3 errores al convertir una vivienda en dos viviendas", "Post"],
  ["Autoridad", "Que reviso antes de una entrega final", "Reel"],
  ["SEO", "Interiorismo comercial para centros de fisioterapia", "Articulo"]
] as const;

const weeklyPlan = [
  ["Lunes", "Idea + guion corto"],
  ["Miercoles", "Stories de proceso real"],
  ["Viernes", "Reel o antes/despues"],
  ["Domingo", "Revisar leads entrantes"]
] as const;

export default async function MarketingPage() {
  const data = await getStudio17Data();
  const leads = data.clients.filter((client) => client.type === "lead");
  const projectsWithContent = data.projects.filter((project) => project.phase === "worksite" || project.health < 80);
  const marketingTasks = data.tasks.filter((task) => task.area === "marketing" && !task.done);

  return (
    <>
      <section className="hero compact-hero">
        <p>Marketing</p>
        <h1>Captacion sin improvisar</h1>
        <p>Ideas, redes, SEO y contenido de obra convertidos en tareas reales.</p>
        <Link className="button-link" href="/new?type=client">+ Lead</Link>
      </section>

      <section className="grid">
        <article className="panel">
          <p className="eyebrow">Leads registrados</p>
          <h2>{leads.length}</h2>
          <p className="muted">Instagram, web, recomendacion o contacto directo.</p>
        </article>

        <article className="panel">
          <p className="eyebrow">Tareas marketing</p>
          <h2>{marketingTasks.length}</h2>
          <p className="muted">Pendientes ahora mismo.</p>
        </article>

        <article className="panel large">
          <h2>Ideas de contenido</h2>
          <div className="table-list">
            {contentIdeas.map(([category, title, channel]) => (
              <div className="row" key={title}>
                <div>
                  <strong>{title}</strong>
                  <p className="muted">{category} · {channel}</p>
                </div>
                <CreateMarketingTask title={`Marketing: ${title}`} />
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <h2>Calendario de publicaciones</h2>
          <ul className="clean-list">
            {weeklyPlan.map(([day, action]) => (
              <li key={day}><strong>{day}:</strong> {action}</li>
            ))}
          </ul>
        </article>

        <article className="panel large">
          <h2>Contenido que hay que grabar en obra</h2>
          <div className="table-list">
            {projectsWithContent.map((project) => (
              <div className="row" key={project.id}>
                <div>
                  <strong>{project.name}</strong>
                  <p className="muted">Proceso, decisiones, antes/despues, materiales y problemas resueltos.</p>
                </div>
                <div className="action-row tight">
                  <Link className="button-link subtle" href={`/projects/${project.id}`}>Ver proyecto</Link>
                  <CreateMarketingTask title={`Grabar contenido de obra: ${project.name}`} projectId={project.id} />
                </div>
              </div>
            ))}
            {!projectsWithContent.length ? <p className="muted">Cuando haya obra activa, ATLAS sugerira contenido de proceso.</p> : null}
          </div>
        </article>

        <article className="panel full">
          <h2>Tareas de marketing abiertas</h2>
          <div className="table-list">
            {marketingTasks.map((task) => (
              <div className="row" key={task.id}>
                <div>
                  <strong>{task.title}</strong>
                  <p className="muted">Importancia {task.importance}/10</p>
                </div>
                <form action="/api/update" method="post">
                  <input type="hidden" name="entity" value="task" />
                  <input type="hidden" name="id" value={task.id} />
                  <input type="hidden" name="done" value="true" />
                  <input type="hidden" name="redirect" value="/marketing" />
                  <button type="submit">Hecho</button>
                </form>
              </div>
            ))}
            {!marketingTasks.length ? <p className="muted">No hay tareas de marketing abiertas.</p> : null}
          </div>
        </article>
      </section>
    </>
  );
}

function CreateMarketingTask({ title, projectId = "" }: { title: string; projectId?: string }) {
  return (
    <form action="/api/create" method="post">
      <input type="hidden" name="entity" value="task" />
      <input type="hidden" name="project_id" value={projectId} />
      <input type="hidden" name="title" value={title} />
      <input type="hidden" name="area" value="marketing" />
      <input type="hidden" name="importance" value="7" />
      <input type="hidden" name="redirect" value="/marketing" />
      <button className="subtle" type="submit">Crear tarea</button>
    </form>
  );
}
