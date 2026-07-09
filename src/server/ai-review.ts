import OpenAI from "openai";
import { formatEuro, getStudio17Data } from "./studio17-data";

export async function getAtlasAiReview(mode = "studio", projectId = "") {
  const data = await getStudio17Data();
  const pendingMoney = data.moneyMovements
    .filter((movement) => movement.status === "pending")
    .reduce((total, movement) => total + Number(movement.amount), 0);
  const openTasks = data.tasks.filter((task) => !task.done);
  const weakestProject = [...data.projects].sort((a, b) => a.health - b.health)[0];
  const selectedProject = data.projects.find((project) => project.id === projectId) ?? weakestProject;

  const fallback = buildFallbackLines(mode, {
    pendingMoney,
    openTasks,
    weakestProject,
    selectedProject,
    decisionsCount: data.decisions.length,
    clientsCount: data.clients.filter((client) => client.next_action).length
  });

  if (!process.env.OPENAI_API_KEY) {
    return {
      mode: "Reglas inteligentes",
      lines: fallback,
      note: "Cuando pongas OPENAI_API_KEY en Vercel, ATLAS podra generar una revision mas fina."
    };
  }

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Eres ATLAS, directora de operaciones de Studio 17. No eres chatbot. Da una revision breve, directa, con tono cercano y acciones claras. Maximo 6 lineas."
        },
        {
          role: "user",
          content: JSON.stringify({
            mode,
            projectId,
            projects: data.projects,
            tasks: data.tasks,
            decisions: data.decisions,
            moneyMovements: data.moneyMovements,
            goals: data.goals,
            clients: data.clients,
            documents: data.documents
          })
        }
      ]
    });

    const text = completion.choices[0]?.message?.content ?? "";
    return {
      mode: "IA",
      lines: text.split("\n").map((line) => line.trim()).filter(Boolean).slice(0, 8),
      note: "Revision generada con IA a partir de los datos de Studio 17."
    };
  } catch {
    return {
      mode: "Reglas inteligentes",
      lines: fallback,
      note: "La IA no ha respondido, asi que ATLAS ha usado reglas locales."
    };
  }
}

function buildFallbackLines(
  mode: string,
  context: {
    pendingMoney: number;
    openTasks: Array<{ title: string }>;
    weakestProject?: { name: string; health: number };
    selectedProject?: { name: string; health: number };
    decisionsCount: number;
    clientsCount: number;
  }
) {
  if (mode === "risks") {
    return [
      `Riesgo principal: ${context.weakestProject ? `${context.weakestProject.name} esta al ${context.weakestProject.health}%` : "no hay proyecto critico cargado"}.`,
      `Decisiones abiertas: ${context.decisionsCount}. Si no se cierran, se convierten en retrasos.`,
      `Dinero pendiente: ${formatEuro(context.pendingMoney)}. Revisalo antes de asumir nuevos gastos.`,
      "Accion: elige un bloqueo y conviertelo hoy en tarea concreta."
    ];
  }

  if (mode === "meeting") {
    return [
      "Preparacion de reunion: lleva objetivo, decision necesaria y siguiente paso por escrito.",
      `Tema prioritario: ${context.openTasks[0]?.title ?? "definir el resultado esperado"}.`,
      "Cierra siempre con responsable, fecha y documento pendiente.",
      "Despues de la reunion: registra nota y convierte acuerdos en tareas."
    ];
  }

  if (mode === "plan") {
    return [
      `Primero: ${context.openTasks[0]?.title ?? "crear una prioridad real"}.`,
      "Segundo: revisar dinero pendiente y documentos que faltan.",
      "Tercero: mover captacion si no hay leads calientes.",
      "Regla: una accion cerrada vale mas que cinco frentes abiertos."
    ];
  }

  if (mode === "documents") {
    return [
      "Documentos: revisa contratos, presupuestos y facturas antes de dar un proyecto por sano.",
      "Si falta contrato o presupuesto, el proyecto no deberia estar en verde.",
      "Accion: sube archivos y marca estado pendiente, revisado, firmado o enviado."
    ];
  }

  if (mode === "neglected") {
    return [
      `Estas descuidando seguimiento si hay ${context.clientsCount} cliente(s) con accion pendiente.`,
      "Mira marketing si no hay captacion semanal registrada.",
      `Mira dinero si quedan ${formatEuro(context.pendingMoney)} pendientes.`,
      "Accion: haz una llamada, un cobro o una publicacion. Solo una, pero hoy."
    ];
  }

  if (mode === "project") {
    return [
      `${context.selectedProject?.name ?? "El proyecto"} esta al ${context.selectedProject?.health ?? 0}%.`,
      "Revisa dependencias externas, documentos faltantes y cobros antes de seguir disenando.",
      "Accion: deja una siguiente accion clara y con fecha."
    ];
  }

  return [
    `Prioridad: ${context.openTasks[0]?.title ?? "define la siguiente accion importante"}.`,
    `No olvides: hay ${context.decisionsCount} decision(es) abierta(s).`,
    `Dinero: quedan ${formatEuro(context.pendingMoney)} pendientes de controlar.`,
    `Hay que apretar: ${context.weakestProject ? `${context.weakestProject.name} esta al ${context.weakestProject.health}%` : "sin proyectos cargados"}.`,
    "Recomendacion: cierra una cosa importante antes de abrir otra."
  ];
}
