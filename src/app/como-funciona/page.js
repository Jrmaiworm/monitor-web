
import React from 'react';


const ComoFunciona = () => {
  return (
    <div>
   
 <div className='w-full justify-center flex'>
    <div className="bg-gray-100 p-6 rounded-lg shadow-md w-2/3 m-2 ">
      
      <h1 className="text-xl font-bold text-red-700 mb-4">Como funciona</h1>
      <p className="mb-4 text-black">
        O eYe Monitor 24hrs testa o seu site em intervalos de 5, 10, 15 ou 30 minutos, para garantir que seus clientes, 
        fornecedores e parceiros sempre consigam acessar suas informações. Caso o site não esteja disponível, um e-mail 
        é enviado a você para alertá-lo.
      </p>
      <p className="mb-4 text-black">
        Além de servidores web (HTTP ou HTTPS), o eYe Monitor 24hrs também monitora servidores de e-mail (POP3 e SMTP) 
        e servidores de transferência de arquivos (FTP).
      </p>
      <p className="mb-4 text-black">
        Você também tem acesso, pelo nosso site, a relatórios que informam o percentual de tempo em que seu site ficou 
        no ar, bem como detalhes dos momentos em que houve falhas.
      </p>
      <p className="mb-4 text-black">
        O eYe Monitor 24hrs monitora o seu site 24 horas por dia, 7 dias por semana, 365 dias por ano. E o plano básico 
        é <strong>GRÁTIS.</strong>
      </p>
      <p className="mb-4 text-black">
        Cadastre-se já e tenha todas as informações sobre o funcionamento do seu site. Dúvidas? Fale conosco clicando 
        <a href="/fale-conosco" className="text-red-700"> aqui</a> ou pelo e-mail suporte@eYeMonitor24hrs.com.br.
      </p>
    </div>
    </div>
    </div>
  );
};

export default ComoFunciona;
