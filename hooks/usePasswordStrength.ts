// 📁 hooks/usePasswordStrength.ts

const usePasswordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 6) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
  
    const niveles = ['Débil', 'Regular', 'Buena', 'Fuerte'];
    const colores = ['bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
    const porcentajes = ['25%', '50%', '75%', '100%'];
  
    return {
      nivel: niveles[Math.min(score, 3)],
      color: colores[Math.min(score, 3)],
      porcentaje: porcentajes[Math.min(score, 3)],
    };
  };
  
  export default usePasswordStrength;  