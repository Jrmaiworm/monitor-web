// components/HeroSection.js
import React from 'react';

const HeroSection = ({ usuario }) => (
  <div className="bg-gradient-to-r from-blue-800 to-blue-600 rounded-xl shadow-lg p-8 mb-8">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-white mb-4">
        Monitoramento Detalhado
      </h1>
      {usuario ? (
        <div className="mb-4 text-white">
          <p className="text-lg">
            Bem-vindo, <strong>{usuario.nome || 'Usuário'}</strong>!
          </p>
          <p className="text-sm opacity-80">{usuario.email}</p>
          <p className="text-sm opacity-80">Plano {usuario.plano}</p>
        </div>
      ) : (
        <p className="mb-4 text-white opacity-90">
          Carregando informações do usuário...
        </p>
      )}
      <p className="text-lg text-white opacity-90 mb-4 max-w-3xl mx-auto">
        Gerencie e monitore seus sites em tempo real, receba alertas e visualize estatísticas detalhadas.
      </p>
    </div>
  </div>
);

export default HeroSection;