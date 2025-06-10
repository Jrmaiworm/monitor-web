// app/layout.js
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer";
import NavbarWrapper from "./components/NavbarWrapper";
import Header from "./components/Header";

// Importe o PaymentProvider
import { PaymentProvider } from "./contexts/PaymentContext";
// Importe o AuthProvider
import { AuthProvider } from "./contexts/AuthContext";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

// --- METADADOS OTIMIZADOS ---
export const metadata = {
  // 1. Título da Página (para a aba do navegador e resultados de busca)
  title: {
    default: "eYe Monitor | Monitoramento de Sites 24h e Uptime", // Título padrão para todas as páginas
    template: "%s | eYe Monitor", // Sufixo para títulos de páginas específicas
  },
  // 2. Meta Descrição (resumo para resultados de busca)
  description: "Monitore o uptime dos seus sites e servidores 24 horas por dia. Receba alertas instantâneos de falhas por e-mail e WhatsApp. Mantenha seu negócio online com eYe Monitor.",
  // 3. Palavras-chave (ajudam a contextualizar, mas menos impacto direto no ranking)
  keywords: [
    "monitoramento de sites",
    "uptime",
    "servidores online",
    "alertas de site",
    "monitoramento 24h",
    "status do site",
    "performance web",
    "eYe Monitor",
    "monitorar site",
  ],
  // 4. Canonical URL (ajuda a evitar conteúdo duplicado, importante para o domínio principal)
  metadataBase: new URL('https://www.eyemonitor.com.br'), // Substitua pelo seu domínio real
  alternates: {
    canonical: '/', // Define a raiz do seu site como a URL canônica padrão
  },
  // 5. Robots (diretivas para rastreadores de busca)
  robots: {
    index: true,
    follow: true,
    nocache: true, // Recomendo usar 'true' se você quer que os buscadores sempre busquem a versão mais recente
    googleBot: {
      index: true,
      follow: true,
      noimageindex: true,
      'max-video-preview': -1,
      'max-snippet': -1,
    },
  },
  // 6. Open Graph (para compartilhamento em redes sociais como Facebook, LinkedIn, WhatsApp)
  openGraph: {
    title: "eYe Monitor | Monitoramento de Sites 24h e Uptime",
    description: "Monitore o uptime dos seus sites e servidores 24 horas por dia. Receba alertas instantâneos de falhas por e-mail e WhatsApp. Mantenha seu negócio online com eYe Monitor.",
    url: "https://www.eyemonitor.com.br", // URL base do seu site
    siteName: "eYe Monitor",
    images: [
      {
        url: "https://www.eyemonitor.com.br/assets/og-image.jpg", // Substitua pela URL de uma imagem de destaque (recomendado 1200x630 pixels)
        width: 1200,
        height: 630,
        alt: "eYe Monitor - Monitoramento de Sites",
      },
      // Você pode adicionar mais imagens aqui se quiser
    ],
    locale: "pt_BR",
    type: "website",
  },
  // 7. Twitter Cards (para compartilhamento no Twitter)
  twitter: {
    card: "summary_large_image", // Tipo de card, 'summary_large_image' é o mais comum e visual
    site: "@eYeMonitor", // Se tiver uma conta no Twitter, coloque o handle aqui
    creator: "@eYeMonitor", // Se tiver um criador específico
    title: "eYe Monitor | Monitoramento de Sites e Uptime",
    description: "Monitore o uptime dos seus sites e servidores 24 horas por dia. Receba alertas instantâneos de falhas. Mantenha seu negócio online com eYe Monitor.",
    images: ["https://www.eyemonitor.com.br/assets/twitter-image.jpg"], // Imagem específica para Twitter (recomendado 1200x675)
  },
  // 8. Favicon
  icons: {
    icon: "/favicon.ico", // Seu favicon padrão
    shortcut: "/favicon-16x16.png", // Favicon para atalho (opcional)
    apple: "/apple-touch-icon.png", // Favicon para iOS (opcional)
  },
};
// --- FIM DOS METADADOS OTIMIZADOS ---


export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>
        <AuthProvider>
          <PaymentProvider>
            <div className="bg-[url('/assets/fundo.jpg')] bg-cover bg-center flex flex-col min-h-screen relative">
              {/* O componente Head de next/head não é o padrão para App Router
                  Para meta tags no App Router, use o 'metadata' export ou defina-as diretamente no elemento <head> dentro de <html>
              */}
              {/* Você removeu o <Head> do next/head, o que está correto para o App Router.
                  Os metadados definidos acima serão automaticamente injetados no <head> da página. */}

              <div className="absolute top-6 left-6 z-10">
                <Image
                  src="/assets/mwmLogo.png"
                  alt="eYe Monitor Logo" // Alt text mais descritivo
                  width={96}
                  height={48}
                  className="w-24 h-auto"
                  priority // Adicionado para carregar a logo principal mais rápido
                />
              </div>

              <div className="z-20 relative">
                <Header />
              </div>

              <NavbarWrapper />

              <div className="absolute inset-0 flex items-center justify-center z-0">
                <Image
                  src="/assets/mwmLogo.png"
                  alt="eYe Monitor Fundo" // Alt text mais descritivo
                  width={384}
                  height={192}
                  className="w-96 h-auto opacity-20"
                />
              </div>

              <main className="flex-grow z-10 relative">
                {children}
              </main>

              <div className="z-10 relative">
                <Footer />
              </div>
            </div>
          </PaymentProvider>
        </AuthProvider>
      </body>
    </html>
  );
}