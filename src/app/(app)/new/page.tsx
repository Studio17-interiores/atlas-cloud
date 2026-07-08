import type { ReactNode } from "react";
import { getStudio17Data } from "@/server/studio17-data";

type NewPageProps = {
  searchParams?: {
    created?: string;
    error?: string;
  };
};

export default async function NewPage({ searchParams }: NewPageProps) {
  const data = await getStudio17Data();
  const created = searchParams?.created === "1";
  const error = searchParams?.error;

  return (
    <>
      <section className="hero">
        <p>Nuevo</p>
        <h1>Captura rapida para Studio 17</h1>
        <p>Cliente, proyecto, tarea, dinero, objetivo, documento o nota. Entra por aqui y ATLAS lo coloca.</p>
      </section>

      {created ? <p className="notice">Guardado. ATLAS ya lo tiene.</p> : null}
      {error ? <p className="notice error">No se ha guardado: {error}</p> : null}

      <section className="grid">
        <QuickForm title="Cliente o lead" entity="client">
          <input name="name" placeholder="Nombre" required />
          <select name="type" defaultValue="client">
            <option value="client">Cliente</option>
            <option value="lead">Lead</option>
          </select>
          <input name="estimated_value" placeholder="Valor estimado" type="number" />
          <input name="next_action" placeholder="Siguiente accion" />
          <textarea name="sentiment" placeholder="Contexto rapido" />
        </QuickForm>

        <QuickForm title="Proyecto" entity="project">
          <input name="name" placeholder="Nombre del proyecto" required />
          <select name="client_id" defaultValue="">
            <option value="">Sin cliente</option>
            {data.clients.map((client) => (
              <option key={client.id} value={client.id}>{client.name}</option>
            ))}
          </select>
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

        <QuickForm title="Tarea" entity="task">
          <input name="title" placeholder="Que hay que hacer" required />
          <ProjectSelect projects={data.projects} />
          <input name="area" placeholder="Area" />
          <input name="importance" placeholder="Importancia 1-10" type="number" min="1" max="10" defaultValue="7" />
        </QuickForm>

        <QuickForm title="Dinero" entity="money">
          <input name="title" placeholder="Concepto" required />
          <ProjectSelect projects={data.projects} />
          <select name="type" defaultValue="expense">
            <option value="expense">Gasto</option>
            <option value="income">Cobro</option>
            <option value="payment">Pago</option>
            <option value="invoice">Factura</option>
          </select>
          <input name="amount" placeholder="Importe" type="number" step="0.01" required />
          <select name="status" defaultValue="pending">
            <option value="pending">Pendiente</option>
            <option value="paid">Pagado</option>
          </select>
        </QuickForm>

        <QuickForm title="Objetivo real" entity="goal">
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

        <QuickForm title="Documento" entity="document">
          <input name="title" placeholder="Titulo" required />
          <ProjectSelect projects={data.projects} />
          <select name="type" defaultValue="other">
            <option value="contract">Contrato</option>
            <option value="photo">Fotos</option>
            <option value="plan">Planos</option>
            <option value="budget">Presupuesto</option>
            <option value="invoice">Factura</option>
            <option value="other">Otro</option>
          </select>
          <input name="file_name" placeholder="Nombre de archivo o pendiente" />
        </QuickForm>

        <QuickForm title="Plantilla" entity="template">
          <input name="title" placeholder="Titulo" required />
          <select name="type" defaultValue="other">
            <option value="contract">Contrato</option>
            <option value="budget">Presupuesto</option>
            <option value="template">Plantilla</option>
            <option value="other">Otro</option>
          </select>
          <input name="file_name" placeholder="Nombre de archivo" />
          <textarea name="notes" placeholder="Notas" />
        </QuickForm>

        <QuickForm title="Reunion" entity="meeting">
          <input name="title" placeholder="Titulo" required />
          <ProjectSelect projects={data.projects} />
          <input name="meeting_at" type="datetime-local" required />
          <textarea name="prep" placeholder={"Preparacion\nUna linea por punto"} />
        </QuickForm>

        <QuickForm title="Proveedor" entity="supplier">
          <input name="name" placeholder="Nombre" required />
          <input name="category" placeholder="Categoria" />
          <input name="reliability" placeholder="Fiabilidad 0-100" type="number" min="0" max="100" defaultValue="70" />
          <textarea name="notes" placeholder="Notas" />
        </QuickForm>

        <QuickForm title="Nota de proyecto" entity="note">
          <ProjectSelect projects={data.projects} />
          <textarea name="body" placeholder="Nota" required />
        </QuickForm>
      </section>
    </>
  );
}

function QuickForm({ title, entity, children }: { title: string; entity: string; children: ReactNode }) {
  return (
    <article className="panel">
      <h2>{title}</h2>
      <form action="/api/create" method="post" className="quick-form">
        <input type="hidden" name="entity" value={entity} />
        <input type="hidden" name="redirect" value="/new" />
        {children}
        <button type="submit">Guardar</button>
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
