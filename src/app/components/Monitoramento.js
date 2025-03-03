"use client"
import React, { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { Line } from 'react-chartjs-2';

Chart.register(...registerables);

export default function Monitoramento() {
  const [url, setUrl] = useState('');
  const [interval, setInterval] = useState(5 * 60 * 1000); // 5 minutos em milissegundos
  const [labels, setLabels] = useState([]);
  const [data, setData] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusClass, setStatusClass] = useState('bg-gray-300');
  const [urlDisplayed, setUrlDisplayed] = useState('Nenhuma URL monitorada');
  const chartRef = useRef(null);
  const [intervalId, setIntervalId] = useState(null);
  const [isMonitoring, setIsMonitoring] = useState(false); // Estado para monitorar o status do monitoramento

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.update();
    }
  }, [labels, data]);

  const checkPageStatus = () => {
    if (!url) {
      alert('Por favor, insira uma URL para monitorar.');
      return;
    }

    fetch(url, { method: 'GET', mode: 'no-cors' })
      .then(response => {
        const now = new Date().toLocaleTimeString();

        if (response.ok || response.type === 'opaque') {
          setLabels(prevLabels => [...prevLabels, now]);
          setData(prevData => [...prevData, 1]);
          setStatusMessage(`A página está no ar. Última verificação: ${now}`);
          setStatusClass('bg-green-500 text-white');
        } else {
          setLabels(prevLabels => [...prevLabels, now]);
          setData(prevData => [...prevData, 0]);
          setStatusMessage(`A página está fora do ar. Última verificação: ${now}`);
          setStatusClass('bg-red-500 text-white');
        }
      })
      .catch(() => {
        const now = new Date().toLocaleTimeString();
        setLabels(prevLabels => [...prevLabels, now]);
        setData(prevData => [...prevData, 0]);
        setStatusMessage(`Erro ao verificar a página. Última verificação: ${now}`);
        setStatusClass('bg-red-500 text-white');
      });
  };

  const handleStartMonitoring = () => {
    if (isMonitoring) {
      clearInterval(intervalId); // Para o monitoramento
      setIsMonitoring(false); // Atualiza o estado para indicar que o monitoramento foi parado
      setStatusMessage('Monitoramento parado.');
      setStatusClass('bg-yellow-500 text-white');
    } else {
      clearInterval(intervalId); // Limpa qualquer intervalo anterior
      setUrl(url);

      if (!url) {
        alert('Por favor, insira uma URL para monitorar.');
        return;
      }

      setUrlDisplayed(url); // Atualiza a URL exibida
      const intervalMinutes = parseInt(document.getElementById('monitoringInterval').value, 10) || 5;
      setInterval(intervalMinutes * 60 * 1000);
      checkPageStatus();
      const newIntervalId = setInterval(checkPageStatus, interval);
      setIntervalId(newIntervalId);
      setIsMonitoring(true); // Define que o monitoramento está em andamento
    }
  };

  const handleExportGraph = () => {
    const link = document.createElement('a');
    link.href = chartRef.current.toBase64Image();
    link.download = 'status_chart.png';
    link.click();
  };

  const chartData = {
    labels: labels,
    datasets: [{
      label: 'Status da Página',
      data: data,
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
      fill: true,
    }]
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-4 text-red-700">Monitoramento da Página</h1>
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          id="monitoringUrl"
          placeholder="Insira a URL para monitorar"
          value={url}
          onChange={e => setUrl(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded"
        />
        <input
          type="number"
          id="monitoringInterval"
          placeholder="Intervalo em minutos"
          className="w-1/4 p-2 border border-gray-300 rounded"
        />
        <button
          onClick={handleStartMonitoring}
          className={`px-4 py-2 text-white rounded ${isMonitoring ? 'bg-red-800' : 'bg-red-700'} hover:bg-gray-600`}
        >
          {isMonitoring ? 'Monitorando' : 'Iniciar Monitoramento'}
        </button>
        <button
          onClick={handleExportGraph}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Exportar Gráfico
        </button>
      </div>
      <div id="currentUrl" className="mb-4">
        URL monitorada: <span id="urlDisplayed" className="font-bold">{urlDisplayed}</span>
      </div>
      <div className="relative h-80">
        <Line data={chartData} ref={chartRef} options={{ responsive: true, maintainAspectRatio: false }} />
      </div>
      <div id="statusMessage" className={`p-4 mt-4 rounded ${statusClass}`}>
        {statusMessage}
      </div>
    </div>
  );
}
