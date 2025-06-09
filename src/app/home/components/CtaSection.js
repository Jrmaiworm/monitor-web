// components/CtaSection.js
import React from 'react';

const CtaSection = () => (
  <div className="bg-blue-50 border border-blue-100 rounded-lg p-8 text-center">
    <h2 className="text-2xl font-bold text-blue-800 mb-4">
      Precisa monitorar mais sites?
    </h2>
    <p className="text-lg text-blue-700 mb-6">
      Conheça nossos planos avançados e monitore múltiplos sites com intervalos
      de verificação mais curtos.
    </p>
    <div className="flex flex-col sm:flex-row justify-center gap-4">
      <a
        href="/planos-de-assinatura"
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200"
      >
        Ver Planos
      </a>
      <a
        href="/fale-conosco"
        className="bg-white hover:bg-gray-50 text-blue-600 border border-blue-200 font-bold py-3 px-8 rounded-lg transition-colors duration-200"
      >
        Fale Conosco
      </a>
    </div>
  </div>
);

export default CtaSection;