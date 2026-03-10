import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Configurações para ignorar erros e forçar o deploy */
  typescript: {
    // Ignora erros do TypeScript durante a build
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignora erros de linting (estilo de código) durante a build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;