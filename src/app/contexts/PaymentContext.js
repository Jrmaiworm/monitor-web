// contexts/PaymentContext.js
"use client";

import React, { createContext, useContext, useState } from 'react';

// 1. Crie o Context
const PaymentContext = createContext(null);

// 2. Crie um Provider para envolver seus componentes
export const PaymentProvider = ({ children }) => {
  const [paymentData, setPaymentData] = useState({
    userData: null,
    planoSelecionado: null,
  });

  return (
    <PaymentContext.Provider value={{ paymentData, setPaymentData }}>
      {children}
    </PaymentContext.Provider>
  );
};

// 3. Crie um hook customizado para facilitar o uso do Context
export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};