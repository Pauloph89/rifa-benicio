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

function origemPermitida(req: Request) {
  const origin = req.headers.get("origin") ?? "";
  const host = req.headers.get("host") ?? "";
  return (
    origin.includes("rifa-benicio.vercel.app") ||
    origin.includes("localhost") ||
    host.includes("localhost")
  );
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
  if (!origemPermitida(req)) {
    return NextResponse.json({ erro: "Não autorizado" }, { status: 403 });
  }

  const body = await req.json();

  if (!body.numero || !body.nome || !body.telefone) {
    return NextResponse.json({ erro: "Dados incompletos" }, { status: 400 });
  }

  const escolhas = lerArquivo();

  const jaExiste = escolhas.some((p: any) => p.numero === body.numero);
  if (jaExiste) {
    return NextResponse.json({ erro: "Número já reservado" }, { status: 409 });
  }

  escolhas.push(body);
  salvarArquivo(escolhas);

  return NextResponse.json({ ok: true });
}

/* =========================
   ATUALIZAR STATUS
========================= */
export async function PUT(req: Request) {
  if (!origemPermitida(req)) {
    return NextResponse.json({ erro: "Não autorizado" }, { status: 403 });
  }

  const body = await req.json();

  if (!body.numero || !body.status) {
    return NextResponse.json({ erro: "Dados incompletos" }, { status: 400 });
  }

  const escolhas = lerArquivo();

  const atualizadas = escolhas.map((p: any) =>
    p.numero === body.numero ? { ...p, status: body.status } : p
  );

  salvarArquivo(atualizadas);

  return NextResponse.json({ ok: true });
}
