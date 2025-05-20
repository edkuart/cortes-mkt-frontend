// 📁 utils/usuario.ts

export const construirUrlAvatar = (path?: string | null): string | undefined => {
    if (!path) return undefined;
    if (path.startsWith('http')) return path;
    return `http://localhost:4000/${path.replace(/^\/+/, '')}`;
  };
  
  