// 📁 context/MensajesContext.tsx

import { createContext, useContext, useState } from 'react';

interface MensajesContextType {
  hayNoLeidos: boolean;
  setHayNoLeidos: (valor: boolean) => void;
}

const MensajesContext = createContext<MensajesContextType | undefined>(undefined);

export const MensajesProvider = ({ children }: { children: React.ReactNode }) => {
  const [hayNoLeidos, setHayNoLeidos] = useState(false);

  return (
    <MensajesContext.Provider value={{ hayNoLeidos, setHayNoLeidos }}>
      {children}
    </MensajesContext.Provider>
  );
};

export const useMensajesContext = () => {
  const context = useContext(MensajesContext);
  if (!context) {
    throw new Error('useMensajesContext debe usarse dentro de MensajesProvider');
  }
  return context;
};