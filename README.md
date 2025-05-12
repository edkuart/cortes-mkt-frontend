# 🌐 Frontend - Marketplace Modular

Este es el frontend del proyecto Marketplace Modular, desarrollado con **Next.js**, **React**, **Tailwind CSS** y conectado al backend mediante llamadas a la API. Esta interfaz está pensada para compradores y vendedores, incluyendo dashboards, gestión de productos y seguimiento de pedidos.

---

## 🚀 Tecnologías Utilizadas

- Next.js
- React
- TypeScript
- Tailwind CSS
- React Hot Toast (notificaciones)
- Recharts (gráficas)
- html2canvas + jsPDF (exportación PDF)

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
│   └── SolicitarDevolucion.tsx
├── hooks/
│   └── useAuth.ts
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
│   └── Pedidos-Vendedor.tsx
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

### Vendedor
- `/dashboard-vendedor` → Resumen de ventas, reseñas y devoluciones
- `/Pedidos-Vendedor` → Gestión de pedidos

### Inteligencia Artificial
- `/ia` → Chat con IA para sugerencias de productos

---

## 📦 Componentes Relevantes

- `SolicitarDevolucion.tsx`: Solicitud de devoluciones
- `IAResponseBox.tsx`: Interacción con la IA
- `Layout.tsx`: Layout general del sitio
- `ProductoForm.tsx`: Formulario de creación de productos

---

## 🛠 Notas

- Las llamadas a la API utilizan `fetch` apuntando a `http://localhost:4000`.
- Las rutas y pantallas están organizadas para separar roles de cliente y vendedor.
- Algunas funcionalidades están preparadas para futura integración en una app móvil (por ejemplo, botones de correo, exportación, IA).

---

## 📬 Contacto

Para dudas o soporte: [edkuart@gmail.com](mailto:edkuart@gmail.com)

✨ Proyecto en desarrollo activo, enfocado en integración backend-frontend y expansión móvil futura.

git push origin main