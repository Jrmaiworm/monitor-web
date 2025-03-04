"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { 
  FaBars, 
  FaTimes, 
  FaHome, 
  FaUserPlus, 
  FaInfoCircle, 
  FaTag, 
  FaSearch, 
  FaSignInAlt,
  FaChartLine,
  FaServer
} from 'react-icons/fa';

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const usuarioData = localStorage.getItem("user");
    if (usuarioData) {
      const user = JSON.parse(usuarioData);
      setUsuario(user);
    }
  }, []);

  // Fecha o menu quando a rota muda (útil para mobile)
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Verifica se um link está ativo
  const isActive = (href) => {
    return pathname === href;
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo e botão de menu mobile */}
          <div className="flex items-center md:hidden">
            <button 
              onClick={toggleMenu} 
              className="text-blue-700 p-2 rounded-md hover:bg-blue-50 focus:outline-none"
              aria-label="Menu principal"
            >
              {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
          
          {/* Links de navegação (desktop) */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            <NavDesktopItem 
              href="/home" 
              label="HOME" 
              icon={<FaHome />} 
              active={isActive('/home')} 
            />
            
            {!usuario?.token && (
              <>
                <NavDesktopItem 
                  href="/como-funciona" 
                  label="COMO FUNCIONA" 
                  icon={<FaInfoCircle />} 
                  active={isActive('/como-funciona')} 
                />
                <NavDesktopItem 
                  href="/planos-de-assinatura" 
                  label="PLANOS DE ASSINATURA" 
                  icon={<FaTag />} 
                  active={isActive('/planos-de-assinatura')} 
                />
                <NavDesktopItem 
                  href="/verificacao-rapida" 
                  label="VERIFICAÇÃO RÁPIDA" 
                  icon={<FaSearch />} 
                  active={isActive('/verificacao-rapida')} 
                />
              </>
            )}
            
            {usuario?.token && (
              <>
                <NavDesktopItem 
                  href="/monitoramento-detalhado" 
                  label="MONITORAMENTO" 
                  icon={<FaChartLine />} 
                  active={isActive('/monitoramento-detalhado')} 
                />
                <NavDesktopItem 
                  href="/meus-sites" 
                  label="MEUS SITES" 
                  icon={<FaServer />} 
                  active={isActive('/meus-sites')} 
                />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      <div className={`md:hidden ${menuOpen ? 'block' : 'hidden'}`}>
        <div className="pt-2 pb-4 space-y-1 bg-white border-t border-gray-200">
          <NavMobileItem 
            href="/home" 
            label="Home" 
            icon={<FaHome />} 
            active={isActive('/home')} 
          />
          
          {!usuario?.token && (
            <>
              <NavMobileItem 
                href="/crie-sua-conta" 
                label="Criar Conta" 
                icon={<FaUserPlus />} 
                active={isActive('/crie-sua-conta')} 
              />
              <NavMobileItem 
                href="/como-funciona" 
                label="Como Funciona" 
                icon={<FaInfoCircle />} 
                active={isActive('/como-funciona')} 
              />
              <NavMobileItem 
                href="/planos-de-assinatura" 
                label="Planos de Assinatura" 
                icon={<FaTag />} 
                active={isActive('/planos-de-assinatura')} 
              />
              <NavMobileItem 
                href="/verificacao-rapida" 
                label="Verificação Rápida" 
                icon={<FaSearch />} 
                active={isActive('/verificacao-rapida')} 
              />
              <NavMobileItem 
                href="/login" 
                label="Login" 
                icon={<FaSignInAlt />} 
                active={isActive('/login')} 
              />
            </>
          )}
          
          {usuario?.token && (
            <>
              <NavMobileItem 
                href="/monitoramento-detalhado" 
                label="Monitoramento" 
                icon={<FaChartLine />} 
                active={isActive('/monitoramento-detalhado')} 
              />
              <NavMobileItem 
                href="/meus-sites" 
                label="Meus Sites" 
                icon={<FaServer />} 
                active={isActive('/meus-sites')} 
              />
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

// Componente para itens de navegação desktop
const NavDesktopItem = ({ href, label, icon, active }) => {
  return (
    <Link 
      href={href}
      className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
        active 
          ? 'text-blue-700 bg-blue-50' 
          : 'text-gray-700 hover:text-blue-700 hover:bg-gray-50'
      }`}
    >
      <span className="mr-1">{icon}</span>
      {label}
    </Link>
  );
};

// Componente para itens de navegação mobile
const NavMobileItem = ({ href, label, icon, active }) => {
  return (
    <Link 
      href={href}
      className={`flex items-center px-4 py-3 text-base font-medium ${
        active 
          ? 'text-blue-700 bg-blue-50' 
          : 'text-gray-700 hover:text-blue-700 hover:bg-gray-50'
      }`}
    >
      <span className="mr-3">{icon}</span>
      {label}
    </Link>
  );
};

export default NavBar;