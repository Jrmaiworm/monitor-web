"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaServer, FaBell, FaChartLine, FaCheck, FaTimes, FaClock, FaExclamationTriangle, FaShieldAlt, FaGlobe, FaUserClock, FaInfoCircle, FaEnvelope } from 'react-icons/fa';
import api from '@/api/api';
const URL ="https://biomob-api.com:3202/monitor-status/"
 const MeusSites = () => {
  const [usuario, setUsuario] = useState(null);
  const [meusSites, setMeusSites] = useState([]);

  // Função para recuperar os dados do usuário do localStorage
  useEffect(() => {
    const usuarioData = localStorage.getItem('user');
    if (usuarioData) {
      setUsuario(JSON.parse(usuarioData));
      
    }
  }, []);

  useEffect(() => {
    if(usuario?.id !== undefined) {
    getSites();
    }
    
  }, [usuario]);

  async function getSites() {
    try {
      const response = await api.get(`${URL}${usuario?.id}`);
      
      // Já acessa os dados da resposta
      const data = response.data;
  
      // Atualiza o estado com os dados recebidos
      setMeusSites(data);
    } catch (error) {
      console.log('erro:', error);
    }
  };
  
 console.log('meussites', meusSites)

  // Função para exibir o status do site com a cor adequada
  const renderStatus = (status) => {
    switch (status) {
      case 'online':
        return (
          <span className="flex items-center text-green-600">
            <FaCheck className="mr-1" /> Online
          </span>
        );
      case 'issues':
        return (
          <span className="flex items-center text-yellow-600">
            <FaExclamationTriangle className="mr-1" /> Problemas
          </span>
        );
      case 'offline':
        return (
          <span className="flex items-center text-red-600">
            <FaTimes className="mr-1" /> Offline
          </span>
        );
      default:
        return (
          <span className="flex items-center text-gray-600">
            <FaClock className="mr-1" /> Desconhecido
          </span>
        );
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Status dos sites populares */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <FaGlobe className="mr-2 text-blue-600" /> Meus Sites
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {meusSites &&
            meusSites.map((site, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mb-4">
                  <FaGlobe className="text-blue-600 text-xl" />
                </div>
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-gray-900">{site.url}</h3>
                  {renderStatus(site.status)}
                </div>
                <p className="text-sm text-gray-500 mt-1">Uptime: {site.checked}</p>
              </div>
            ))}
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
            
            {/* Card 4 */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mb-4">
                <FaUserClock className="text-blue-600 text-xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Melhore a Experiência do Usuário</h3>
              <p className="text-gray-600">
                Garanta uma experiência consistente e confiável para seus visitantes, aumentando a satisfação e retenção de clientes.
              </p>
            </div>
            
            {/* Card 5 */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mb-4">
                <FaGlobe className="text-blue-600 text-xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Monitoramento Global</h3>
              <p className="text-gray-600">
                Verifique a disponibilidade do seu site a partir de diferentes regiões do mundo, garantindo acesso global sem problemas.
              </p>
            </div>
            
            {/* Card 6 */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mb-4">
                <FaEnvelope className="text-blue-600 text-xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Alertas por E-mail</h3>
              <p className="text-gray-600">
                Receba e-mails de alerta em caso de falha ou quando o serviço voltar ao normal, permitindo que você esteja sempre informado.
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
};

export default MeusSites;
