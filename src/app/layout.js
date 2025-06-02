// app/layout.js
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer";
import NavbarWrapper from "./components/NavbarWrapper";
import Header from "./components/Header"; // Importando o componente Header
import Head from "next/head"; // Note: 'Head' de 'next/head' é para Pages Router. Para App Router, meta tags vão no 'layout.js' diretamente ou 'metadata' export.

// Importe o PaymentProvider
import { PaymentProvider } from "./contexts/PaymentContext"; // Ajuste o caminho conforme a localização real do seu arquivo

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "eYe Monitor",
  description: "Monitoramento de sites 24hrs",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>
        {/* Envolva todo o conteúdo do body com o PaymentProvider */}
        <PaymentProvider>
          <div className="bg-[url('/assets/fundo.jpg')] bg-cover bg-center flex flex-col min-h-screen relative">
            {/* O componente Head de 'next/head' é mais comum no Pages Router.
                No App Router, as tags <title> e <meta description> já são gerenciadas pelo `metadata` export.
                Se você ainda usa Head para outras tags (ex: <link rel="icon">), ele precisa de "use client"
                em algum pai ou ser um componente client. O ideal é mover 'favicon.ico' para a pasta 'app' como 'favicon.ico'.
                Vou manter o Head aqui, mas saiba que ele se comporta de forma diferente no App Router.
            */}
            <Head>
              <title>{metadata.title}</title> {/* Usando o título do metadata */}
              <meta name="description" content={metadata.description} /> {/* Usando a descrição do metadata */}
              <link rel="icon" href="/favicon.ico" />
            </Head>

            {/* Logo no canto superior esquerdo */}
            <div className="absolute top-6 left-6 z-10">
              <img src="/assets/mwmLogo.png" alt="Logo" className="w-24 h-auto" />
            </div>

            {/* Header na parte superior */}
            <div className="z-20 relative">
              <Header />
            </div>

            {/* NavBar abaixo do Header (condicionalmente renderizada) */}
            <NavbarWrapper />

            {/* Logo central com opacidade reduzida */}
            <div className="absolute inset-0 flex items-center justify-center z-0">
              <img
                src="/assets/mwmLogo.png"
                alt="Logo Central"
                className="w-96 h-auto opacity-20"
              />
            </div>

            {/* Conteúdo principal (seus children) */}
            <main className="flex-grow z-10 relative">
              {children}
            </main>

            {/* Footer */}
            <div className="z-10 relative">
              <Footer />
            </div>
          </div>
        </PaymentProvider>
      </body>
    </html>
  );
}