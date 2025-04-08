import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer";
import NavbarWrapper from "./components/NavbarWrapper";
import Header from "./components/Header"; // Importando o componente Header
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "eYe Monitor",
  description: "Monitoramento de sites 24hrs",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>
        <div className="bg-[url('/assets/fundo.jpg')] bg-cover bg-center flex flex-col min-h-screen relative">
          <Head>
            <title>eYe</title>
            <meta name="description" content="Monitoramento de sites web" />
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

          {/* Conteúdo principal */}
          <main className="flex-grow z-10 relative">
            {children}
          </main>

          {/* Footer */}
          <div className="z-10 relative">
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}