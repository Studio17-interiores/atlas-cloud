import Link from "next/link";
import { getStudio17Data } from "@/server/studio17-data";

export default async function MarketingPage() {
  const data = await getStudio17Data();
  const contentIdeas = [
    "Antes/despues de Axis: de local en bruto a centro de fisioterapia y pilates.",
    "Story de proceso: como ordenar una obra antes de elegir materiales.",
    "Post educativo: 3 errores al convertir una vivienda en dos viviendas.",
    "Reel corto: que reviso antes de una entrega final.",
    "SEO: pagina sobre interiorismo comercial para centros de fisioterapia."
  ];

  return (
    <>
      <section className="hero">
        <p>Marketing</p>
        <h1>Captacion sin improvisar</h1>
        <p>Ideas, calendario y acciones para que Studio 17 no dependa solo del boca a boca.</p>
      </section>

      <section className="grid">
        <article className="panel large">
          <h2>Contenido recomendado</h2>
          <ul className="clean-list">
            {contentIdeas.map((idea) => (
              <li key={idea}>{idea}</li>
            ))}
          </ul>
        </article>
        <article className="panel">
          <h2>Esta semana</h2>
          <p>Publica una pieza de autoridad y una pieza de proceso. No hace falta volumen, hace falta consistencia.</p>
          <Link className="button-link subtle" href="/new?type=task">Crear tarea de contenido</Link>
        </article>
        <article className="panel">
          <h2>Pipeline</h2>
          <p>{data.clients.filter((client) => client.type === "lead").length} leads registrados.</p>
          <p>{data.projects.length} proyectos activos que pueden generar contenido real.</p>
        </article>
      </section>
    </>
  );
}
