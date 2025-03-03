"use client"; // Marca o componente como Client Component

import React from 'react';



const Inicio = () => {
  return (
    <div className='w-full flex justify-center'> 
        <div className="bg-gray-100 p-6 rounded-lg shadow-md w-2/3 m-2">
          <h1 className="text-xl font-bold text-red-700 mb-4">
            Bem-vindo ao Site Monitor - Sistema de Monitoramento de sites
          </h1>
          <p className="mb-4 text-black">
            O Site Monitor é um sistema de monitoramento de sites que verifica se o seu site web está no ar, enviando e-mail para alertá-lo em caso de falha ou de retorno do serviço e gerando relatórios de desempenho.
          </p>
          <p className="mb-4 text-black">
            O Site Monitor monitora o seu site 24 horas por dia, 7 dias por semana, 365 dias por ano. E o plano básico é <strong>GRÁTIS.</strong> Monitoramento de sites é com o Site Monitor!
          </p>
          <p className="mb-4 text-red-700">
            Cadastre-se já e tenha todas as informações sobre o funcionamento do seu site.
          </p>
          <h2 className="text-lg font-bold text-gray-700 mb-4">
            Veja algumas imagens do monitoramento de sites feitos pelo Site Monitor:
          </h2>
          <div className="flex justify-between mb-4">
            <img src="/assets/img1.png" alt="Imagem 1" className="w-1/3 h-60 rounded-lg shadow-md" />
          
            <img src="/assets/img2.png" alt="Imagem 3" className="w-1/3 h-60 rounded-lg shadow-md" />
          </div>
          <p className="text-gray-700">
            Dúvidas? Saiba mais clicando <a href="/saiba-mais" className="text-red-700">aqui</a> ou <a href="/fale-conosco" className="text-red-700">fale conosco</a>.
          </p>
        </div>
      </div>
  );
};

export default Inicio;
