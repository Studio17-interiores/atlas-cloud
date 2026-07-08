import OpenAI from "openai";
import { formatEuro, getStudio17Data } from "./studio17-data";

export async function getAtlasAiReview() {
  const data = await getStudio17Data();
  const pendingMoney = data.moneyMovements
    .filter((movement) => movement.status === "pending")
    .reduce((total, movement) => total + Number(movement.amount), 0);
  const openTasks = data.tasks.filter((task) => !task.done);
  const weakestProject = [...data.projects].sort((a, b) => a.health - b.health)[0];

  const fallback = [
    `✨ Prioridad: ${openTasks[0]?.title ?? "define la siguiente accion importante"}.`,
    `📌 No olvides: hay ${data.decisions.length} decision(es) abierta(s).`,
    `💸 Dinero: quedan ${formatEuro(pendingMoney)} pendientes de controlar.`,
    `🔥 Hay que apretar: ${weakestProject ? `${weakestProject.name} esta al ${weakestProject.health}%` : "sin proyectos cargados"}.`,
    "🧭 Recomendacion: cierra una cosa importante antes de abrir otra."
  ];

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
            projects: data.projects,
            tasks: data.tasks,
            decisions: data.decisions,
            moneyMovements: data.moneyMovements,
            goals: data.goals,
            clients: data.clients
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
