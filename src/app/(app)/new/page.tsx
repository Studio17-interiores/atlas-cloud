import Link from "next/link";
import type { ReactNode } from "react";
import { getStudio17Data } from "@/server/studio17-data";

const options = [
  ["task", "✅ Tarea", "Algo que hay que hacer"],
  ["money", "💸 Gasto / cobro", "Dinero que entra o sale"],
  ["document-upload", "📎 Subir documento", "Contrato, fotos, planos o factura"],
  ["project", "🏗️ Proyecto", "Una obra, decoracion o medidor"],
  ["client", "👤 Cliente / lead", "Persona o empresa"],
  ["goal", "🎯 Objetivo", "Mensual, trimestral o anual"],
  ["meeting", "📅 Reunion", "Cita con preparacion"],
  ["decision", "📌 Decision", "Algo que no puede quedar en el aire"],
  ["template-upload", "📄 Subir plantilla", "Contrato, presupuesto o checklist"],
  ["supplier", "🧱 Proveedor", "Materiales, oficios o colaborador"],
  ["note", "📝 Nota", "Contexto rapido de proyecto"],
  ["automation", "⚡ Automatizacion", "Recordatorio o regla simple"]
] as const;

type NewPageProps = {
  searchParams?: {
    type?: string;
    created?: string;
    error?: string;
    uploaded?: string;
  };
};

export default async function NewPage({ searchParams }: NewPageProps) {
  const data = await getStudio17Data();
  const selected = searchParams?.type ?? "";
  const created = searchParams?.created === "1";
  const uploaded = searchParams?.uploaded === "1";
  const error = searchParams?.error;

  return (
    <>
      <section className="hero">
        <p>Nuevo</p>
        <h1>Que quieres anadir?</h1>
        <p>Elige una opcion y ATLAS te ensena solo el formulario necesario. Sin ruido.</p>
      </section>

      {created ? <p className="notice">Guardado. ATLAS ya lo tiene.</p> : null}
      {uploaded ? <p className="notice">Archivo subido. ATLAS ya lo ha guardado.</p> : null}
      {error ? <p className="notice error">No se ha guardado: {error}</p> : null}

      <section className="choice-grid">
        {options.map(([type, label, description]) => (
          <Link className={selected === type ? "choice active" : "choice"} href={`/new?type=${type}`} key={type}>
            <strong>{label}</strong>
            <span>{description}</span>
          </Link>
        ))}
      </section>

      <section className="grid">
        {!selected ? (
          <article className="panel large">
            <h2>Entrada rapida</h2>
            <p>Elige arriba que quieres crear. Mi recomendacion para el dia a dia: tarea, dinero o subir documento.</p>
          </article>
        ) : null}

        {selected === "client" ? (
          <QuickForm title="Cliente o lead" entity="client" selected={selected}>
            <input name="name" placeholder="Nombre" required />
            <select name="type" defaultValue="client">
              <option value="client">Cliente</option>
              <option value="lead">Lead</option>
            </select>
            <input name="estimated_value" placeholder="Valor estimado" type="number" />
            <input name="next_action" placeholder="Siguiente accion" />
            <textarea name="sentiment" placeholder="Contexto rapido" />
          </QuickForm>
        ) : null}

        {selected === "project" ? (
          <QuickForm title="Proyecto" entity="project" selected={selected}>
            <input name="name" placeholder="Nombre del proyecto" required />
            <ClientSelect clients={data.clients} />
            <textarea name="description" placeholder="Descripcion corta" />
            <select name="phase" defaultValue="concept">
              <option value="concept">Concepto</option>
              <option value="budget">Presupuesto</option>
              <option value="design">Diseno</option>
              <option value="worksite">Obra</option>
              <option value="delivery">Entrega</option>
            </select>
            <input name="budget" placeholder="Presupuesto" type="number" />
            <input name="fee" placeholder="Honorarios" type="number" />
          </QuickForm>
        ) : null}

        {selected === "task" ? (
          <QuickForm title="Tarea" entity="task" selected={selected}>
            <input name="title" placeholder="Que hay que hacer" required />
            <ProjectSelect projects={data.projects} />
            <input name="area" placeholder="Area" />
            <input name="due_date" type="date" />
            <input name="importance" placeholder="Importancia 1-10" type="number" min="1" max="10" defaultValue="7" />
          </QuickForm>
        ) : null}

        {selected === "money" ? (
          <QuickForm title="Gasto, cobro o pago" entity="money" selected={selected}>
            <input name="title" placeholder="Concepto" required />
            <ProjectSelect projects={data.projects} />
            <select name="type" defaultValue="expense">
              <option value="expense">Gasto</option>
              <option value="income">Cobro</option>
              <option value="payment">Pago</option>
              <option value="invoice">Factura</option>
            </select>
            <input name="category" placeholder="Categoria" />
            <input name="amount" placeholder="Importe" type="number" step="0.01" required />
            <select name="status" defaultValue="pending">
              <option value="pending">Pendiente</option>
              <option value="paid">Pagado</option>
            </select>
          </QuickForm>
        ) : null}

        {selected === "goal" ? (
          <QuickForm title="Objetivo real" entity="goal" selected={selected}>
            <input name="title" placeholder="Objetivo" required />
            <select name="period" defaultValue="month">
              <option value="month">Mensual</option>
              <option value="quarter">Trimestral</option>
              <option value="year">Anual</option>
            </select>
            <input name="current_value" placeholder="Actual" type="number" defaultValue="0" />
            <input name="target_value" placeholder="Meta" type="number" defaultValue="1" />
            <textarea name="actions" placeholder={"Acciones para mejorar\nUna por linea"} />
          </QuickForm>
        ) : null}

        {selected === "document-upload" ? (
          <UploadForm title="Subir documento de proyecto" kind="document" selected={selected}>
            <input name="title" placeholder="Titulo del documento" required />
            <ProjectSelect projects={data.projects} />
            <select name="type" defaultValue="other">
              <option value="contract">Contrato</option>
              <option value="photo">Fotos</option>
              <option value="plan">Planos</option>
              <option value="budget">Presupuesto</option>
              <option value="invoice">Factura</option>
              <option value="other">Otro</option>
            </select>
          </UploadForm>
        ) : null}

        {selected === "template-upload" ? (
          <UploadForm title="Subir plantilla" kind="template" selected={selected}>
            <input name="title" placeholder="Titulo de plantilla" required />
            <select name="type" defaultValue="template">
              <option value="contract">Contrato</option>
              <option value="budget">Presupuesto</option>
              <option value="template">Plantilla</option>
              <option value="other">Otro</option>
            </select>
            <textarea name="notes" placeholder="Notas" />
          </UploadForm>
        ) : null}

        {selected === "meeting" ? (
          <QuickForm title="Reunion" entity="meeting" selected={selected}>
            <input name="title" placeholder="Titulo" required />
            <ProjectSelect projects={data.projects} />
            <input name="meeting_at" type="datetime-local" required />
            <textarea name="prep" placeholder={"Preparacion\nUna linea por punto"} />
          </QuickForm>
        ) : null}

        {selected === "decision" ? (
          <QuickForm title="Decision" entity="decision" selected={selected}>
            <input name="title" placeholder="Decision pendiente" required />
            <ProjectSelect projects={data.projects} />
            <input name="owner" placeholder="Quien decide" />
            <input name="due_date" type="date" />
            <textarea name="impact" placeholder="Por que importa" />
          </QuickForm>
        ) : null}

        {selected === "supplier" ? (
          <QuickForm title="Proveedor" entity="supplier" selected={selected}>
            <input name="name" placeholder="Nombre" required />
            <input name="category" placeholder="Categoria" />
            <input name="reliability" placeholder="Fiabilidad 0-100" type="number" min="0" max="100" defaultValue="70" />
            <textarea name="notes" placeholder="Notas" />
          </QuickForm>
        ) : null}

        {selected === "note" ? (
          <QuickForm title="Nota de proyecto" entity="note" selected={selected}>
            <ProjectSelect projects={data.projects} />
            <textarea name="body" placeholder="Nota" required />
          </QuickForm>
        ) : null}

        {selected === "automation" ? (
          <QuickForm title="Automatizacion simple" entity="automation" selected={selected}>
            <input name="name" placeholder="Nombre de la regla" required />
            <select name="rule_type" defaultValue="manual_reminder">
              <option value="manual_reminder">Recordatorio manual</option>
              <option value="meeting_tomorrow">Aviso reunion manana</option>
              <option value="client_no_contact_7_days">Cliente sin contacto</option>
            </select>
            <input name="days" placeholder="Dias" type="number" defaultValue="1" />
            <textarea name="message" placeholder="Que debe recordarte ATLAS" />
          </QuickForm>
        ) : null}
      </section>
    </>
  );
}

