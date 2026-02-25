import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "escolhas.json");

function lerArquivo() {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function salvarArquivo(dados: any) {
  fs.writeFileSync(filePath, JSON.stringify(dados, null, 2));
}

/* =========================
   BUSCAR PARTICIPANTES
========================= */
export async function GET() {
  const escolhas = lerArquivo();
  return NextResponse.json(escolhas);
}

/* =========================
   SALVAR NOVA ESCOLHA
========================= */
export async function POST(req: Request) {
  const body = await req.json();

  const escolhas = lerArquivo();

  escolhas.push(body);

  salvarArquivo(escolhas);

  return NextResponse.json({ ok: true });
}

/* =========================
   ATUALIZAR STATUS
========================= */
export async function PUT(req: Request) {
  const body = await req.json();

  const escolhas = lerArquivo();

  const atualizadas = escolhas.map((p: any) =>
    p.numero === body.numero ? { ...p, status: body.status } : p
  );

  salvarArquivo(atualizadas);

  return NextResponse.json({ ok: true });
}