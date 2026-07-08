import { getTodayBrief } from "@/server/brief";

export default async function TodayPage() {
  const brief = await getTodayBrief();

  return (
    <>
      <section className="hero">
        <p>Revisión de 5 minutos</p>
        <h1>{brief.title}</h1>
        <p>{brief.message}</p>
      </section>

      <section className="grid">
        <article className="panel large">
          <h2>Haz esto primero</h2>
          <p>{brief.firstAction}</p>
        </article>
        <article className="panel">
          <h2>No olvides</h2>
          <p>{brief.watch}</p>
        </article>
        <article className="panel full">
          <h2>Hay que apretar</h2>
          <p>{brief.growth}</p>
        </article>
      </section>
    </>
  );
}

