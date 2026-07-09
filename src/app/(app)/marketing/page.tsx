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

  return (
    <>
      <section className="hero">
        <p>Marketing</p>
        <h1>Captacion sin improvisar</h1>
        <p>Ideas, calendario, SEO y contenido de obra para que Studio 17 no dependa solo del boca a boca.</p>
      </section>

      <section className="grid">
        <article className="panel large">
          <h2>Ideas de contenido</h2>
          <div className="table-list">
            {contentIdeas.map(([category, title, channel]) => (
              <div className="row" key={title}>
                <div>
                  <strong>{title}</strong>
                  <p className="muted">{category} · {channel}</p>
                </div>
                <Link className="button-link subtle" href={`/new?type=task`}>Crear tarea</Link>
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

        <article className="panel">
          <h2>Leads Instagram / web</h2>
          <p>{leads.length} leads registrados.</p>
          <Link className="button-link subtle" href="/new?type=client">Anadir lead</Link>
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
                <Link className="button-link subtle" href={`/projects/${project.id}`}>Ver proyecto</Link>
              </div>
            ))}
            {!projectsWithContent.length ? <p className="muted">Cuando haya obra activa, ATLAS sugerira contenido de proceso.</p> : null}
          </div>
        </article>

        <article className="panel">
          <h2>SEO</h2>
          <p>Prioridad: paginas o articulos sobre interiorismo comercial, reformas integrales y viviendas transformadas.</p>
        </article>

        <article className="panel">
          <h2>Campanas</h2>
          <p>Antes de invertir, mide: lead, origen, presupuesto enviado y conversion. ATLAS ya puede registrar esos datos en Clientes.</p>
        </article>
      </section>
    </>
  );
}
