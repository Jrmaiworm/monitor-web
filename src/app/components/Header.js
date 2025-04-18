"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaEye, FaUser, FaSignOutAlt } from 'react-icons/fa';

const Header = () => {
  const [usuario, setUsuario] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  // Primeiro useEffect para marcar quando o componente está rodando no client-side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Segundo useEffect para carregar os dados do usuário
  useEffect(() => {
    // Verificar se estamos no client e se localStorage está disponível
    if (typeof window !== 'undefined') {
      const checkUserData = () => {
        const usuarioData = localStorage.getItem('user');
        if (usuarioData) {
          try {
            setUsuario(JSON.parse(usuarioData));
          } catch (error) {
            console.error("Erro ao analisar dados do usuário:", error);
            localStorage.removeItem('user');
          }
        } else {
          setUsuario(null);
        }
      };

      // Verificar imediatamente
      checkUserData();

      // Configurar um listener para alterações no localStorage
      window.addEventListener('storage', checkUserData);

      // Verificar periodicamente (como fallback)
      const interval = setInterval(checkUserData, 2000);

      return () => {
        window.removeEventListener('storage', checkUserData);
        clearInterval(interval);
      };
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUsuario(null);
    
    try {
      router.push('/');
      window.reload()
    } catch (error) {
      window.location.href = '/';
    }
  };

  // Se não estamos no client ainda, não mostramos nada ou mostramos um placeholder
  if (!isClient) {
    return (
      <header className="bg-gradient-to-r from-blue-800 to-blue-600 py-4 px-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo e Nome */}
          <div className="flex items-center">
            <div className="bg-white p-2 rounded-full shadow-md mr-3">
              <FaEye className="text-blue-600 text-2xl" />
            </div>
            <div className="text-white">
              <h1 className="text-2xl font-bold leading-tight">eYe</h1>
              <p className="text-sm text-blue-100 -mt-1">Monitoramento</p>
            </div>
          </div>
          <div className="w-24"></div> {/* Placeholder para evitar layout shift */}
        </div>
      </header>
    );
  }

  return (
    <header className="bg-gradient-to-r from-blue-800 to-blue-600 py-4 px-6 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo e Nome */}
        <Link href="" className="flex items-center">
          <div className="bg-white p-2 rounded-full shadow-md mr-3">
            <FaEye className="text-blue-600 text-2xl" />
          </div>
          <div className="text-white">
            <h1 className="text-2xl font-bold leading-tight">eYe</h1>
            <p className="text-sm text-blue-100 -mt-1">Monitoramento</p>
          </div>
        </Link>

        {/* Área do Usuário */}
        <div className="flex items-center">
          {usuario ? (
            <div className="flex items-center space-x-4">
              <div className="text-white text-right hidden md:block">
                <p className="font-medium">{usuario.nome}</p>
                <p className="text-sm text-blue-100">{usuario.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-white text-blue-700 hover:bg-blue-50 px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 flex items-center"
              >
                <FaSignOutAlt className="mr-1" /> Sair
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
         
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;