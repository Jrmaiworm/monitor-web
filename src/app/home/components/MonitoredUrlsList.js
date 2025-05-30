// components/MonitoredUrlsList.js
import React from 'react';
import { 
  FaChartLine, FaClock, FaPlay, FaStop, FaTrashAlt, FaInfoCircle,
  FaBell, FaEnvelopeOpenText, FaTimesCircle // Ícones para notificação e desativado
} from 'react-icons/fa';

const MonitoredUrlsList = ({
  urls,
  isLoading,
  intervalos,
  handleIntervalChange,
  handleMonitoramento,
  showDeleteConfirmation,
  fetchDetalhesMonitoramento,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 mb-8">
      <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <FaChartLine className="mr-2 text-blue-600" /> Minhas URLs Monitoradas
        </h2>
        <span className="text-sm text-gray-500">{urls.length} sites</span>
      </div>
      
      {/* NOVO: Legenda dos ícones de notificação */}
      <div className="p-4 bg-gray-50 border-b border-gray-100 text-sm text-gray-600 flex flex-wrap gap-x-4 gap-y-2 justify-center sm:justify-start">
        <span className="flex items-center">
          <FaBell className="text-yellow-500 mr-1" /> Notificação de Falhas
        </span>
        <span className="flex items-center">
          <FaEnvelopeOpenText className="text-blue-500 mr-1" /> Relatório Mensal
        </span>
        <span className="flex items-center">
          <FaTimesCircle className="text-gray-400 mr-1" /> Nenhuma Notificação Ativa
        </span>
      </div>

      <div className="divide-y divide-gray-200">
        {isLoading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Carregando seus sites...</p>
          </div>
        ) : urls.length > 0 ? (
          urls.map((monitor) => (
            <div key={monitor.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-grow">
                  <div className="flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full mr-2 ${
                        monitor.monitorando ? "bg-green-500 animate-pulse" : "bg-red-500"
                      }`}
                    ></div>
                    <h3 className="font-medium text-gray-900">{monitor.url}</h3>
                  </div>
                  <div className="flex items-center mt-1 text-sm text-gray-500">
                    <FaClock className="mr-1" />
                    <span>Intervalo: {monitor.intervalo_minutos || 1} min</span>
                    <span className="ml-4 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100">
                      {monitor.monitorando ? "Monitorando" : "Parado"}
                    </span>
                  </div>
                  {/* NOVO: Ícones de status de notificação */}
                  <div className="flex items-center mt-2 space-x-2 text-sm text-gray-600">
                    {monitor.falhas ? (
                      <span title="Notificação de Falhas Ativa" className="flex items-center text-yellow-600">
                        <FaBell className="mr-1" /> Falhas
                      </span>
                    ) : null}
                    {monitor.relatorio_mensal ? (
                      <span title="Relatório Mensal Ativo" className="flex items-center text-blue-600">
                        <FaEnvelopeOpenText className="mr-1" /> Relatório
                      </span>
                    ) : null}
                    {!monitor.falhas && !monitor.relatorio_mensal ? (
                      <span title="Nenhuma Notificação Ativa" className="flex items-center text-gray-500">
                        <FaTimesCircle className="mr-1" /> Sem Notificações
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border rounded-lg overflow-hidden">
                    <input
                      type="number"
                      min="1"
                      className="w-16 py-1 px-2 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={intervalos[monitor.id] || 1}
                      onChange={(e) =>
                        handleIntervalChange(monitor.id, e.target.value)
                      }
                    />
                    <span className="bg-gray-100 px-2 py-1 text-sm text-gray-600">
                      min
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      handleMonitoramento(
                        monitor,
                        monitor.monitorando ? "stop" : "start"
                      )
                    }
                    className={`flex items-center justify-center h-8 w-8 rounded-lg ${
                      monitor.monitorando
                        ? "bg-red-100 text-red-600 hover:bg-red-200"
                        : "bg-green-100 text-green-600 hover:bg-green-200"
                    }`}
                    title={
                      monitor.monitorando ? "Parar monitoramento" : "Iniciar monitoramento"
                    }
                  >
                    {monitor.monitorando ? <FaStop size={14} /> : <FaPlay size={14} />}
                  </button>
                  <button
                    onClick={() => showDeleteConfirmation(monitor.id)}
                    className="flex items-center justify-center h-8 w-8 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200"
                    title="Excluir URL"
                  >
                    <FaTrashAlt size={14} />
                  </button>
                  <button
                    onClick={() => fetchDetalhesMonitoramento(monitor)}
                    className="flex items-center justify-center h-8 w-8 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200"
                    title="Ver detalhes"
                  >
                    <FaInfoCircle size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 text-center">
            <div className="rounded-full bg-blue-100 w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <FaGlobe className="text-blue-600 text-2xl" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              Nenhum site monitorado
            </h3>
            <p className="text-gray-500 mb-4">
              Adicione URLs para começar a monitorar seus sites
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonitoredUrlsList;