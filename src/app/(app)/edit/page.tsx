import { formatEuro, getStudio17Data } from "@/server/studio17-data";

export default async function EditPage() {
  const data = await getStudio17Data();

  return (
    <>
      <section className="hero">
        <p>Editar</p>
        <h1>Todo lo importante, editable</h1>
        <p>Corrige fechas, importes, fases, estados y notas sin tener que buscar en mil sitios.</p>
      </section>

      <section className="grid">
        <article className="panel large">
          <h2>Tareas</h2>
          <div className="table-list">
            {data.tasks.map((task) => (
              <form className="edit-row" action="/api/update" method="post" key={task.id}>
                <input type="hidden" name="entity" value="task" />
                <input type="hidden" name="id" value={task.id} />
                <input type="hidden" name="redirect" value="/edit" />
                <input name="title" defaultValue={task.title} />
                <input name="area" defaultValue={task.area ?? ""} placeholder="Area" />
                <input name="importance" type="number" min="1" max="10" defaultValue={task.importance} />
                <input name="due_date" type="date" defaultValue={task.due_date ?? ""} />
                <select name="done" defaultValue={String(task.done)}>
                  <option value="false">Pendiente</option>
                  <option value="true">Hecha</option>
                </select>
                <button type="submit">Guardar</button>
              </form>
            ))}
          </div>
        </article>

        <article className="panel large">
          <h2>Clientes y leads</h2>
          <div className="table-list">
            {data.clients.map((client) => (
              <form className="edit-row" action="/api/update" method="post" key={client.id}>
                <input type="hidden" name="entity" value="client" />
                <input type="hidden" name="id" value={client.id} />
                <input type="hidden" name="redirect" value="/edit" />
                <input name="name" defaultValue={client.name} />
                <input name="estimated_value" type="number" defaultValue={client.estimated_value} />
                <input name="next_action" defaultValue={client.next_action ?? ""} placeholder="Siguiente accion" />
                <input name="sentiment" defaultValue={client.sentiment ?? ""} placeholder="Contexto" />
                <select name="status" defaultValue={client.status}>
                  <option value="active">Activo</option>
                  <option value="warm">Templado</option>
                  <option value="cold">Frio</option>
                  <option value="won">Ganado</option>
                  <option value="lost">Perdido</option>
                </select>
                <button type="submit">Guardar</button>
              </form>
            ))}
          </div>
        </article>

        <article className="panel full">
          <h2>Dinero</h2>
          <div className="table-list">
            {data.moneyMovements.map((movement) => (
              <form className="edit-row" action="/api/update" method="post" key={movement.id}>
                <input type="hidden" name="entity" value="money" />
                <input type="hidden" name="id" value={movement.id} />
                <input type="hidden" name="redirect" value="/edit" />
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
                <strong>{formatEuro(Number(movement.amount))}</strong>
                <button type="submit">Guardar</button>
              </form>
            ))}
          </div>
        </article>

        <article className="panel large">
          <h2>Documentos</h2>
          <div className="table-list">
            {data.documents.map((document) => (
              <div className="edit-row split" key={document.id}>
                <form className="edit-inline" action="/api/update" method="post">
                  <input type="hidden" name="entity" value="document" />
                  <input type="hidden" name="id" value={document.id} />
                  <input type="hidden" name="redirect" value="/edit" />
                  <input name="title" defaultValue={document.title} />
                  <select name="type" defaultValue={document.type}>
                    <option value="contract">Contrato</option>
                    <option value="budget">Presupuesto</option>
                    <option value="invoice">Factura</option>
                    <option value="photo">Foto</option>
                    <option value="plan">Plano</option>
                    <option value="other">Otro</option>
                  </select>
                  <select name="status" defaultValue={document.status}>
                    <option value="pending">Pendiente</option>
                    <option value="reviewed">Revisado</option>
                    <option value="signed">Firmado</option>
                    <option value="sent">Enviado</option>
                    <option value="uploaded">Subido</option>
                  </select>
                  <button type="submit">Guardar</button>
                </form>
                <DeleteForm entity="document" id={document.id} storagePath={document.storage_path ?? ""} />
              </div>
            ))}
          </div>
        </article>

        <article className="panel large">
          <h2>Plantillas</h2>
          <div className="table-list">
            {data.templates.map((template) => (
              <div className="edit-row split" key={template.id}>
                <form className="edit-inline" action="/api/update" method="post">
                  <input type="hidden" name="entity" value="template" />
                  <input type="hidden" name="id" value={template.id} />
                  <input type="hidden" name="redirect" value="/edit" />
                  <input name="title" defaultValue={template.title} />
                  <input name="type" defaultValue={template.type} />
                  <input name="notes" defaultValue={template.notes ?? ""} />
                  <button type="submit">Guardar</button>
                </form>
                <DeleteForm entity="template" id={template.id} storagePath={template.storage_path ?? ""} />
              </div>
            ))}
          </div>
        </article>

        <article className="panel large">
          <h2>Proveedores</h2>
          <div className="table-list">
            {data.suppliers.map((supplier) => (
              <form className="edit-row" action="/api/update" method="post" key={supplier.id}>
                <input type="hidden" name="entity" value="supplier" />
                <input type="hidden" name="id" value={supplier.id} />
                <input type="hidden" name="redirect" value="/edit" />
                <input name="name" defaultValue={supplier.name} />
                <input name="category" defaultValue={supplier.category ?? ""} />
                <input name="reliability" type="number" min="0" max="100" defaultValue={supplier.reliability ?? 70} />
                <input name="notes" defaultValue={supplier.notes ?? ""} />
                <button type="submit">Guardar</button>
              </form>
            ))}
          </div>
        </article>

        <article className="panel large">
          <h2>Reuniones, decisiones y notas</h2>
          <div className="table-list">
            {data.meetings.map((meeting) => (
              <form className="edit-row" action="/api/update" method="post" key={meeting.id}>
                <input type="hidden" name="entity" value="meeting" />
                <input type="hidden" name="id" value={meeting.id} />
                <input type="hidden" name="redirect" value="/edit" />
                <input name="title" defaultValue={meeting.title} />
                <input name="meeting_at" type="datetime-local" defaultValue={meeting.meeting_at?.slice(0, 16)} />
                <button type="submit">Guardar</button>
              </form>
            ))}
            {data.decisions.map((decision) => (
              <form className="edit-row" action="/api/update" method="post" key={decision.id}>
                <input type="hidden" name="entity" value="decision" />
                <input type="hidden" name="id" value={decision.id} />
                <input type="hidden" name="redirect" value="/edit" />
                <input name="title" defaultValue={decision.title} />
                <input name="impact" defaultValue={decision.impact ?? ""} />
                <select name="status" defaultValue={decision.status}>
                  <option value="open">Abierta</option>
                  <option value="converted">Convertida en tarea</option>
                  <option value="closed">Cerrada</option>
                </select>
                <button type="submit">Guardar</button>
              </form>
            ))}
            {data.notes.map((note) => (
              <form className="edit-row" action="/api/update" method="post" key={note.id}>
                <input type="hidden" name="entity" value="note" />
                <input type="hidden" name="id" value={note.id} />
                <input type="hidden" name="redirect" value="/edit" />
                <input name="body" defaultValue={note.body} />
                <button type="submit">Guardar</button>
              </form>
            ))}
          </div>
        </article>
      </section>
    </>
  );
}

function DeleteForm({ entity, id, storagePath }: { entity: string; id: string; storagePath: string }) {
  return (
    <form action="/api/delete" method="post">
      <input type="hidden" name="entity" value={entity} />
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="storage_path" value={storagePath} />
      <input type="hidden" name="redirect" value="/edit" />
      <button className="danger" type="submit">Borrar</button>
    </form>
  );
}
