// components/AddUrlCard.js
import React from 'react';
import { FaGlobe, FaPlus, FaInfoCircle, FaExclamationTriangle } from 'react-icons/fa';

const AddUrlCard = ({
  url,
  setUrl,
  handleAddUrl,
  limiteAtingido,
  usuario,
  limiteUrls,
  urls,
}) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
    <div className="p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <FaGlobe className="mr-2 text-blue-600" /> Adicionar novo site para monitoramento
      </h2>
      <div className="mb-4 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-100">
        <div className="flex items-start">
          <FaInfoCircle className="text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
          <div>
            <p>
              Seu plano{" "}
              <span className="font-medium">{usuario?.plano || "Básico"}</span>{" "}
              permite monitorar até{" "}
              <span className="font-medium">
                {limiteUrls} {limiteUrls === 1 ? "URL" : "URLs"}
              </span>
              .
              {urls.length > 0 && (
                <span>
                  {" "}
                  Você já está monitorando{" "}
                  <span className="font-medium">
                    {urls.length} {urls.length === 1 ? "URL" : "URLs"}
                  </span>
                  .
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
      {limiteAtingido ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <div className="flex items-start">
            <FaExclamationTriangle className="text-yellow-500 mt-1 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-yellow-800 font-medium">
                Limite de URLs atingido
              </h3>
              <p className="text-yellow-700 mt-1">
                Seu plano {usuario?.plano} permite monitorar apenas{" "}
                {limiteUrls} {limiteUrls === 1 ? "URL" : "URLs"}. Faça upgrade
                para adicionar mais URLs.
              </p>
              <a
                href="/planos-de-assinatura"
                className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Fazer upgrade
              </a>
            </div>
          </div>
        </div>
      ) : null}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-grow">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaGlobe className="text-gray-400" />
            </div>
            <input
              type="text"
              className="text-gray-500 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Digite a URL para monitorar (ex: exemplo.com)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={limiteAtingido}
            />
          </div>
        </div>
        <button
          onClick={handleAddUrl}
          className={`flex items-center justify-center px-4 py-2 rounded-lg transition-colors ${
            limiteAtingido
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
          disabled={limiteAtingido}
        >
          <FaPlus className="mr-2" /> Adicionar URL
        </button>
      </div>
    </div>
  </div>
);

export default AddUrlCard;