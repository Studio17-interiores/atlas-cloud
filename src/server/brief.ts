export async function getTodayBrief() {
  return {
    title: "ATLAS Cloud preparado",
    message: "Conecta Supabase para que esta revisión use datos reales de Studio 17.",
    firstAction: "Configurar base de datos y migrar datos desde ATLAS local.",
    watch: "No uses la nube con datos sensibles hasta activar Auth, RLS y backups.",
    growth: "El siguiente paso es conectar proyectos, documentos y automatizaciones."
  };
}

