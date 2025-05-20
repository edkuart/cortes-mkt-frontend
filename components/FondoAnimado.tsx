// 📁 components/FondoAnimado.tsx

import { ReactNode } from 'react';

interface FondoAnimadoProps {
  children: ReactNode;
  className?: string;
}

const FondoAnimado = ({ children, className = '' }: FondoAnimadoProps) => {
  return (
    <div className={`min-h-screen bg-gradient-to-r from-jade via-coral to-verdePastel bg-[length:400%_400%] animate-fondo ${className}`}>
      {children}
    </div>
  );
};

export default FondoAnimado;
