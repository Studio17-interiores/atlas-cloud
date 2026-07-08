import { getStudio17Data } from "@/server/studio17-data";

const periodLabels: Record<string, string> = {
  month: "Mensual",
  quarter: "Trimestral",
  year: "Anual"
};

export default async function GrowthPage() {
  const data = await getStudio17Data();

  return (
    <>
      <section className="hero">
        <p>Objetivos</p>
        <h1>Que ATLAS te diga donde apretar</h1>
        <p>Mensual, trimestral y anual con acciones concretas para mejorar.</p>
      </section>

      <section className="grid">
        {data.goals.map((goal) => {
          const percent = Math.min(Math.round((Number(goal.current_value) / Number(goal.target_value || 1)) * 100), 100);
          const mood = percent >= 80 ? "Vas muy bien" : percent >= 40 ? "Hay que empujar" : "Toca activar acciones";

          return (
            <article className="panel large" key={goal.id}>
              <div className="panel-header">
                <div>
                  <p className="eyebrow">{periodLabels[goal.period] ?? goal.period}</p>
                  <h2>{goal.title}</h2>
                </div>
                <strong>{percent}%</strong>
              </div>
              <div className="bar">
                <span style={{ width: `${percent}%` }} />
              </div>
              <p><strong>{mood}.</strong> Actual: {Number(goal.current_value)} / Objetivo: {Number(goal.target_value)}</p>
              <h3>Acciones para mejorar</h3>
              <ul className="clean-list">
                {(goal.actions ?? []).map((action) => (
                  <li key={action}>{action}</li>
                ))}
              </ul>
              <details className="edit-box">
                <summary>Editar objetivo</summary>
                <form action="/api/update" method="post" className="quick-form">
                  <input type="hidden" name="entity" value="goal" />
                  <input type="hidden" name="id" value={goal.id} />
                  <input type="hidden" name="redirect" value="/growth" />
                  <input name="title" defaultValue={goal.title} />
                  <select name="period" defaultValue={goal.period}>
                    <option value="month">Mensual</option>
                    <option value="quarter">Trimestral</option>
                    <option value="year">Anual</option>
                  </select>
                  <input name="current_value" type="number" defaultValue={Number(goal.current_value)} />
                  <input name="target_value" type="number" defaultValue={Number(goal.target_value)} />
                  <textarea name="actions" defaultValue={(goal.actions ?? []).join("\n")} />
                  <button type="submit">Guardar objetivo</button>
                </form>
              </details>
            </article>
          );
        })}

        {!data.goals.length ? (
          <article className="panel large">
            <h2>Aun no hay objetivos</h2>
            <p>Ve a Sistema y crea Studio 17 con los datos iniciales.</p>
          </article>
        ) : null}
      </section>
    </>
  );
}
