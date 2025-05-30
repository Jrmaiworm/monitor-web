// components/MonitoringDetailsModal.js
import React from 'react';
import {
  FaHistory, FaInfoCircle, FaCheck, FaTimes, FaExclamationTriangle, FaArrowUp, FaArrowDown, FaCalendarAlt, FaClock
} from 'react-icons/fa';
import { Line } from 'react-chartjs-2'; // Importe Line de react-chartjs-2
import {
  Chart as ChartJS, // Importe Chart.js e registre os componentes necessários
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler // Para preencher a área abaixo da linha
} from 'chart.js';

// Registre os componentes necessários do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);


const MonitoringDetailsModal = ({
  detalhesVisiveis,
  fecharModal,
  urlSelecionada,
  detalhesMonitoramento, // Histórico de verificações individuais
  uptimeSummaryData,
  userId,
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const currentUrlSummary = uptimeSummaryData?.find(item => item.url === urlSelecionada);

  const formatMinutesToHoursMinutes = (totalMinutes) => {
    if (typeof totalMinutes !== 'number' || isNaN(totalMinutes)) return "0 min";
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes}min`;
  };

  // Prepara os dados para o Chart.js
  const chartLabels = detalhesMonitoramento.map(detalhe =>
    new Date(detalhe.checked_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  );

  const chartDataValues = detalhesMonitoramento.map(detalhe =>
    detalhe.status === 'online' ? 1 : 0
  );

  const data = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Status do Monitoramento',
        data: chartDataValues,
        fill: true, // Preenche a área abaixo da linha
        borderColor: 'rgb(75, 192, 192)', // Cor da linha
        backgroundColor: (context) => { // Gradiente de cor para a área preenchida
            const chart = context.chart;
            const { ctx, chartArea } = chart;
            if (!chartArea) return;

            const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            gradient.addColorStop(0, 'rgba(75, 192, 192, 0.4)'); // Começa mais opaco
            gradient.addColorStop(1, 'rgba(75, 192, 192, 0)'); // Termina transparente
            return gradient;
        },
        tension: 0.1, // Suavidade da linha
        pointRadius: 3, // Tamanho dos pontos
        pointBackgroundColor: chartDataValues.map(value => value === 1 ? 'green' : 'red'), // Cor dos pontos
        stepped: true, // Faz a linha em degraus (ideal para status binário)
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Permite controlar a altura
    plugins: {
      title: {
        display: true,
        text: 'Histórico de Status ao Longo do Tempo',
        font: {
            size: 16
        }
      },
      legend: {
        display: false, // Não queremos a legenda 'Status do Monitoramento'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const status = context.raw === 1 ? 'Online' : 'Offline';
            const fullDate = formatDate(detalhesMonitoramento[context.dataIndex].checked_at);
            return `Status: ${status} | Hora: ${context.label} | Data: ${fullDate.split(' ')[0]}`; // Combina hora e data
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Horário da Verificação',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Status',
        },
        min: 0,
        max: 1,
        ticks: {
          stepSize: 1,
          callback: function(value) {
            if (value === 1) return 'Online';
            if (value === 0) return 'Offline';
            return '';
          },
        },
      },
    },
  };


  if (!detalhesVisiveis) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-y-auto py-8">
      <div className="bg-white rounded-lg shadow-lg max-w-5xl mx-auto w-full sm:w-11/12 max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <FaHistory className="mr-2 text-blue-600" /> Detalhes do Monitoramento
            </h2>
            <button
              onClick={fecharModal}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">URL: {urlSelecionada}</h3>

            {currentUrlSummary ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center">
                  <div className="flex-shrink-0 text-green-500 text-2xl mr-3">
                    <FaArrowUp />
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">Disponibilidade (Uptime):</span>
                    <p className="text-green-600 font-bold text-xl">{currentUrlSummary.uptime_percentage}%</p>
                    <p className="text-gray-700 text-xs mt-1">Total Online: {formatMinutesToHoursMinutes(currentUrlSummary.total_online_minutes)}</p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center">
                  <div className="flex-shrink-0 text-red-500 text-2xl mr-3">
                    <FaArrowDown />
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">Tempo de Inatividade (Downtime):</span>
                    <p className="text-red-600 font-bold text-xl">{currentUrlSummary.downtime_percentage}%</p>
                    <p className="text-gray-700 text-xs mt-1">Total Offline: {formatMinutesToHoursMinutes(currentUrlSummary.total_offline_minutes)}</p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center">
                  <div className="flex-shrink-0 text-blue-500 text-2xl mr-3">
                    <FaClock />
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">Período Monitorado:</span>
                    <p className="text-blue-600 font-bold text-xl">{formatMinutesToHoursMinutes(currentUrlSummary.total_monitored_minutes)}</p>
                    <p className="text-gray-700 text-xs mt-1">Desde: {formatDate(currentUrlSummary.first_check)}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-sm text-yellow-800">
                <FaInfoCircle className="inline mr-2" /> Dados de resumo de uptime/downtime não disponíveis para esta URL.
              </div>
            )}

            <div className="text-sm text-gray-700 flex items-center mt-4">
                <FaInfoCircle className="mr-2" />
                Status Atual: <span className={`font-semibold ml-1 ${currentUrlSummary?.current_status === 'online' ? 'text-green-600' : 'text-red-600'}`}>
                    {currentUrlSummary?.current_status ? currentUrlSummary.current_status.toUpperCase() : 'N/A'}
                </span>
                {currentUrlSummary?.last_check && (
                    <span className="ml-4">Última Verificação: {formatDate(currentUrlSummary.last_check)}</span>
                )}
            </div>
          </div>

          <h3 className="text-lg font-medium text-gray-900 mb-4">Gráfico do Histórico de Verificações Recentes</h3>
          {detalhesMonitoramento.length > 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6" style={{ width: '100%', height: 300 }}>
              <Line data={data} options={options} /> {/* RENDERIZA O GRÁFICO AQUI */}
            </div>
          ) : (
            <div className="bg-gray-50 p-6 text-center rounded-lg border border-gray-200 mb-6">
              <p className="text-gray-500">Dados insuficientes para gerar o gráfico de histórico.</p>
            </div>
          )}

          {/* A TABELA DE HISTÓRICO DETALHADO FOI REMOVIDA PARA SER SUBSTITUÍDA PELO GRÁFICO */}
          {/* <h3 className="text-lg font-medium text-gray-900 mb-4">Histórico Detalhado de Verificações (Tabela)</h3>
          {detalhesMonitoramento.length > 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data/Hora da Verificação
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {detalhesMonitoramento.map((detalhe, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            detalhe.status === "online" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}>
                            {detalhe.status === "online" ? (
                              <><FaCheck className="mr-1" /> Online</>
                            ) : (
                              <><FaTimes className="mr-1" /> Offline</>
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(detalhe.checked_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 p-6 text-center rounded-lg border border-gray-200">
              <p className="text-gray-500">Nenhum histórico de verificação detalhado disponível.</p>
            </div>
          )} */}
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end">
          <button
            onClick={fecharModal}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default MonitoringDetailsModal;