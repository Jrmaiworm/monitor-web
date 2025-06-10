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

// --- METADADOS OTIMIZADOS E ATUALIZADOS ---
export const metadata = {
  // 1. Título da Página (para a aba do navegador e resultados de busca)
  title: {
    default: "eYe Monitor | Monitoramento de Sites 24h e Uptime", // Título padrão
    template: "%s | eYe Monitor", // Sufixo para títulos de páginas específicas
  },
  // 2. Meta Descrição (resumo para resultados de busca)
  description: "Monitore o uptime dos seus sites e servidores 24 horas por dia. Receba alertas instantâneos de falhas por e-mail e WhatsApp. Mantenha seu negócio online e estável com eYe Monitor, uma criação da MWM Software.",
  // 3. Palavras-chave (ajudam a contextualizar)
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
    "MWM Software", // Adicionado "MWM Software"
  ],
  // 4. Canonical URL (ajuda a evitar conteúdo duplicado, importante para o domínio principal)
  metadataBase: new URL('https://www.eyemonitor.online'), // **SUBSTITUA PELO SEU DOMÍNIO REAL**
  alternates: {
    canonical: '/', // Define a raiz do seu site como a URL canônica padrão
  },
  // 5. Robots (diretivas para rastreadores de busca)
  robots: {
    index: true,
    follow: true,
    nocache: true, // Sugere aos buscadores que busquem a versão mais recente
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
    description: "Monitore o uptime dos seus sites e servidores 24 horas por dia. Receba alertas instantâneos de falhas por e-mail e WhatsApp. Mantenha seu negócio online e estável com eYe Monitor, uma criação da MWM Software.",
    url: "https://www.eyemonitor.online", // **SUBSTITUA PELA URL BASE DO SEU SITE**
    siteName: "eYe Monitor",
    images: [
      {
        url: "https://www.eyemonitor.online/assets/monitor.png", // **SUBSTITUA PELA URL DE UMA IMAGEM DE DESTAQUE (1200x630 pixels)**
        width: 1200,
        height: 630,
        alt: "eYe Monitor - Monitoramento de Sites 24 horas por MWM Software",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  // 7. Favicon
  icons: {
    icon: "/favicon.ico", // Seu favicon padrão
    shortcut: "/favicon-16x16.png", // Favicon para atalho (opcional)
    apple: "/apple-touch-icon.png", // Favicon para iOS (opcional)
  },
    verification: {
    google: 'google7531929f924b50c0', // SEU CÓDIGO DE VERIFICAÇÃO AQUI
  },
};
// --- FIM DOS METADADOS OTIMIZADOS E ATUALIZADOS ---


export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>
        <AuthProvider>
          <PaymentProvider>
            <div className="bg-[url('/assets/fundo.jpg')] bg-cover bg-center flex flex-col min-h-screen relative">
              <div className="absolute top-6 left-6 z-10">
                <Image
                  src="/assets/mwmLogo.png"
                  alt="eYe Monitor Logo, produto da MWM Software" // Alt text mais descritivo
                  width={96}
                  height={48}
                  className="w-24 h-auto"
                  priority
                />
              </div>

              <div className="z-20 relative">
                <Header />
              </div>

              <NavbarWrapper />

              <div className="absolute inset-0 flex items-center justify-center z-0">
                <Image
                  src="/assets/mwmLogo.png"
                  alt="Logo eYe Monitor de fundo com baixa opacidade" // Alt text mais descritivo para imagem de fundo
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