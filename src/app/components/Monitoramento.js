"use client"
import React, { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { Line } from 'react-chartjs-2';

Chart.register(...registerables);

export default function Monitoramento() {
  const [url, setUrl] = useState('');
  const [interval, setInterval] = useState(5); // Em minutos
  const [labels, setLabels] = useState([]);
  const [data, setData] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusClass, setStatusClass] = useState('bg-gray-200');
  const [urlDisplayed, setUrlDisplayed] = useState('Nenhuma URL monitorada');
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [uptime, setUptime] = useState(100);
  const [lastChecks, setLastChecks] = useState([]);
  const [responseTime, setResponseTime] = useState(0);
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.update();
    }
  }, [labels, data]);

  const calculateUptime = (statusData) => {
    if (statusData.length === 0) return 100;
    const upChecks = statusData.filter(s => s === 1).length;
    return Math.round((upChecks / statusData.length) * 100);
  };

  const checkPageStatus = async () => {
    if (!url) {
      alert('Por favor, insira uma URL para monitorar.');
      return;
    }

    const startTime = Date.now();
    try {
      const response = await fetch(url, { method: 'GET', mode: 'no-cors' });
      const endTime = Date.now();
      const latency = endTime - startTime;
      setResponseTime(latency);
      
      const now = new Date();
      const timeString = now.toLocaleTimeString();
      const dateString = now.toLocaleDateString();
      
      if (response.ok || response.type === 'opaque') {
        setLabels(prevLabels => [...prevLabels, timeString]);
        setData(prevData => {
          const newData = [...prevData, 1];
          setUptime(calculateUptime(newData));
          return newData;
        });
        
        setLastChecks(prev => {
          const newChecks = [
            { time: `${dateString} ${timeString}`, status: true, latency },
            ...prev.slice(0, 9)
          ];
          return newChecks;
        });
        
        setStatusMessage(`A página está no ar. Última verificação: ${timeString}`);
        setStatusClass('bg-green-500 text-white');
      } else {
        setLabels(prevLabels => [...prevLabels, timeString]);
        setData(prevData => {
          const newData = [...prevData, 0];
          setUptime(calculateUptime(newData));
          return newData;
        });
        
        setLastChecks(prev => {
          const newChecks = [
            { time: `${dateString} ${timeString}`, status: false, latency: 0 },
            ...prev.slice(0, 9)
          ];
          return newChecks;
        });
        
        setStatusMessage(`A página está fora do ar. Última verificação: ${timeString}`);
        setStatusClass('bg-red-500 text-white');
      }
    } catch (error) {
      const now = new Date();
      const timeString = now.toLocaleTimeString();
      const dateString = now.toLocaleDateString();
      
      setLabels(prevLabels => [...prevLabels, timeString]);
      setData(prevData => {
        const newData = [...prevData, 0];
        setUptime(calculateUptime(newData));
        return newData;
      });
      
      setLastChecks(prev => {
        const newChecks = [
          { time: `${dateString} ${timeString}`, status: false, latency: 0 },
          ...prev.slice(0, 9)
        ];
        return newChecks;
      });
      
      setStatusMessage(`Erro ao verificar a página. Última verificação: ${timeString}`);
      setStatusClass('bg-red-500 text-white');
    }
  };

  const handleStartMonitoring = () => {
    if (isMonitoring) {
      clearInterval(intervalId);
      setIsMonitoring(false);
      setStatusMessage('Monitoramento parado.');
      setStatusClass('bg-yellow-500 text-white');
    } else {
      clearInterval(intervalId);
      
      if (!url) {
        alert('Por favor, insira uma URL para monitorar.');
        return;
      }

      setUrlDisplayed(url);
      const intervalMinutes = parseInt(interval, 10) || 5;
      setInterval(intervalMinutes);
      
      // Limpar dados anteriores
      setLabels([]);
      setData([]);
      setLastChecks([]);
      
      checkPageStatus();
      const newIntervalId = setInterval(checkPageStatus, intervalMinutes * 60 * 1000);
      setIntervalId(newIntervalId);
      setIsMonitoring(true);
    }
  };

  const handleExportGraph = () => {
    if (!chartRef.current) return;
    
    const link = document.createElement('a');
    link.href = chartRef.current.toBase64Image();
    link.download = `status_${urlDisplayed.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.png`;
    link.click();
  };

  const getStatusIndicator = () => {
    if (!isMonitoring) return 'bg-gray-500';
    const lastStatus = data[data.length - 1];
    if (lastStatus === undefined) return 'bg-gray-500';
    return lastStatus === 1 ? 'bg-green-500' : 'bg-red-500';
  };

  const chartData = {
    labels: labels,
    datasets: [{
      label: 'Status da Página',
      data: data,
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 2,
      stepped: true,
      tension: 0.1,
      fill: true,
      pointBackgroundColor: context => {
        const value = context.dataset.data[context.dataIndex];
        return value === 1 ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)';
      },
      pointRadius: 5,
    }]
  };

  const chartOptions = {
    responsive: true, 
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 1,
        ticks: {
          stepSize: 1,
          callback: function(value) {
            return value === 0 ? 'Fora do ar' : 'No ar';
          }
        }
      },
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.parsed.y;
            return value === 1 ? 'Página no ar' : 'Página fora do ar';
          }
        }
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-blue-800">Monitoramento de Site</h1>
        <div className="flex items-center">
          <div className="mr-2 text-sm font-medium">Status:</div>
          <div className={`h-4 w-4 rounded-full ${getStatusIndicator()}`}></div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Card de configuração */}
        <div className="bg-gray-50 p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Configuração</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="monitoringUrl" className="block text-sm font-medium text-gray-700 mb-1">
                URL para monitorar
              </label>
              <input
                type="text"
                id="monitoringUrl"
                placeholder="https://exemplo.com"
                value={url}
                onChange={e => setUrl(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="monitoringInterval" className="block text-sm font-medium text-gray-700 mb-1">
                Intervalo de verificação (minutos)
              </label>
              <input
                type="number"
                id="monitoringInterval"
                min="1"
                value={interval}
                onChange={e => setInterval(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <button
              onClick={handleStartMonitoring}
              className={`w-full py-2 text-white rounded transition-colors ${
                isMonitoring 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isMonitoring ? 'Parar Monitoramento' : 'Iniciar Monitoramento'}
            </button>
            
            <button
              onClick={handleExportGraph}
              disabled={data.length === 0}
              className={`w-full py-2 text-white rounded transition-colors ${
                data.length === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              Exportar Gráfico
            </button>
          </div>
        </div>
        
        {/* Card de estatísticas */}
        <div className="bg-gray-50 p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Estatísticas</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">URL monitorada:</span>
              <span className="font-medium truncate max-w-[220px]">{urlDisplayed}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Uptime:</span>
              <span className={`font-medium ${uptime > 90 ? 'text-green-600' : uptime > 80 ? 'text-yellow-600' : 'text-red-600'}`}>
                {uptime}%
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Verificações realizadas:</span>
              <span className="font-medium">{data.length}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Tempo de resposta:</span>
              <span className="font-medium">{responseTime}ms</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Status atual:</span>
              <span className={`font-medium ${
                !isMonitoring 
                  ? 'text-gray-600' 
                  : data[data.length - 1] === 1 
                    ? 'text-green-600' 
                    : 'text-red-600'
              }`}>
                {!isMonitoring 
                  ? 'Não monitorando' 
                  : data[data.length - 1] === 1 
                    ? 'Online' 
                    : 'Offline'}
              </span>
            </div>
          </div>
        </div>
        
        {/* Card de verificações recentes */}
        <div className="bg-gray-50 p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Verificações Recentes</h2>
          
          {lastChecks.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Nenhuma verificação realizada</p>
          ) : (
            <div className="overflow-y-auto max-h-[240px]">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Horário
                    </th>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tempo
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {lastChecks.map((check, index) => (
                    <tr key={index}>
                      <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-600">
                        {check.time}
                      </td>
                      <td className="px-2 py-2 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          check.status 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {check.status ? 'Online' : 'Offline'}
                        </span>
                      </td>
                      <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-600">
                        {check.latency ? `${check.latency}ms` : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      
      {/* Gráfico de status */}
      <div className="bg-gray-50 p-4 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Gráfico de Disponibilidade</h2>
        
        <div className="relative h-80">
          {data.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-gray-500">Nenhum dado disponível</p>
            </div>
          ) : (
            <Line data={chartData} options={chartOptions} ref={chartRef} />
          )}
        </div>
      </div>
      
      {/* Status atual */}
      <div id="statusMessage" className={`p-4 rounded-lg text-center font-medium ${statusClass}`}>
        {statusMessage || 'Aguardando início do monitoramento...'}
      </div>
    </div>
  );
}