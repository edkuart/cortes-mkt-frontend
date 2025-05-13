# 🌐 Frontend - Marketplace Modular

Este es el frontend del proyecto Marketplace Modular, desarrollado con **Next.js**, **React**, **Tailwind CSS** y conectado al backend mediante llamadas a la API. Esta interfaz está pensada para compradores y vendedores, incluyendo dashboards, gestión de productos, seguimiento de pedidos y calificación con reseñas interactivas.

---

## 🚀 Tecnologías Utilizadas

- Next.js
- React
- TypeScript
- Tailwind CSS
- React Hot Toast (notificaciones)
- Recharts (gráficas)
- html2canvas + jsPDF (exportación PDF)
- React Icons (estrellas animadas y emojis)

---

## 📁 Estructura del Proyecto

```
frontend/
├── components/
│   ├── IAResponseBox.tsx
│   ├── Layout.tsx
│   ├── PedidoCard.tsx
│   ├── PedidoForm.tsx
│   ├── ProductoCard.tsx
│   ├── ProductoForm.tsx
│   ├── ReseñasBox.tsx
│   ├── Estrellas.tsx
│   └── SolicitarDevolucion.tsx
├── hooks/
│   ├── useAuth.ts
│   └── useIA.ts
├── pages/
│   ├── api/
│   ├── _app.tsx
│   ├── _document.tsx
│   ├── carrito.tsx
│   ├── dashboard-vendedor.tsx
│   ├── ia.tsx
│   ├── index.tsx
│   ├── login.tsx
│   ├── mis-pedidos.tsx
│   ├── crear-resena.tsx
│   └── mis-resenas.tsx
├── public/
├── services/
│   └── apiService.ts
├── styles/
│   └── globals.css
├── .env.local
├── tailwind.config.js
├── tsconfig.json
├── next.config.js
└── package.json
```

---

## ⚙️ Configuración Inicial

1. Instalar dependencias:
```bash
npm install
```

2. Crear archivo `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

3. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

---

## 🔍 Páginas y Funcionalidades

### Cliente
- `/` → Página principal
- `/login` → Inicio de sesión
- `/carrito` → Carrito de compras
- `/mis-pedidos` → Historial del comprador
- `/crear-resena` → Enviar reseña con calificación animada
- `/mis-resenas` → Ver todas las reseñas creadas

### Vendedor
- `/dashboard-vendedor` → Resumen de ventas, reseñas y devoluciones
- `/Pedidos-Vendedor` → Gestión de pedidos

### Inteligencia Artificial
- `/ia` → Chat con IA para sugerencias de productos

---

## ✨ Componentes Relevantes

- `Estrellas.tsx`: Calificación visual e interactiva (soporta media estrella, emojis, colores y animación)
- `SolicitarDevolucion.tsx`: Solicitud de devoluciones
- `IAResponseBox.tsx`: Interacción con la IA
- `Layout.tsx`: Layout general del sitio
- `ProductoForm.tsx`: Formulario de creación de productos

---

## 🛠 Notas

- Las llamadas a la API utilizan `fetch` apuntando a `http://localhost:4000`.
- Las rutas están organizadas para separar roles (cliente / vendedor).
- Estrellas ahora incluyen animación, emojis y vibración (si está disponible).
- Las calificaciones se guardan localmente si no hay conexión.

---

## 📬 Contacto

Para dudas o soporte: [edkuart@gmail.com](mailto:edkuart@gmail.com)

✨ Proyecto en desarrollo activo, enfocado en integración backend-frontend, experiencia móvil e interactividad visual avanzada.
