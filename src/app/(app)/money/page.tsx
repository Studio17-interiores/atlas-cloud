import { formatEuro, getStudio17Data } from "@/server/studio17-data";

export default async function MoneyPage() {
  const data = await getStudio17Data();
  const paid = data.moneyMovements
    .filter((movement) => movement.status === "paid")
    .reduce((total, movement) => total + Number(movement.amount), 0);
  const pending = data.moneyMovements
    .filter((movement) => movement.status === "pending")
    .reduce((total, movement) => total + Number(movement.amount), 0);
  const totalFees = data.projects.reduce((total, project) => total + Number(project.fee), 0);
  const collectedPercent = totalFees ? Math.round((paid / totalFees) * 100) : 0;

  return (
    <>
      <section className="hero">
        <p>Dinero</p>
        <h1>Lo importante: cobrado, pendiente y proximo movimiento</h1>
        <p>Una vista corta para saber si hay que reclamar, facturar o respirar.</p>
      </section>

      <section className="grid">
        <article className="panel">
          <p className="eyebrow">Cobrado</p>
          <h2>{formatEuro(paid)}</h2>
          <p className="muted">Ingresos marcados como pagados.</p>
        </article>
        <article className="panel">
          <p className="eyebrow">Pendiente</p>
          <h2>{formatEuro(pending)}</h2>
          <p className="muted">Dinero que ATLAS no debe dejar escapar.</p>
        </article>
        <article className="panel">
          <p className="eyebrow">Honorarios</p>
          <h2>{collectedPercent}%</h2>
          <div className="bar">
            <span style={{ width: `${Math.min(collectedPercent, 100)}%` }} />
          </div>
          <p className="muted">Progreso de cobro sobre honorarios registrados.</p>
        </article>

        <article className="panel full">
          <h2>Movimientos</h2>
          <div className="table-list">
            {data.moneyMovements.map((movement) => {
              const project = data.projects.find((item) => item.id === movement.project_id);
              return (
                <div className="row" key={movement.id}>
                  <div>
                    <strong>{movement.title}</strong>
                    <p className="muted">{project?.name ?? "Sin proyecto"} · {movement.status}</p>
                  </div>
                  <strong>{formatEuro(Number(movement.amount))}</strong>
                </div>
              );
            })}
            {!data.moneyMovements.length ? <p className="muted">Todavia no hay movimientos.</p> : null}
          </div>
        </article>
      </section>
    </>
  );
}
