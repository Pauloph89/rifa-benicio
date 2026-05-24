import { NextResponse } from "next/server";
import { supabase } from "@/services/storage";

export async function GET() {
  const { error } = await supabase
    .from("participantes")
    .select("numero")
    .limit(1);

  if (error) {
    return NextResponse.json({ ok: false, erro: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, timestamp: new Date().toISOString() });
}
