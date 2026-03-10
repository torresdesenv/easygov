import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* O Next.js 16 gerencia o linting de forma diferente, 
     por isso removemos a chave 'eslint' daqui */
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;