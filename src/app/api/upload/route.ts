import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth/session";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const BUCKET = "atlas-documents";

export async function POST(request: NextRequest) {
  const sessionSecret = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  const session = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value, sessionSecret);

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url), { status: 303 });
  }

  const form = await request.formData();
  const file = form.get("file");

  const redirect = String(form.get("redirect") ?? "/new");

  if (!(file instanceof File) || file.size === 0) {
    return redirectWithMessage(request, redirect, "error", "No has seleccionado ningun archivo.");
  }

  const supabase = createSupabaseAdminClient();
  const { data: organization } = await supabase
    .from("organizations")
    .select("id")
    .eq("slug", "studio-17")
    .maybeSingle();

  if (!organization) {
    return redirectWithMessage(request, redirect, "error", "No encuentro Studio 17.");
  }

  await supabase.storage.createBucket(BUCKET, { public: false }).catch(() => null);

  const kind = String(form.get("kind") ?? "document");
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const storagePath = `${kind}/${Date.now()}-${safeName}`;
  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(storagePath, file, {
    contentType: file.type || "application/octet-stream",
    upsert: false
  });

  if (uploadError) {
    return redirectWithMessage(request, redirect, "error", uploadError.message);
  }

  if (kind === "template") {
    await supabase.from("templates").insert({
      organization_id: organization.id,
      title: String(form.get("title") ?? file.name),
      type: String(form.get("type") ?? "template"),
      notes: String(form.get("notes") ?? ""),
      storage_path: storagePath,
      file_name: file.name
    });
  } else {
    await supabase.from("documents").insert({
      organization_id: organization.id,
      project_id: optional(String(form.get("project_id") ?? "")),
      title: String(form.get("title") ?? file.name),
      type: String(form.get("type") ?? "other"),
      status: "uploaded",
      storage_path: storagePath,
      file_name: file.name,
      file_size: file.size,
      mime_type: file.type
    });
  }

  return redirectWithMessage(request, redirect, "uploaded", "1");
}

function optional(value: string) {
  return value ? value : null;
}

function redirectWithMessage(request: NextRequest, path: string, key: string, value: string) {
  const url = new URL(path, request.url);
  url.searchParams.set(key, value);
  return NextResponse.redirect(url, { status: 303 });
}
