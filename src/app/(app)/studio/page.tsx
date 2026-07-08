import { getStudio17Data } from "@/server/studio17-data";

export default async function StudioPage() {
  const data = await getStudio17Data();

  return (
    <>
      <section className="hero">
        <p>Estudio</p>
        <h1>Proveedores, materiales y conocimiento</h1>
        <p>La base interna para que Studio 17 no dependa de memoria dispersa.</p>
      </section>
      <section className="grid">
        <article className="panel large">
          <h2>Proveedores</h2>
          <div className="table-list">
            {data.suppliers.map((supplier) => (
              <div className="row" key={supplier.id}>
                <div>
                  <strong>{supplier.name}</strong>
                  <p className="muted">{supplier.category} · fiabilidad {supplier.reliability ?? 0}%</p>
                </div>
                <span>{supplier.notes}</span>
              </div>
            ))}
            {!data.suppliers.length ? <p className="muted">Aun no hay proveedores cargados.</p> : null}
          </div>
        </article>
        <article className="panel">
          <h2>Base de conocimiento</h2>
          <p>Checklists, SOPs y criterios de decision se iran guardando aqui.</p>
        </article>
      </section>
    </>
  );
}
