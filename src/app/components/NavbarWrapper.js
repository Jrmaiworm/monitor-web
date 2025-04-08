"use client";

import React, { useState, useEffect } from 'react';
import NavBar from './Navbar';

const NavbarWrapper = () => {
  const [usuario, setUsuario] = useState(null);
  const [isClient, setIsClient] = useState(false);

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

  // Se não estamos no client ainda ou se o usuário estiver logado, não mostramos a NavBar
  if (!isClient || usuario?.token) {
    return null;
  }

  // Se o usuário não estiver logado, mostramos a NavBar
  return (
    <div className="z-20 relative">
      <NavBar />
    </div>
  );
};

export default NavbarWrapper; 