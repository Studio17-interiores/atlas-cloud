import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth/session";
import { getStudio17Data } from "@/server/studio17-data";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const sessionSecret = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  const session = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value, sessionSecret);

  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const data = await getStudio17Data();
  return NextResponse.json({
    app: "ATLAS Cloud",
    studio: "Studio 17",
    exportedAt: new Date().toISOString(),
    data
  });
}
