import Link from "next/link";
import { formatEuro, getStudio17Data } from "@/server/studio17-data";

export default async function MoneyPage() {
  const data = await getStudio17Data();
  const paidMovements = data.moneyMovements.filter((movement) => movement.status === "paid");
  const pendingMovements = data.moneyMovements.filter((movement) => movement.status === "pending");
  const expenses = data.moneyMovements.filter((movement) => movement.type === "expense");
  const income = data.moneyMovements.filter((movement) => movement.type === "income" || movement.type === "invoice");
  const paid = paidMovements.reduce((total, movement) => total + Number(movement.amount), 0);
  const pending = pendingMovements.reduce((total, movement) => total + Number(movement.amount), 0);
  const expenseTotal = expenses.reduce((total, movement) => total + Number(movement.amount), 0);
  const incomeTotal = income.reduce((total, movement) => total + Number(movement.amount), 0);

  return (
    <>
      <section className="hero compact-hero">
        <p>Dinero</p>
        <h1>Cobros, pagos y gastos accionables</h1>
        <p>Control simple: que entra, que sale y que no puede quedarse pendiente.</p>
        <div className="action-row">
          <Link className="button-link" href="/new?type=money">+ Gasto / cobro</Link>
          <Link className="button-link subtle" href="/reports">Informe</Link>
        </div>
      </section>

      <section className="grid">
        <article className="panel">
          <p className="eyebrow">Cerrado</p>
          <h2>{formatEuro(paid)}</h2>
        </article>
        <article className="panel">
          <p className="eyebrow">Pendiente</p>
          <h2>{formatEuro(pending)}</h2>
        </article>
        <article className="panel">
          <p className="eyebrow">Ingresos</p>
          <h2>{formatEuro(incomeTotal)}</h2>
        </article>
        <article className="panel">
          <p className="eyebrow">Gastos</p>
          <h2>{formatEuro(expenseTotal)}</h2>
        </article>

        <MoneyList title="Pendiente de resolver" movements={pendingMovements} projects={data.projects} />
        <MoneyList title="Movimientos cerrados" movements={paidMovements} projects={data.projects} />
      </section>
    </>
  );
}

function MoneyList({
  title,
  movements,
  projects
}: {
  title: string;
  movements: Array<{ id: string; title: string; amount: number; status: string; type: string; project_id: string | null; category?: string | null }>;
  projects: Array<{ id: string; name: string }>;
}) {
  return (
    <article className="panel full">
      <h2>{title}</h2>
      <div className="table-list">
        {movements.map((movement) => {
          const project = projects.find((item) => item.id === movement.project_id);
          const nextStatus = movement.status === "paid" ? "pending" : "paid";
          return (
            <div className="row" key={movement.id}>
              <div>
                <strong>{movement.title}</strong>
                <p className="muted">{project?.name ?? "Sin proyecto"} · {movement.type} · {movement.status} · {movement.category ?? "sin categoria"}</p>
              </div>
              <div className="action-row tight">
                <strong>{formatEuro(Number(movement.amount))}</strong>
                <form action="/api/update" method="post">
                  <input type="hidden" name="entity" value="money" />
                  <input type="hidden" name="id" value={movement.id} />
                  <input type="hidden" name="title" value={movement.title} />
                  <input type="hidden" name="amount" value={movement.amount} />
                  <input type="hidden" name="type" value={movement.type} />
                  <input type="hidden" name="category" value={movement.category ?? ""} />
                  <input type="hidden" name="status" value={nextStatus} />
                  <input type="hidden" name="project_id" value={movement.project_id ?? ""} />
                  <input type="hidden" name="redirect" value="/money" />
                  <button className="subtle" type="submit">{nextStatus === "paid" ? "Marcar pagado" : "Volver pendiente"}</button>
                </form>
                <form action="/api/delete" method="post">
                  <input type="hidden" name="entity" value="money" />
                  <input type="hidden" name="id" value={movement.id} />
                  <input type="hidden" name="project_id" value={movement.project_id ?? ""} />
                  <input type="hidden" name="redirect" value="/money" />
                  <button className="danger" type="submit">Borrar</button>
                </form>
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
        {!movements.length ? <p className="muted">No hay movimientos en este bloque.</p> : null}
      </div>
    </article>
  );
}
