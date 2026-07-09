import Link from "next/link";
import { getStudio17Data } from "@/server/studio17-data";

const rules = [
  ["Reunion manana", "Si hay reunion manana, ATLAS la lleva a Hoy para preparar objetivo y checklist."],
  ["Contrato faltante", "Si falta contrato, el proyecto no deberia considerarse sano."],
  ["Cobro pendiente", "Si hay dinero pendiente, aparece en Dashboard Hoy y Dinero."],
  ["Cliente 7 dias sin contacto", "Si un cliente tiene siguiente accion, ATLAS lo trata como seguimiento vivo."],
  ["Entrega cercana", "Si una tarea tiene fecha cercana, debe aparecer entre las 3 prioridades."],
  ["Proyecto baja de salud", "Si la salud baja, pasa a Hay que apretar."]
] as const;

export default async function AutomationsPage() {
  const data = await getStudio17Data();

  return (
    <>
      <section className="hero">
        <p>Automatizaciones</p>
        <h1>Reglas que evitan olvidos</h1>
        <p>No son complicadas. Son pequenas alarmas inteligentes para que ATLAS piense un poco por ti.</p>
      </section>

      <section className="grid">
        <article className="panel large">
          <h2>Reglas activas de producto</h2>
          <div className="table-list">
            {rules.map(([title, body]) => (
              <div className="row" key={title}>
                <div>
                  <strong>{title}</strong>
                  <p className="muted">{body}</p>
                </div>
                <span className="pill">Activa</span>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <h2>Automatizaciones creadas</h2>
          <ul className="clean-list">
            {data.automations.map((automation) => (
              <li key={automation.id}>{automation.enabled ? "Activa" : "Pausada"} · {automation.name}</li>
            ))}
            {!data.automations.length ? <li>No hay reglas personalizadas todavia.</li> : null}
          </ul>
          <Link className="button-link subtle" href="/new?type=automation">Crear automatizacion</Link>
        </article>
      </section>
    </>
  );
}
