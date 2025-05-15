# 🌐 Frontend - Marketplace Modular

Este es el frontend del proyecto Marketplace Modular, desarrollado con **Next.js**, **React**, **Tailwind CSS** y conectado al backend mediante llamadas a la API. Esta interfaz está pensada para compradores y vendedores, incluyendo dashboards, gestión de productos, seguimiento de pedidos y calificación con reseñas interactivas.

---

🚀 Tecnologías Utilizadas

- Next.js
- React
- TypeScript
- Tailwind CSS
- React Hot Toast (notificaciones)
- Recharts (gráficas)
- html2canvas + jsPDF (exportación PDF)
- React Icons (estrellas animadas y emojis)

---

📁 Estructura del Proyecto

```
frontend/
├── components/
│   ├── Estrellas.tsx ← ⭐ Calificación visual y emojis
│   ├── IAResponseBox.tsx
│   ├── Layout.tsx
│   ├── PedidoCard.tsx
│   ├── PedidoForm.tsx
│   ├── ProductoCard.tsx
│   ├── ProductoForm.tsx
│   ├── ReseñasBox.tsx
│   └── SolicitarDevolucion.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useIA.ts
│   └── useResenasProducto.ts ← 🔁 Hook reutilizable de reseñas
├── pages/
│   ├── api/
│   ├── _app.tsx
│   ├── _document.tsx
│   ├── carrito.tsx
│   ├── crear-resena.tsx
│   ├── dashboard-vendedor.tsx
│   ├── editar-resena.tsx ← ✏️ Editar y eliminar reseñas
│   ├── ia.tsx
│   ├── index.tsx
│   ├── login.tsx
│   ├── mis-pedidos.tsx
│   ├── mis-resenas.tsx
│   └── resenas-producto/[id].tsx ← Página pública de reseñas de producto
├── public/
├── services/
│   └── apiService.ts
├── styles/
│   └── globals.css
├── utils/
│   └── estrellas.ts ← 🎯 Icono dinámico según puntuación
├── .env.local
├── tailwind.config.js
├── tsconfig.json
└── next.config.js


```

---

⚙️ Configuración Inicial

    Instalar dependencias:

npm install

    Crear archivo .env.local:

NEXT_PUBLIC_API_URL=http://localhost:4000

    Iniciar el servidor de desarrollo:

npm run dev

🔍 Páginas y Funcionalidades
Cliente

    /login → Inicio de sesión

    /carrito → Ver carrito

    /mis-pedidos → Ver historial de pedidos

    /crear-resena → Escribir nueva reseña con estrellas animadas

    /editar-resena → Editar o eliminar reseñas (si no han sido respondidas)

    /mis-resenas → Listado de reseñas propias

Vendedor

    /dashboard-vendedor → Vista completa de ventas, calificaciones, evoluciones y devoluciones

    Responder reseñas directamente desde el dashboard

Público

    /resenas-producto/[id] → Página para ver reseñas completas de un producto

    Permite mostrar respuestas del vendedor como subcomentario

Inteligencia Artificial

    /ia → Chat con IA para sugerencias de productos

✨ Componentes Destacados

    Estrellas.tsx: Calificación visual con emojis, vibración y estado offline

    useResenasProducto.ts: Hook para obtener reseñas y promedio reutilizable

    ReseñasBox.tsx: Vista de últimas reseñas debajo del producto

    moderacionService.ts: Verifica y limpia contenido ofensivo antes de enviarlo

    utils/estrellas.ts: Función para renderizar estrella, estrella media o vacía



---

## ✨ Funcionalidades Clave

- ⭐ **Componente interactivo de estrellas** (vibración, emojis, media estrella)
- ✍️ **Edición/eliminación de reseñas** con validación de tiempo
- 💬 **Respuesta del vendedor a reseñas**
- 🚫 **Moderación de respuestas** (insultos bloqueados)
- 📈 **Dashboard del vendedor** con comparativas y ranking
- 📄 **Exportar gráficos y resumen PDF**

---

🛠 Notas Adicionales

    Todas las reseñas pueden incluir respuestas de los vendedores

    Las respuestas aparecen como subcomentarios en el frontend

    Si se detecta una palabra ofensiva en una reseña o respuesta, se bloquea automáticamente con mensaje de error

    Las estrellas funcionan offline y guardan temporalmente la calificación si no hay red

    Todo es modular para su futura integración en React Native

---

## 📬 Contacto

Para dudas o sugerencias: [edkuart@gmail.com](mailto:edkuart@gmail.com)

✨ Proyecto en desarrollo continuo, con enfoque en experiencia de usuario, visualización clara y escalabilidad. Se planea integrar reputación de vendedor, insignias y filtros por reseña próximamente.