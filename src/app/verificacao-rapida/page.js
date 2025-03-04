"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { 
  FaCog, FaChartBar, FaHistory, FaChartLine, FaCheckCircle, 
  FaExclamationTriangle, FaTimesCircle, FaEllipsisV, FaPlus,
  FaExternalLinkAlt, FaFilter, FaCalendarAlt, FaClock, FaPlay,
  FaStop, FaDownload, FaGlobe, FaClock as FaClockSolid, FaBell
} from 'react-icons/fa';

Chart.register(...registerables);

// Card de Monitoramento (baseado no componente Monitoramento que você compartilhou)
const MonitoramentoCard = () => {
  const [url, setUrl] = useState('');
  const [interval, setInterval] = useState(5); // 5 minutos
  const [labels, setLabels] = useState([]);
  const [data, setData] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusClass, setStatusClass] = useState('');
  const [urlDisplayed, setUrlDisplayed] = useState('Nenhuma URL monitorada');
  const chartRef = useRef(null);
  const [intervalId, setIntervalId] = useState(null);
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.update();
    }
  }, [labels, data]);

  // Limitar o número de pontos de dados para melhor visualização
  useEffect(() => {
    if (labels.length > 20) {
      setLabels(prevLabels => prevLabels.slice(-20));
      setData(prevData => prevData.slice(-20));
    }
  }, [labels, data]);

  const checkPageStatus = () => {
    if (!url) {
      alert('Por favor, insira uma URL para monitorar.');
      return;
    }

    const now = new Date().toLocaleTimeString();
    
    // Adicionando http:// se não estiver presente
    let urlToCheck = url;
    if (!urlToCheck.startsWith('http://') && !urlToCheck.startsWith('https://')) {
      urlToCheck = 'https://' + urlToCheck;
    }

    fetch(urlToCheck, { method: 'GET', mode: 'no-cors' })
      .then(response => {
        if (response.ok || response.type === 'opaque') {
          setLabels(prevLabels => [...prevLabels, now]);
          setData(prevData => [...prevData, 1]);
          setStatusMessage(`A página está no ar. Última verificação: ${now}`);
          setStatusClass('bg-green-100 text-green-800 border border-green-200');
        } else {
          setLabels(prevLabels => [...prevLabels, now]);
          setData(prevData => [...prevData, 0]);
          setStatusMessage(`A página está fora do ar. Última verificação: ${now}`);
          setStatusClass('bg-red-100 text-red-800 border border-red-200');
        }
      })
      .catch(() => {
        setLabels(prevLabels => [...prevLabels, now]);
        setData(prevData => [...prevData, 0]);
        setStatusMessage(`Erro ao verificar a página. Última verificação: ${now}`);
        setStatusClass('bg-red-100 text-red-800 border border-red-200');
      });
  };

  const handleStartMonitoring = () => {
    if (isMonitoring) {
      clearInterval(intervalId);
      setIsMonitoring(false);
      setStatusMessage('Monitoramento parado.');
      setStatusClass('bg-yellow-100 text-yellow-800 border border-yellow-200');
    } else {
      clearInterval(intervalId);

      if (!url) {
        alert('Por favor, insira uma URL para monitorar.');
        return;
      }

      // Adicionando http:// se não estiver presente
      let urlToMonitor = url;
      if (!urlToMonitor.startsWith('http://') && !urlToMonitor.startsWith('https://')) {
        urlToMonitor = 'https://' + urlToMonitor;
        setUrl(urlToMonitor);
      }

      setUrlDisplayed(urlToMonitor);
      const intervalMinutes = interval || 5;
      const intervalMs = intervalMinutes * 60 * 1000;
      
      // Resetar dados para nova URL
      setLabels([]);
      setData([]);
      
      checkPageStatus();
      const newIntervalId = setInterval(checkPageStatus, intervalMs);
      setIntervalId(newIntervalId);
      setIsMonitoring(true);
    }
  };

  const handleExportGraph = () => {
    if (chartRef.current) {
      const link = document.createElement('a');
      link.href = chartRef.current.toBase64Image();
      link.download = 'status_chart.png';
      link.click();
    }
  };

  const chartData = {
    labels: labels,
    datasets: [{
      label: 'Status da Página',
      data: data,
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 1,
      fill: true,
      tension: 0.4
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: -0.1,
        max: 1.1,
        ticks: {
          callback: function(value) {
            if (value === 0) return "Offline";
            if (value === 1) return "Online";
            return "";
          }
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 transition-all hover:shadow-lg">
      <div className="p-5 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <FaGlobe className="text-blue-600 text-xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Monitoramento em Tempo Real</h3>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={handleExportGraph}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center bg-gray-50 py-1 px-2 rounded"
              disabled={!isMonitoring}
            >
              <FaDownload className="mr-1" size={12} />
              Exportar
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-grow">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="monitoringUrl">
              URL do Site
            </label>
            <div className="flex">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaGlobe className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="monitoringUrl"
                  placeholder="Ex: exemplo.com"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  disabled={isMonitoring}
                  className="text-gray-500 w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-32">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="monitoringInterval">
              Intervalo
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaClockSolid className="text-gray-400" />
              </div>
              <select
                id="monitoringInterval"
                value={interval}
                onChange={e => setInterval(parseInt(e.target.value))}
                disabled={isMonitoring}
                className="text-gray-500 w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="1">1 min</option>
                <option value="5">5 min</option>
                <option value="15">15 min</option>
                <option value="30">30 min</option>
                <option value="60">60 min</option>
              </select>
            </div>
          </div>
          
          <div className="w-full md:w-auto md:self-end">
            <button
              onClick={handleStartMonitoring}
              className={`w-full md:w-auto px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center ${
                isMonitoring 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isMonitoring ? (
                <>
                  <FaStop className="mr-2" /> Parar Monitoramento
                </>
              ) : (
                <>
                  <FaPlay className="mr-2" /> Iniciar Monitoramento
                </>
              )}
            </button>
          </div>
        </div>
        
        <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
          <div className="flex items-center">
            <FaGlobe className="text-gray-500 mr-2" />
            <span className="text-sm text-gray-500">URL monitorada:</span>
            <span className="text-gray-500 text-sm font-medium ml-2">{urlDisplayed}</span>
          </div>
        </div>
        
        <div className="h-64 mb-4">
          {labels.length > 0 ? (
            <Line data={chartData} options={chartOptions} ref={chartRef} />
          ) : (
            <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg border border-gray-100">
              <div className="text-center">
                <FaChartLine className="mx-auto text-gray-300 text-4xl mb-2" />
                <p className="text-gray-500">Nenhum dado disponível. Inicie o monitoramento para ver os resultados.</p>
              </div>
            </div>
          )}
        </div>
        
        {statusMessage && (
          <div className={`p-4 rounded-lg flex items-center ${statusClass}`}>
            {statusClass.includes('green') && <FaCheckCircle className="mr-2" />}
            {statusClass.includes('yellow') && <FaExclamationTriangle className="mr-2" />}
            {statusClass.includes('red') && <FaTimesCircle className="mr-2" />}
            {statusMessage}
          </div>
        )}
      </div>
    </div>
  );
};

// Componente para o Card de Estatísticas
const EstatisticasCard = () => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 transition-all hover:shadow-lg">
      <div className="p-5 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <FaChartBar className="text-purple-600 text-xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Estatísticas</h3>
          </div>
          <div className="text-sm text-gray-500 flex items-center">
            <FaCalendarAlt className="mr-1" />
            Últimos 30 dias
          </div>
        </div>
      </div>
      
      <div className="p-5">
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <div className="text-sm text-gray-500 mb-1">Tempo de Atividade</div>
            <div className="text-2xl font-bold text-gray-800">99.8%</div>
            <div className="mt-2 text-xs text-green-600 flex items-center">
              <FaCheckCircle className="mr-1" />
              0.2% maior que o mês anterior
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <div className="text-sm text-gray-500 mb-1">Tempo de Resposta</div>
            <div className="text-2xl font-bold text-gray-800">213ms</div>
            <div className="mt-2 text-xs text-red-600 flex items-center">
              <FaTimesCircle className="mr-1" />
              15ms mais lento que o mês anterior
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <div className="text-sm text-gray-500 mb-1">Interrupções</div>
            <div className="text-2xl font-bold text-gray-800">3</div>
            <div className="mt-2 text-xs text-green-600 flex items-center">
              <FaCheckCircle className="mr-1" />
              2 menos que o mês anterior
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <div className="text-sm text-gray-500 mb-1">Tempo de Inatividade</div>
            <div className="text-2xl font-bold text-gray-800">28min</div>
            <div className="mt-2 text-xs text-red-600 flex items-center">
              <FaTimesCircle className="mr-1" />
              10min mais que o mês anterior
            </div>
          </div>
        </div>
        
        <div className="mt-5 pt-4 border-t border-gray-100 flex justify-end">
          <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
            Ver relatório completo
            <FaExternalLinkAlt className="ml-1" size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente para o Card de Verificações Recentes
const VerificacoesRecentesCard = () => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 transition-all hover:shadow-lg">
      <div className="p-5 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <FaHistory className="text-green-600 text-xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Verificações Recentes</h3>
          </div>
          <div className="flex space-x-2">
            <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center bg-gray-50 py-1 px-2 rounded">
              <FaFilter className="mr-1" size={12} />
              Filtrar
            </button>
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              <FaEllipsisV />
            </button>
          </div>
        </div>
      </div>
      
      <div className="overflow-hidden">
        <div className="max-h-72 overflow-y-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tempo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    <FaCheckCircle className="mr-1" /> OK
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  https://exemplo.com
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  145ms
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <FaClock className="mr-1 text-gray-400" size={12} />
                    Agora mesmo
                  </div>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    <FaCheckCircle className="mr-1" /> OK
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  https://exemplo2.com
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  212ms
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <FaClock className="mr-1 text-gray-400" size={12} />
                    5 min atrás
                  </div>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    <FaExclamationTriangle className="mr-1" /> Lento
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  https://exemplo3.com
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  1245ms
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <FaClock className="mr-1 text-gray-400" size={12} />
                    15 min atrás
                  </div>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                    <FaTimesCircle className="mr-1" /> Falha
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  https://exemplo4.com
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  --
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <FaClock className="mr-1 text-gray-400" size={12} />
                    30 min atrás
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex justify-between items-center">
          <span className="text-sm text-gray-500">Mostrando 4 de 24 registros</span>
          <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
            Ver todos os registros
            <FaExternalLinkAlt className="ml-1" size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente para o Card de Configuração
const ConfiguracaoCard = () => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 transition-all hover:shadow-lg">
      <div className="p-5 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <FaCog className="text-blue-600 text-xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Configuração</h3>
          </div>
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <FaEllipsisV />
          </button>
        </div>
      </div>
      
      <div className="p-5">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notificações</label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">
                  E-mail para falhas
                </span>
              </label>
              
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Alertas no navegador
                </span>
              </label>
              
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Relatório semanal
                </span>
              </label>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contatos para alertas</label>
            <div className="space-y-2">
              <div className="flex items-center">
                <input 
                  type="email" 
                  placeholder="exemplo@email.com" 
                  className="flex-grow rounded-l-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button className="bg-blue-600 text-white px-3 py-2 rounded-r-lg hover:bg-blue-700 transition-colors">
                  <FaPlus size={12} />
                </button>
              </div>
              
              <div className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                <span className="text-sm text-gray-500">admin@exemplo.com</span>
                <button className="text-red-500 hover:text-red-700">
                  <FaTimesCircle size={14} />
                </button>
              </div>
            </div>
          </div>
          
          <div className="pt-3">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center">
              <FaBell className="mr-2" />
              Testar Notificações
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Página de Dashboard que usa todos os cards
const Dashboard = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard de Monitoramento</h1>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center">
            <FaPlus className="mr-2" /> Adicionar Site
          </button>
        </div>
        
        {/* Card principal de monitoramento expandido para largura total */}
        <div className="mb-8">
          <MonitoramentoCard />
        </div>
        
        {/* Cards secundários em grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <VerificacoesRecentesCard />
          </div>
          <div>
            <ConfiguracaoCard />
          </div>
          <div className="lg:col-span-3">
            <EstatisticasCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;