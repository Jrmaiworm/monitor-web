"use client";

import React from 'react';
import { FaEnvelope, FaPhone, FaCode, FaCopyright } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-r from-blue-800 to-blue-600 text-white p-6 shadow-lg w-full">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Copyright e Informações da Empresa */}
          <div className="flex items-center space-x-2">
            <FaCopyright className="text-blue-200" />
            <div>
              <p className="font-bold">Copyright ©{currentYear} MWM Software Ltda</p>
              <p className="text-sm text-blue-200">Todos os direitos reservados</p>
            </div>
          </div>
          
          {/* Versão do Site */}
          <div className="flex flex-col items-center justify-center text-center">
            <div className="flex items-center space-x-2">
              <FaCode className="text-blue-200" />
              <p className="font-medium">Versão 1.0.0</p>
            </div>
            <p className="text-xs text-blue-200 mt-1">eYe Monitor - Sistema de Monitoramento</p>
          </div>

          {/* Informações de Contato */}
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <FaEnvelope className="text-blue-200" />
              <a 
                href="mailto:contato@mwmsoftware.com" 
                className="hover:text-blue-200 transition-colors duration-200"
              >
                contato@mwmsoftware.com
              </a>
            </div>
            <div className="flex items-center space-x-2">
              <FaPhone className="text-blue-200" />
              <a 
                href="tel:+5524992657238" 
                className="hover:text-blue-200 transition-colors duration-200"
              >
                +55 (24) 99265-7238
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;