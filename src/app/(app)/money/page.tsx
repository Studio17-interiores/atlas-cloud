import Link from "next/link";
import { formatEuro, getStudio17Data } from "@/server/studio17-data";

export default async function MoneyPage() {
  const data = await getStudio17Data();
  const paid = data.moneyMovements
    .filter((movement) => movement.status === "paid")
    .reduce((total, movement) => total + Number(movement.amount), 0);
  const pending = data.moneyMovements
    .filter((movement) => movement.status === "pending")
    .reduce((total, movement) => total + Number(movement.amount), 0);

  return (
    <>
      <section className="hero compact-hero">
        <p>Dinero</p>
        <h1>Cobros, pagos y gastos accionables</h1>
        <p>Nada de mirar una tabla muerta: aqui marcas pagado, corriges importes y anades movimientos.</p>
        <Link className="button-link" href="/new?type=money">+ Gasto / cobro</Link>
      </section>

      <section className="grid">
        <article className="panel">
          <p className="eyebrow">Cobrado / pagado</p>
          <h2>{formatEuro(paid)}</h2>
        </article>
        <article className="panel">
          <p className="eyebrow">Pendiente</p>
          <h2>{formatEuro(pending)}</h2>
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
                    <p className="muted">{project?.name ?? "Sin proyecto"} · {movement.type} · {movement.status}</p>
                  </div>
                  <div className="action-row tight">
                    <strong>{formatEuro(Number(movement.amount))}</strong>
                    {movement.status !== "paid" ? (
                      <form action="/api/update" method="post">
                        <input type="hidden" name="entity" value="money" />
                        <input type="hidden" name="id" value={movement.id} />
                        <input type="hidden" name="title" value={movement.title} />
                        <input type="hidden" name="amount" value={movement.amount} />
                        <input type="hidden" name="type" value={movement.type} />
                        <input type="hidden" name="category" value={movement.category ?? ""} />
                        <input type="hidden" name="status" value="paid" />
                        <input type="hidden" name="redirect" value="/money" />
                        <button type="submit">Marcar pagado</button>
                      </form>
                    ) : null}
                  </div>
                  <details className="edit-box full-details">
                    <summary>Editar movimiento</summary>
                    <form action="/api/update" method="post" className="quick-form">
                      <input type="hidden" name="entity" value="money" />
                      <input type="hidden" name="id" value={movement.id} />
                      <input type="hidden" name="redirect" value="/money" />
                      <input name="title" defaultValue={movement.title} />
                      <select name="type" defaultValue={movement.type}>
                        <option value="expense">Gasto</option>
                        <option value="income">Cobro</option>
                        <option value="payment">Pago</option>
                        <option value="invoice">Factura</option>
                      </select>
                      <input name="category" defaultValue={movement.category ?? ""} />
                      <input name="amount" type="number" step="0.01" defaultValue={movement.amount} />
                      <select name="status" defaultValue={movement.status}>
                        <option value="pending">Pendiente</option>
                        <option value="paid">Pagado</option>
                      </select>
                      <button type="submit">Guardar cambios</button>
                    </form>
                  </details>
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
