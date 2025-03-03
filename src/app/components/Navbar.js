"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link'; // Usar Link do Next.js

import { FaBars, FaTimes } from 'react-icons/fa'; // Ícones para o menu
import { useRouter } from 'next/navigation';

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false); // Estado para controlar se o menu está aberto ou fechado
  const [usuario, setUsuario] = useState(null); // Estado para guardar os dados do usuário
  const router = useRouter(); // Para navegação

  useEffect(() => {
    const usuarioData = localStorage.getItem("user");
    if (usuarioData) {
      const user = JSON.parse(usuarioData);
      setUsuario(user);
    }
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen); // Alterna entre aberto e fechado
  };

  const handleLogout = () => {
    // Limpar o localStorage e redirecionar para a página inicial
    localStorage.removeItem("user");
    setUsuario(null);
    router.push("/"); // Redireciona para a página inicial
  };

  return (
    <div className="bg-[#D9D9D9] shadow-md">
      <div className="flex justify-between items-center py-3 px-4">

        {/* Ícone do menu para telas pequenas */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-red-700 focus:outline-none">
            {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />} {/* Alterna entre o ícone de menu e o ícone de fechar */}
          </button>
        </div>

        {/* Links do menu para telas maiores */}
        <div className="hidden md:flex space-x-2 text-[#00295B] justify-between w-full">
        <NavItem label="HOME" href="/home" />
          {!usuario?.token && <NavItem label="INICIO" href="/" />}
          {!usuario?.token && (
            <>
              <NavItem label="CRIE SUA CONTA" href="/crie-sua-conta" />
              <NavItem label="COMO FUNCIONA" href="/como-funciona" />
              <NavItem label="PLANOS DE ASSINATURA" href="/planos-de-assinatura" />
              <NavItem label="VERIFICAÇÃO RÁPIDA" href="/verificacao-rapida" />
              <NavItem label="LOGIN" href="/login" />
            </>
          )}
          {usuario?.token && (
            <button onClick={handleLogout} className="text-[#00295B] border-l border-gray-300 px-4 cursor-pointer hover:text-red-900 transition-colors duration-300 font-bold">
              SAIR
            </button>
          )}
        </div>
      </div>

      {/* Menu dropdown para telas pequenas */}
      {menuOpen && (
        <div className="md:hidden flex flex-col items-center space-y-4 pb-4">
            <NavItem label="HOME" href="/home" />
          {!usuario?.token && <NavItem label="INICIO" href="/" />}
          {!usuario?.token && (
            <>
              <NavItem label="CRIE SUA CONTA" href="/crie-sua-conta" />
              <NavItem label="COMO FUNCIONA" href="/como-funciona" />
              <NavItem label="PLANOS DE ASSINATURA" href="/planos-de-assinatura" />
              <NavItem label="VERIFICAÇÃO RÁPIDA" href="/verificacao-rapida" />
              <NavItem label="LOGIN" href="/login" />
            </>
          )}
          {usuario?.token && (
            <button onClick={handleLogout} className="text-[#00295B] border-l border-gray-300 px-4 cursor-pointer hover:text-red-900 transition-colors duration-300 font-bold">
              SAIR
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const NavItem = ({ label, href }) => {
  return (
    <Link href={href}>
      <span className="text-[#00295B] border-l border-gray-300 px-4 cursor-pointer hover:text-red-900 transition-colors duration-300 font-bold">
        {label}
      </span>
    </Link>
  );
};

export default NavBar;
