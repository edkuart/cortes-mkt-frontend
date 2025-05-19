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
- Google OAuth (`@react-oauth/google`)

---

frontend/
├── components/
│   ├── Form/
│   │   ├── InputArchivo.tsx          # 📤 Input especializado para archivos (vendedor)
│   │   ├── InputText.tsx             # 🧾 Reutilizable para inputs de texto/email/password
│   │   └── SelectRol.tsx             # 👤 Selector de rol (comprador/vendedor)
│   ├── Estrellas.tsx                 # ⭐ Visualizador de calificación
│   ├── IAResponseBox.tsx             # 🤖 Respuestas generadas por IA
│   ├── Layout.tsx                    # 🧱 Layout general (si aplica)
│   ├── PedidoCard.tsx                # 🧾 Vista individual de un pedido
│   ├── PedidoForm.tsx                # 📥 Formulario de solicitud
│   ├── ProductoCard.tsx              # 🛍 Vista individual de producto
│   ├── ProductoForm.tsx              # 🧾 Formulario para crear producto
│   ├── ReseñasBox.tsx                # ✍️ Caja para ver y dejar reseñas
│   └── SolicitarDevolucion.tsx       # 📦 Solicitud de devolución
│
├── hooks/
│   ├── useAuth.ts                    # 🔐 Autenticación con token localStorage
│   ├── useIA.ts                      # ⚙️ Llamadas a la IA
│   └── useResenasProducto.ts         # 🔁 Hook para reseñas públicas de producto
│
├── pages/
│   ├── api/
│   │   └── hello.ts
│   ├── comprador/
│   │   ├── carrito.tsx
│   │   ├── crear-resena.tsx
│   │   ├── editar-resena.tsx
│   │   ├── mis-pedidos.tsx
│   │   └── mis-resenas.tsx
│   ├── resenas-producto/
│   │   ├── [id].tsx
│   │   └── resumen.tsx
│   ├── vendedor/
│   │   ├── dashboard-vendedor.tsx
│   │   ├── panel-vendedor.tsx
│   │   ├── Pedidos-Vendedor.tsx
│   │   ├── responder-resenas.tsx
│   │   └── resumen-resenas.tsx
│   ├── _app.tsx                      # 🌐 Configura GoogleOAuthProvider
│   ├── _document.tsx
│   ├── ia.tsx
│   ├── index.tsx
│   ├── login.tsx                     # 🔐 Incluye login tradicional y con Google
│   └── registro.tsx                  # ✅ Registro tradicional y con Google
│
├── public/
│   └── (imágenes, íconos, etc.)
│
├── services/
│   └── apiService.ts
│
├── styles/
│   └── globals.css
│
├── utils/
│   └── estrellas.ts
│
├── .env.local                        # ⚙️ Incluye NEXT_PUBLIC_GOOGLE_CLIENT_ID
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

    /login → Inicio de sesión (correo/contraseña o Google)

    /registro → Registro con validaciones y con Google

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

    Login con Google: usando `@react-oauth/google`

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

Nuevas secciones / cambios:

    + GoogleOAuthProvider (_app.tsx)

    + Login con Google y registro con Google (login.tsx y registro.tsx)

    + Vista de perfil (perfil.tsx) con actualización de nombre, correo, contraseña, imagen

    + Soporte para fotoPerfil y fotoUrl del backend

    + Vista previa de imagen antes de subir

    + FormData y validaciones condicionales según el rol

    + Nuevos inputs reutilizables: InputArchivo, InputText, SelectRol