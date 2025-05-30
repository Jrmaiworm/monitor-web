import React from "react";
import { 
  FaHistory, FaInfoCircle, FaCheck, FaTimes, 
  FaExclamationTriangle 
} from "react-icons/fa";

const DetalhesMonitoramentoModal = ({
  isVisible,
  onClose,
  urlSelecionada,
  detalhesMonitoramento,
  historicoOffline,
  porcentagemOnline,
  porcentagemOffline
}) => {
  // Função para formatar a data
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-y-auto py-8">
      <div className="bg-white rounded-lg shadow-lg max-w-5xl mx-auto w-full sm:w-11/12 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <FaHistory className="mr-2 text-blue-600" /> 
              Detalhes do Monitoramento
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {/* Summary Section */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">URL: {urlSelecionada}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Disponibilidade:</span>
                  <span className="text-green-600 font-medium">{porcentagemOnline}%</span>
                </div>
                
                <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 transition-all duration-300"
                    style={{ width: `${porcentagemOnline}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Tempo offline:</span>
                  <span className="text-red-600 font-medium">{porcentagemOffline}%</span>
                </div>
                
                <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500 transition-all duration-300"
                    style={{ width: `${porcentagemOffline}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="text-sm text-gray-500 flex items-center">
              <FaInfoCircle className="mr-1" />
              Total de verificações: {detalhesMonitoramento.length}
            </div>
          </div>
          
          {/* Monitoring History */}
          <h3 className="text-lg font-medium text-gray-900 mb-4">Histórico de verificações</h3>
          
          {detalhesMonitoramento.length > 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Início 
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Último monitoramento
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {detalhesMonitoramento.map((detalhe, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {detalhe.checked ? `${formatDate(detalhe.checked)}` : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 p-6 text-center rounded-lg border border-gray-200 mb-6">
              <div className="rounded-full bg-gray-200 w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <FaHistory className="text-gray-400 text-xl" />
              </div>
              <p className="text-gray-500">Nenhum histórico de verificação disponível.</p>
            </div>
          )}
          
          {/* Offline Periods */}
          {historicoOffline.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <FaExclamationTriangle className="mr-2 text-red-500" />
                Períodos offline ({historicoOffline.length} ocorrências)
              </h3>
              
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-red-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">
                          Data/Hora do Incidente
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {historicoOffline.map((detalhe, index) => (
                        <tr key={index} className="hover:bg-red-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 flex items-center">
                            <FaExclamationTriangle className="mr-2 flex-shrink-0" /> 
                            {formatDate(detalhe.checked_at)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetalhesMonitoramentoModal;