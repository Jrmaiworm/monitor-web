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
            
            
            {!usuario?.token && (
              <>
                 <NavDesktopItem 
              href="/" 
              label="INÍCIO" 
              icon={<FaHome />} 
              active={isActive('/')} 
            />
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
                  href="/home" 
                  label="HOME" 
                  icon={<FaHome />} 
                  active={isActive('/home')} 
                />
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
          
          {/* Botões de login/cadastro (desktop) */}
          <div className="hidden md:flex md:items-center md:space-x-2">
            {!usuario?.token ? (
              <>
                <Link 
                  href="/login" 
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive('/login') 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-blue-700 hover:bg-blue-50'
                  }`}
                >
                  <FaSignInAlt className="inline-block mr-1" /> Login
                </Link>
                <Link 
                  href="/crie-sua-conta" 
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
                >
                  <FaUserPlus className="inline-block mr-1" /> Cadastre-se
                </Link>
              </>
            ) : (
              <Link 
                href="/login" 
                onClick={() => {
                  localStorage.removeItem('user');
                  router.push('/');
                }}
                className="text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                <FaSignInAlt className="inline-block mr-1" /> Sair
              </Link>
            )}
          </div>
        </div>
      </div>
      
      {/* Menu mobile */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {!usuario?.token ? (
              <>
                <NavMobileItem 
                  href="/" 
                  label="INÍCIO" 
                  icon={<FaHome />} 
                  active={isActive('/')} 
                />
                <NavMobileItem 
                  href="/como-funciona" 
                  label="COMO FUNCIONA" 
                  icon={<FaInfoCircle />} 
                  active={isActive('/como-funciona')} 
                />
                <NavMobileItem 
                  href="/planos-de-assinatura" 
                  label="PLANOS DE ASSINATURA" 
                  icon={<FaTag />} 
                  active={isActive('/planos-de-assinatura')} 
                />
                <NavMobileItem 
                  href="/verificacao-rapida" 
                  label="VERIFICAÇÃO RÁPIDA" 
                  icon={<FaSearch />} 
                  active={isActive('/verificacao-rapida')} 
                />
                <div className="pt-4 pb-3 border-t border-gray-200">
                  <NavMobileItem 
                    href="/login" 
                    label="LOGIN" 
                    icon={<FaSignInAlt />} 
                    active={isActive('/login')} 
                  />
                  <NavMobileItem 
                    href="/crie-sua-conta" 
                    label="CADASTRE-SE" 
                    icon={<FaUserPlus />} 
                    active={isActive('/crie-sua-conta')} 
                  />
                </div>
              </>
            ) : (
              <>
                <NavMobileItem 
                  href="/home" 
                  label="HOME" 
                  icon={<FaHome />} 
                  active={isActive('/home')} 
                />
                <NavMobileItem 
                  href="/monitoramento-detalhado" 
                  label="MONITORAMENTO" 
                  icon={<FaChartLine />} 
                  active={isActive('/monitoramento-detalhado')} 
                />
                <NavMobileItem 
                  href="/meus-sites" 
                  label="MEUS SITES" 
                  icon={<FaServer />} 
                  active={isActive('/meus-sites')} 
                />
                <div className="pt-4 pb-3 border-t border-gray-200">
                  <NavMobileItem 
                    href="/login" 
                    label="SAIR" 
                    icon={<FaSignInAlt />} 
                    active={false}
                    onClick={() => {
                      localStorage.removeItem('user');
                      router.push('/');
                    }}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

const NavDesktopItem = ({ href, label, icon, active }) => {
  return (
    <Link 
      href={href} 
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
        active 
          ? 'bg-blue-100 text-blue-700' 
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      {icon} <span className="ml-2">{label}</span>
    </Link>
  );
};

const NavMobileItem = ({ href, label, icon, active, onClick }) => {
  return (
    <Link 
      href={href} 
      onClick={onClick}
      className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
        active 
          ? 'bg-blue-100 text-blue-700' 
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      {icon} <span className="ml-2">{label}</span>
    </Link>
  );
};

export default NavBar;