function QuickForm({ title, entity, selected, children }: { title: string; entity: string; selected: string; children: ReactNode }) {
  return (
    <article className="panel large">
      <h2>{title}</h2>
      <form action="/api/create" method="post" className="quick-form">
        <input type="hidden" name="entity" value={entity} />
        <input type="hidden" name="redirect" value={`/new?type=${selected}`} />
        {children}
        <button type="submit">Guardar</button>
      </form>
    </article>
  );
}

function UploadForm({ title, kind, selected, children }: { title: string; kind: string; selected: string; children: ReactNode }) {
  return (
    <article className="panel large upload-panel">
      <h2>{title}</h2>
      <form action="/api/upload" method="post" encType="multipart/form-data" className="quick-form">
        <input type="hidden" name="kind" value={kind} />
        <input type="hidden" name="redirect" value={`/new?type=${selected}`} />
        {children}
        <label className="dropzone">
          <strong>Arrastra aqui el archivo o pulsa para elegirlo</strong>
          <span>Contrato, presupuesto, fotos, factura, planos o plantilla.</span>
          <input name="file" type="file" required />
        </label>
        <button type="submit">Subir archivo</button>
      </form>
    </article>
  );
}

function ProjectSelect({ projects }: { projects: Array<{ id: string; name: string }> }) {
  return (
    <select name="project_id" defaultValue="">
      <option value="">Sin proyecto</option>
      {projects.map((project) => (
        <option key={project.id} value={project.id}>{project.name}</option>
      ))}
    </select>
  );
}

function ClientSelect({ clients }: { clients: Array<{ id: string; name: string }> }) {
  return (
    <select name="client_id" defaultValue="">
      <option value="">Sin cliente</option>
      {clients.map((client) => (
        <option key={client.id} value={client.id}>{client.name}</option>
      ))}
    </select>
  );
}
