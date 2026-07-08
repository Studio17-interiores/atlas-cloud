import { getAtlasAiReview } from "@/server/ai-review";

export default async function AssistantPage() {
  const review = await getAtlasAiReview();

  return (
    <>
      <section className="hero">
        <p>ATLAS IA</p>
        <h1>Revision inteligente de Studio 17</h1>
        <p>No es un chat. Es una lectura operativa para decidir mejor y que no se escape nada.</p>
      </section>

      <section className="grid">
        <article className="panel large">
          <div className="panel-header">
            <div>
              <p className="eyebrow">{review.mode}</p>
              <h2>Lo que ATLAS ve ahora</h2>
            </div>
            <strong>✨</strong>
          </div>
          <ul className="clean-list ai-list">
            {review.lines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <p className="muted">{review.note}</p>
        </article>

        <article className="panel">
          <h2>Como usarlo</h2>
          <p>Entras por la manana, lees esto y decides el primer movimiento. Nada de abrir veinte frentes.</p>
        </article>
      </section>
    </>
  );
}
