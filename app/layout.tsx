import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// AQUI ESTÁ A MUDANÇA: Substituímos o título e adicionamos a imagem para o WhatsApp
export const metadata: Metadata = {
  title: "Chá Rifa do Benício 💙",
  description: "Venha celebrar a chegada do nosso pequeno e participar do nosso chá rifa!",
  openGraph: {
    title: "Chá Rifa do Benício 💙",
    description: "Escolha seu número e concorra a prêmios!",
    images: [
      {
        url: 'https://rifa-benicio.vercel.app/preview.png',
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br"> {/* Alterado de "en" para "pt-br" */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}