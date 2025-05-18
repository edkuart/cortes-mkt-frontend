// 📁 hooks/useAI.ts

export const api = async (endpoint: string, options = {}) =>
  fetch(`http://localhost:4000/api/${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  }).then(res => res.json());
  