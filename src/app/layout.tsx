import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EasyGov - Easylan",
  description: "Consultor Virtual de Governança e Segurança",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body className="antialiased">{children}</body>
    </html>
  );
}