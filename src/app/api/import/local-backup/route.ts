import { NextResponse } from "next/server";
import { z } from "zod";

const LocalBackupSchema = z.object({
  app: z.string().optional(),
  version: z.number().optional(),
  exportedAt: z.string().optional(),
  data: z.record(z.any()).or(z.any())
});

export async function POST(request: Request) {
  const payload = LocalBackupSchema.parse(await request.json());
  const data = "data" in payload ? payload.data : payload;

  return NextResponse.json({
    status: "validated",
    message: "Backup local válido. Conecta Supabase service role para insertar datos.",
    counts: {
      clients: data.clients?.length ?? 0,
      projects: data.projects?.length ?? 0,
      tasks: data.tasks?.length ?? 0,
      decisions: data.decisions?.length ?? 0,
      documents: data.projectDocuments?.length ?? 0,
      templates: data.templates?.length ?? 0
    }
  });
}

