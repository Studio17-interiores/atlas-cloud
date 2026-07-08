import { NextResponse } from "next/server";
import { describeSupabaseConfig } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(describeSupabaseConfig());
}

