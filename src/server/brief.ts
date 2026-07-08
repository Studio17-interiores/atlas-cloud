import { getStudio17Data } from "./studio17-data";

export async function getTodayBrief() {
  const data = await getStudio17Data();

  if (!data.organization) {
    return {
      title: "ATLAS Cloud conectado",
      message: "Falta inicializar Studio 17 desde Sistema.",
      firstAction: "Ve a Sistema y pulsa Crear Studio 17 y datos iniciales.",
      watch: "Aun no hay proyectos reales en la nube.",
      growth: "Despues conectaremos proyectos, dinero y objetivos."
    };
  }

  const openTasks = data.tasks.filter((task) => !task.done);
  const topTask = openTasks[0];
  const axis = data.projects.find((project) => project.name.toLowerCase() === "axis");
  const weakestProject = [...data.projects].sort((a, b) => a.health - b.health)[0];
  const pendingMoney = data.moneyMovements
    .filter((movement) => movement.status === "pending")
    .reduce((total, movement) => total + Number(movement.amount), 0);

  return {
    title: topTask ? `Hoy manda esto: ${topTask.title}` : "Hoy no hay urgencias abiertas",
    message: `ATLAS ha revisado ${data.projects.length} proyectos, ${openTasks.length} tareas abiertas y ${data.decisions.length} decisiones pendientes.`,
    firstAction: topTask
      ? `${topTask.title}. No abras frentes nuevos hasta mover esto.`
      : "Revisa proyectos y define la siguiente accion importante.",
    watch: axis
      ? `Axis tiene ${axis.fee_paid_percent}% de honorarios pagados. Pendiente cerrar entrega y decision de direccion de obra.`
      : "No hay proyecto Axis cargado.",
    growth: weakestProject
      ? `Hay que apretar en ${weakestProject.name}: salud ${weakestProject.health}%. Cobros pendientes aproximados: ${pendingMoney.toLocaleString("es-ES")} EUR.`
      : "Todavia no hay proyectos para valorar."
  };
}
