// components/GeneralReportModal.js
import React from 'react';
import { FaTimes, FaChartPie, FaDownload, FaInfoCircle } from 'react-icons/fa';

const GeneralReportModal = ({ isVisible, onClose, reportData, userId }) => {
  if (!isVisible) return null;

  // Função para gerar e exportar CSV no frontend
  const handleExportToCSV = () => {
    if (!reportData || !reportData.urls_stats) {
      alert("Nenhum dado de relatório para exportar.");
      return;
    }

    const headers = [
      "URL",
      "Verificacoes",
      "Online",
      "Offline",
      "Tempo Ativo (min)",
      "Tempo Inativo (min)",
      "Porcentagem Ativo"
    ];

    const rows = Object.entries(reportData.urls_stats).map(([url, data]) => [
      url,
      data.total_checks,
      data.online_count,
      data.offline_count,
      data.total_uptime_minutes,
      data.total_downtime_minutes,
      data.uptime_percentage.toFixed(2) + "%" // Formata a porcentagem
    ]);

    // Combina cabeçalhos e linhas
    let csvContent = headers.join(",") + "\n";
    rows.forEach(row => {
      csvContent += row.map(item => `"${String(item).replace(/"/g, '""')}"`).join(",") + "\n";
    });

    // Cria um Blob e uma URL para download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `relatorio_geral_urls_${userId}_${new Date().toISOString().slice(0, 10)}.csv`); // Nome do arquivo

    document.body.appendChild(link); // Adiciona o link ao DOM
    link.click(); // Simula o clique para iniciar o download
    document.body.removeChild(link); // Remove o link do DOM
    URL.revokeObjectURL(url); // Libera a URL temporária
  };

  const getStatusColor = (percentage) => {
    if (percentage >= 99) return 'text-green-600';
    if (percentage >= 90) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl mx-auto max-h-[90vh] overflow-y-auto transform transition-all sm:my-8">
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-900 flex items-center">
            <FaChartPie className="mr-3 text-blue-600" /> Relatório Geral de URLs
          </h3>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-600 transition-colors"
            onClick={onClose}
            aria-label="Fechar"
          >
            <FaTimes className="text-2xl" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {reportData ? (
            <>
              {/* Summary Section */}
              <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg flex items-start">
                <FaInfoCircle className="mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-lg mb-2">Resumo do Relatório</h4>
                  <p>
                    Período: {new Date(reportData.summary.date_range.start).toLocaleDateString()} -{' '}
                    {new Date(reportData.summary.date_range.end).toLocaleDateString()}
                  </p>
                  <p>Total de verificações: <span className="font-semibold">{reportData.summary.total_records}</span></p>
                  <p className="mt-3">
                    <button
                      onClick={handleExportToCSV}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Exportar Relatório para CSV <FaDownload className="ml-2" />
                    </button>
                  </p>
                </div>
              </div>

              {/* Individual URL Report */}
              <h4 className="text-xl font-bold text-gray-800 mb-4">Disponibilidade por URL</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        URL
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Verificações
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Online
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Offline
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tempo Ativo (min)
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tempo Inativo (min)
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        % Ativo
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Object.entries(reportData.urls_stats).map(([url, data]) => (
                      <tr key={url}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 hover:text-blue-800 break-all">
                          <a href={url} target="_blank" rel="noopener noreferrer" className="truncate block">
                            {url}
                          </a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{data.total_checks}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">{data.online_count}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">{data.offline_count}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{data.total_uptime_minutes}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{data.total_downtime_minutes}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                          <span className={getStatusColor(data.uptime_percentage)}>
                            {data.uptime_percentage.toFixed(2)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">Nenhum dado de relatório disponível.</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-end">
          <button
            type="button"
            className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={onClose}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeneralReportModal;