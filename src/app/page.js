"use client";

import React from 'react';
import Link from 'next/link';
import { FaServer, FaBell, FaChartLine, FaCheck, FaTimes, FaClock, FaExclamationTriangle, FaShieldAlt, FaGlobe, FaUserClock, FaInfoCircle, FaEnvelope } from 'react-icons/fa';

export default function Inicio() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-600 rounded-xl shadow-lg p-8 mb-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Bem-vindo ao eYe Monitor
            </h1>
            
            <p className="mb-6 text-white opacity-90">
              O eYe Monitor verifica se o seu site web está no ar, enviando e-mail e notificação via whatsapp para alertá-lo em caso de falha ou de retorno do serviço e gerando relatórios de desempenho.
            </p>
            
            <p className="text-lg text-white opacity-90 mb-8 max-w-3xl mx-auto">
              Monitore a disponibilidade dos seus sites <strong>24 horas por dia, 7 dias por semana, 365 dias por ano</strong>. 
           
            </p>
          </div>
        </div>
        
        {/* Status dos sites populares */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <FaGlobe className="mr-2 text-blue-600" /> Status de Sites Populares
          </h2>
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
              {[
                { nome: 'Google', status: 'online', uptime: '99.9%' },
                { nome: 'Facebook', status: 'online', uptime: '99.7%' },
                { nome: 'Instagram', status: 'online', uptime: '99.5%' },
                { nome: 'Twitter', status: 'issues', uptime: '95.2%' },
                { nome: 'WhatsApp', status: 'online', uptime: '99.8%' },
                { nome: 'Netflix', status: 'online', uptime: '99.6%' },
              ].map((site, index) => (
                <div key={index} className="p-4 hover:bg-gray-50 transition-colors duration-150">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-gray-900">{site.nome}</h3>
                    {site.status === 'online' ? (
                      <span className="flex items-center text-green-600">
                        <FaCheck className="mr-1" /> Online
                      </span>
                    ) : site.status === 'issues' ? (
                      <span className="flex items-center text-yellow-600">
                        <FaExclamationTriangle className="mr-1" /> Problemas
                      </span>
                    ) : (
                      <span className="flex items-center text-red-600">
                        <FaTimes className="mr-1" /> Offline
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Uptime: {site.uptime}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Benefícios e Recursos */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <FaShieldAlt className="mr-2 text-blue-600" /> Por que Monitorar Seu Site?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mb-4">
                <FaServer className="text-blue-600 text-xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Detecção Rápida de Problemas</h3>
              <p className="text-gray-600">
                Identifique problemas de desempenho e disponibilidade assim que eles ocorrem, antes que seus usuários sejam afetados.
              </p>
            </div>
            
            {/* Card 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mb-4">
                <FaBell className="text-blue-600 text-xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Alertas em Tempo Real</h3>
              <p className="text-gray-600">
                Receba notificações instantâneas quando seu site apresentar problemas ou ficar fora do ar, permitindo ação rápida.
              </p>
            </div>
            
            {/* Card 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mb-4">
                <FaChartLine className="text-blue-600 text-xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Análise de Desempenho</h3>
              <p className="text-gray-600">
                Visualize relatórios detalhados sobre o desempenho do seu site ao longo do tempo, identificando tendências e áreas para melhorias.
              </p>
            </div>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-blue-800 mb-4">Pronto para garantir a disponibilidade do seu site?</h2>
          <p className="text-lg text-blue-700 mb-6">
            Comece a monitorar seu site agora e nunca mais seja pego de surpresa por problemas de disponibilidade.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/crie-sua-conta" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200">
              Cadastre-se Agora
            </Link>
            <Link href="/fale-conosco" className="bg-white hover:bg-gray-50 text-blue-600 border border-blue-200 font-bold py-3 px-8 rounded-lg transition-colors duration-200">
              Fale Conosco
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}