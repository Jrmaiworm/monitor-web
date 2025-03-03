"use client"; // Marca o componente como Client Component

import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 p-4 mt-8  shadow-md w-full">
      <div className="flex justify-between items-center text-gray-500">
        {/* Nome da Empresa */}
        <div>
          <p className="font-bold">Copyright ©2024 MWM2 Software Ltda</p>
          {/* <p>Todos os direitos reservados © {new Date().getFullYear()}</p> */}
        </div>
        
        {/* Versão do Site */}
        <div className="text-sm">
          <p>Versão 1.0.0</p>
        </div>

        {/* Informações de Contato */}
        <div className="text-sm">
          <p>
            Contato: <a href="mailto:contato@mwmsystems.com" className="text-gray-500">contato@mwm2systems.com</a>
          </p>
          <p>
            Telefone: <a href="tel:+5511999999999" className="text-gray-500">+55 (11) 99999-9999</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
