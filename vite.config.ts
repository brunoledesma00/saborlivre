import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from "node:url"

// https://vitejs.dev/config/
export default defineConfig({
  // A propriedade 'base' é necessária APENAS para o deploy no GitHub Pages.
  // Para a Vercel, esta linha não é necessária.
  // base: "/NOME_DO_SEU_REPOSITORIO/", 
  
  plugins: [react()],
  
  // A configuração de alias resolve os caminhos de importação.
  // Usar 'import.meta.url' é a abordagem moderna e mais segura para garantir
  // que os caminhos funcionem em qualquer ambiente de build.
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
    }
  }
})
