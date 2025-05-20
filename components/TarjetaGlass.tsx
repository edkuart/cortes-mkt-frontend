// 📁 components/TarjetaGlass.tsx

import { ReactNode, forwardRef } from "react";

interface Props {
  children: ReactNode;
  className?: string;
}

// forwardRef permite que el componente reciba y reenvíe la ref
const TarjetaGlass = forwardRef<HTMLDivElement, Props>(({ children, className = "" }, ref) => {
  return (
    <div
      ref={ref}
      className={`bg-white/30 dark:bg-black/30 backdrop-blur-md p-8 rounded-2xl shadow-lg ${className}`}
    >
      {children}
    </div>
  );
});

// Asigna un nombre para facilitar debugging
TarjetaGlass.displayName = "TarjetaGlass";

export default TarjetaGlass;
