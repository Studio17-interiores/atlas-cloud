import Link from "next/link";
import { getStudio17Data } from "@/server/studio17-data";

const studioLinks = [
  ["/assistant", "ATLAS IA", "Revisar riesgos, preparar reuniones y crear planes de accion."],
  ["/growth", "Objetivos", "Mensual, trimestral y anual sin mezclarlo con el trabajo diario."],
  ["/marketing", "Marketing", "Ideas, redes, SEO y contenido de obra."],
  ["/templates", "Plantillas", "Contratos, presupuestos y documentos base."],
  ["/reports", "Informes", "Resumen semanal, proyecto y dinero."],
  ["/automations", "Automatizaciones", "Reglas que evitan olvidos."],
  ["/edit", "Editar todo", "Pantalla de mantenimiento para corregir datos en bloque."],
  ["/system", "Sistema", "Seguridad, backups e inicializacion cloud."]
] as const;

export default async function StudioPage() {
  const data = await getStudio17Data();

  return (
    <>
      <section className="hero compact-hero">
        <p>Studio</p>
        <h1>Todo lo secundario, ordenado</h1>
        <p>Lo importante vive en Hoy, Proyectos, Clientes, Dinero y Calendario. Lo demas esta aqui para cuando lo necesites.</p>
      </section>
      <section className="choice-grid">
        {studioLinks.map(([href, title, description]) => (
          <Link className="choice" href={href} key={href}>
            <strong>{title}</strong>
            <span>{description}</span>
          </Link>
        ))}
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
          <h2>Entrada rapida</h2>
          <div className="action-row">
            <Link className="button-link subtle" href="/new?type=supplier">+ Proveedor</Link>
            <Link className="button-link subtle" href="/new?type=template-upload">Subir plantilla</Link>
          </div>
        </article>
      </section>
    </>
  );
}
