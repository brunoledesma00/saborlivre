import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  // A propriedade 'base' é necessária APENAS para o deploy no GitHub Pages.
  // Se o seu repositório se chama 'meu-app-de-receitas', o valor seria '/meu-app-de-receitas/'.
  // Para a Vercel, esta linha não é necessária e pode ser removida ou comentada.
  // base: "/NOME_DO_SEU_REPOSITORIO/", 
  
  plugins: [react()],
  
  // A configuração de alias resolve os caminhos de importação.
  // O erro de build na Vercel geralmente acontece por uma inconsistência aqui.
  resolve: {
    alias: {
      // Garante que '@/' aponte para a raiz do projeto (onde está o App.tsx).
      "@": path.resolve(__dirname, "./"), 
    }
  }
})
