// app/layout.js
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer";
import NavbarWrapper from "./components/NavbarWrapper";
import Header from "./components/Header";

// Importe o PaymentProvider
import { PaymentProvider } from "./contexts/PaymentContext"; // Ajuste o caminho conforme a localização real do seu arquivo

// Importe o AuthProvider
import { AuthProvider } from "./contexts/AuthContext"; // Certifique-se de que o caminho está correto
import Image from "next/image"; // Componente Image do Next.js

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "eYe Monitor",
  description: "Monitoramento de sites 24hrs",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>
        {/* Envolva toda a aplicação com AuthProvider */}
        <AuthProvider>
          <PaymentProvider>
            <div className="bg-[url('/assets/fundo.jpg')] bg-cover bg-center flex flex-col min-h-screen relative">
              {/* O componente Head de next/head não é o padrão para App Router
                  Para meta tags no App Router, use o 'metadata' export ou defina-as diretamente no elemento <head> dentro de <html>
              */}
              {/* <Head>
                <title>{metadata.title}</title>
                <meta name="description" content={metadata.description} />
                <link rel="icon" href="/favicon.ico" />
              </Head> */}

              <div className="absolute top-6 left-6 z-10">
                {/* CORREÇÃO AQUI: Adicionado width e height */}
                <Image
                  src="/assets/mwmLogo.png"
                  alt="Logo"
                  width={96} // Exemplo: se w-24 é 96px, use 96. Ajuste para a largura real.
                  height={48} // Exemplo: calcule a altura proporcional ou use a altura real do arquivo.
                  className="w-24 h-auto"
                />
              </div>

              <div className="z-20 relative">
                <Header />
              </div>

              <NavbarWrapper />

              <div className="absolute inset-0 flex items-center justify-center z-0">
                {/* CORREÇÃO AQUI: Adicionado width e height */}
                <Image
                  src="/assets/mwmLogo.png"
                  alt="Logo Central"
                  width={384} // Exemplo: se w-96 é 384px, use 384. Ajuste para a largura real.
                  height={192} // Exemplo: calcule a altura proporcional ou use a altura real do arquivo.
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