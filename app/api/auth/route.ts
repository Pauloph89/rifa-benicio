import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { senha } = await req.json();
  const correta = process.env.ADMIN_PASSWORD;

  if (!correta) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  if (senha !== correta) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
