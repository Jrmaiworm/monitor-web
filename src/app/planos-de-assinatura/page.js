"use client"; // Marca o componente como Client Component


import React from 'react';


const PlanosDeAssinatura = () => {
  return (
    <div>
   
      <div className='w-full justify-center flex'>
        <div className="bg-gray-100 p-6 rounded-lg shadow-md w-2/3 m-2">
 
            <h1 className="text-xl font-bold text-red-700 mb-4">Conheça os planos de assinatura</h1>
            <p className="mb-6 text-black">
              O eYe Monitor 24hrs monitora o seu site 24 horas por dia, e lhe informa sempre que houver algum problema.
            </p>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border rounded-lg">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left text-black  ">Recursos</th>
                    <th className="px-4 py-2 text-center text-black">Básico</th>
                    <th className="px-4 py-2 text-center text-black">Avançado</th>
                    <th className="px-4 py-2 text-center text-black">Super</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border px-4 py-2 text-black">Sites monitorados</td>
                    <td className="border px-4 py-2 text-black text-center">1</td>
                    <td className="border px-4 py-2 text-black text-center">3</td>
                    <td className="border px-4 py-2 text-black text-center">10</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2 text-black">Intervalos de monitoramento</td>
                    <td className="border px-4 py-2 text-black text-center">30/60 min.</td>
                    <td className="border px-4 py-2 text-black text-center">30/60 min.</td>
                    <td className="border px-4 py-2 text-black text-center">5/15 min.</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2 text-black">Relatórios online</td>
                    <td className="border px-4 py-2 text-black text-center">Sim</td>
                    <td className="border px-4 py-2 text-black text-center">Sim</td>
                    <td className="border px-4 py-2 text-black text-center">Sim</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2 text-black">Relatórios por e-mail</td>
                    <td className="border px-4 py-2 text-black text-center">Mensal</td>
                    <td className="border px-4 py-2 text-black text-center">Mensal</td>
                    <td className="border px-4 py-2 text-black text-center">Mensal</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2 text-black">Contatos de e-mail para alertas</td>
                    <td className="border px-4 py-2 text-black text-center">1</td>
                    <td className="border px-4 py-2 text-black text-center">3</td>
                    <td className="border px-4 py-2 text-black text-center">5</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2 text-black">Protocolos suportados</td>
                    <td className="border px-4 py-2 text-black text-center">HTTP/HTTPS</td>
                    <td className="border px-4 py-2 text-black text-center">HTTP/SMTP/POP3/FTP/HTTPS</td>
                    <td className="border px-4 py-2 text-black text-center">HTTP/SMTP/POP3/FTP/HTTPS/DNS</td>
                  </tr>
                </tbody>
                <tfoot className="bg-gray-200">
                  <tr>
                    <td className="border px-4 py-2 font-bold text-red-700">Assinatura</td>
                    <td className="border px-4 py-2 text-center font-bold text-red-700">Grátis!</td>
                    <td className="border px-4 py-2 text-center font-bold text-red-700">R$ 4,90 /mês</td>
                    <td className="border px-4 py-2 text-center font-bold text-red-700">R$ 9,90 /mês</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td className="border px-4 py-2 text-center">
                      <button className="bg-blue-500 text-white rounded py-2 px-4">Assine</button>
                    </td>
                    <td className="border px-4 py-2 text-center">
                      <button className="bg-blue-500 text-white rounded py-2 px-4">Assine</button>
                    </td>
                    <td className="border px-4 py-2 text-center">
                      <button className="bg-blue-500 text-white rounded py-2 px-4">Assine</button>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
        </div>
        );
};

        export default PlanosDeAssinatura;
