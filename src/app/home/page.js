"use client"; // Marca o componente como Client Component


import React, { useEffect, useState } from 'react';


const Home = () => {
  const [usuario, setUsuario] = useState(null); // Estado para armazenar os dados do usuário

  // Função para recuperar os dados do usuário do localStorage
  useEffect(() => {
    const usuarioData = localStorage.getItem('user');
    if (usuarioData) {
      setUsuario(JSON.parse(usuarioData)); // Define o estado com os dados do usuário recuperados
    }
  }, []);

  return (
    <div>
    

      
      <div className='w-full justify-center flex mt-8'>
        <div className="bg-gray-100 p-6 rounded-lg shadow-md w-4/5 m-2">
          <h1 className="text-2xl font-bold text-red-700 mb-4 text-center">Bem-vindo ao Site Monitor</h1>

          {/* Exibe as informações do usuário logado, se disponível */}
          {usuario ? (
            <div className="mb-6 text-center text-gray-700">
              <p>Bem-vindo, <strong>{usuario.nome}</strong>!</p>
              <p>Email: {usuario.email}</p>
            </div>
          ) : (
            <p className="mb-6 text-center text-gray-700">Carregando informações do usuário...</p>
          )}

          <p className="mb-6 text-center text-gray-700">
            O Site Monitor oferece serviços de monitoramento de sites web, proporcionando insights em tempo real sobre a disponibilidade, tempo de resposta e desempenho do seu site.
          </p>

          <div className="flex justify-center mb-4">
            {/* <a href="/verifica" className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2">
              Verificação Rápida
            </a> */}
            <a href="/monitoramento-detalhado" className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
              Monitoramento Detalhado
            </a>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Por que Monitorar Seu Site?</h2>
            <ul className="list-disc list-inside mb-6 text-gray-700">
              <li>Identifique problemas de desempenho rapidamente.</li>
              <li>Melhore a experiência do usuário.</li>
              <li>Garanta que seu site esteja sempre disponível.</li>
              <li>Receba alertas em tempo real sobre falhas ou downtime.</li>
            </ul>
            
            <p className="text-gray-700">
              Nosso serviço oferece uma solução completa de monitoramento, ajudando você a manter seu site funcionando perfeitamente e garantindo a satisfação dos seus visitantes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
