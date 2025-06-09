// app/layout.js
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer";
import NavbarWrapper from "./components/NavbarWrapper";
import Header from "./components/Header";
// Note: 'Head' de 'next/head' é para Pages Router. Para App Router, meta tags vão no 'layout.js' diretamente ou 'metadata' export.
// Você pode remover a importação de Head se não estiver usando o Pages Router, e colocar as meta tags diretamente no 'metadata' export ou dentro de <head> no <html>
// import Head from "next/head"; // Esta linha pode ser removida se não for usada para Pages Router

// Importe o PaymentProvider
import { PaymentProvider } from "./contexts/PaymentContext"; // Ajuste o caminho conforme a localização real do seu arquivo

// Importe o AuthProvider
import { AuthProvider } from "./contexts/AuthContext"; // Certifique-se de que o caminho está correto

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
                <Image src="/assets/mwmLogo.png" alt="Logo" className="w-24 h-auto" />
              </div>

              <div className="z-20 relative">
                <Header />
              </div>

              <NavbarWrapper />

              <div className="absolute inset-0 flex items-center justify-center z-0">
                <Image
                  src="/assets/mwmLogo.png"
                  alt="Logo Central"
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