import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer";
import NavBar from "./components/Navbar";
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
          <div className="pt-6 pl-6 z-10">
            <img src="/assets/mwmLogo.png" alt="Logo" className="w-24 h-auto" /> {/* Tamanho ajustável da logo */}
          </div>

          {/* Logo central */}
          <div className="absolute inset-0 flex items-center justify-center z-0">
            <img src="/assets/mwmLogo.png" alt="Logo Central" className="w-96 h-auto" /> {/* Tamanho maior para a logo central */}
          </div>

          {/* NavBar com z-index maior para estar clicável */}
          <div className="z-10 relative">
            <NavBar />
          </div>

          {/* Conteúdo principal */}
          <main className="flex-grow z-10 relative">
            {children} {/* Conteúdo principal das páginas */}
          </main>

          {/* Footer, se necessário */}
          {/* <Footer /> Rodapé aparecerá em todas as páginas */}
        </div>
      </body>
    </html>
  );
}
