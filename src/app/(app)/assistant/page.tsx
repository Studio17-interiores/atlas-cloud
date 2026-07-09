import Link from "next/link";
import { getAtlasAiReview } from "@/server/ai-review";
import { getStudio17Data } from "@/server/studio17-data";

const actions = [
  ["studio", "Revisar Studio 17", "Lectura general de hoy"],
  ["risks", "Detectar riesgos", "Que puede complicarse"],
  ["meeting", "Preparar reunion", "Guion claro antes de entrar"],
  ["plan", "Crear plan de accion", "Tres movimientos concretos"],
  ["documents", "Resumir documentos", "Contratos, presupuestos y faltantes"],
  ["neglected", "Que estoy descuidando", "Lo que se puede enfriar"]
] as const;

type AssistantPageProps = {
  searchParams?: {
    mode?: string;
    project?: string;
  };
};

export default async function AssistantPage({ searchParams }: AssistantPageProps) {
  const mode = searchParams?.mode ?? "studio";
  const projectId = searchParams?.project ?? "";
  const [review, data] = await Promise.all([getAtlasAiReview(mode, projectId), getStudio17Data()]);

  return (
    <>
      <section className="hero">
        <p>ATLAS IA</p>
        <h1>Revision inteligente de Studio 17</h1>
        <p>No es un chat. Es una direccion operativa: mira datos, detecta riesgos y propone la siguiente accion.</p>
      </section>

      <section className="choice-grid">
        {actions.map(([key, label, description]) => (
          <Link className={mode === key ? "choice active" : "choice"} href={`/assistant?mode=${key}`} key={key}>
            <strong>{label}</strong>
            <span>{description}</span>
          </Link>
        ))}
      </section>

      <section className="grid">
        <article className="panel large">
          <div className="panel-header">
            <div>
              <p className="eyebrow">{review.mode}</p>
              <h2>Lo que ATLAS ve ahora</h2>
            </div>
            <strong>IA</strong>
          </div>
          <ul className="clean-list ai-list">
            {review.lines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <p className="muted">{review.note}</p>
        </article>

        <article className="panel">
          <h2>Revisar un proyecto</h2>
          <div className="table-list">
            {data.projects.map((project) => (
              <Link className="row row-link" href={`/assistant?mode=project&project=${project.id}`} key={project.id}>
                <div>
                  <strong>{project.name}</strong>
                  <p className="muted">Salud {project.health}%</p>
                </div>
                <span className="pill">Revisar</span>
              </Link>
            ))}
          </div>
        </article>

        <article className="panel">
          <h2>Como usarlo</h2>
          <p>Entras por la manana, pulsas una revision y conviertes la conclusion en una tarea, nota o decision. Sin abrir veinte frentes.</p>
        </article>
      </section>
    </>
  );
}
