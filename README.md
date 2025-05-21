# 🌐 Frontend - Marketplace Modular

Este es el frontend del proyecto Marketplace Modular, desarrollado con **Next.js**, **React**, **Tailwind CSS** y conectado al backend mediante llamadas a la API. Esta interfaz está pensada para compradores y vendedores, incluyendo dashboards, gestión de productos, seguimiento de pedidos y calificación con reseñas interactivas.

---

🚀 Tecnologías Utilizadas

- Next.js (App Routing)
- React
- TypeScript
- Tailwind CSS (UI moderna)
- React Hot Toast (notificaciones)
- Recharts (gráficas de datos)
- html2canvas + jsPDF (descarga PDF)
- React Icons (estrellas animadas y emojis)
- Google OAuth (`@react-oauth/google`)
- Partículas animadas (Hero visual con FondoAnimado.tsx)
---

frontend/
├── components/
│   ├── Form/
│   │   ├── InputArchivo.tsx          # 📤 Input especializado para archivos (vendedor)
│   │   ├── InputText.tsx             # 🧾 Reutilizable para inputs de texto/email/password
│   │   └── SelectRol.tsx             # 👤 Selector de rol (comprador/vendedor)
│   ├── Estrellas.tsx                 # ⭐ Visualizador de calificación
│   ├── FondoAnimado.tsx              # 🌄 Fondo animado con partículas
│   ├── HeroPrincipal.tsx             # 🧵 Sección principal con mensaje hero
│   ├── IAResponseBox.tsx             # 🤖 Respuestas generadas por IA
│   ├── Layout.tsx                    # 🧱 Layout general con menú de usuario y título
│   ├── PedidoCard.tsx                # 🧾 Vista individual de un pedido
│   ├── PedidoForm.tsx                # 📥 Formulario de solicitud
│   ├── ProductoCard.tsx              # 🛍 Vista individual de producto
│   ├── ProductoForm.tsx              # 🧾 Formulario para crear producto
│   ├── ReseñasBox.tsx                # ✍️ Caja para ver y dejar reseñas
│   ├── SolicitarDevolucion.tsx       # 📦 Solicitud de devolución
│   ├── TarjetaGlass.tsx              # 🧊 Componente visual con estilo glassmorphism
│   ├── TituloPrincipal.tsx           # 🏷 Título reutilizable del sitio
│   └── UserDropdownMenu.tsx          # 👤 Menú desplegable del usuario (perfil, logout, etc.)
│
├── hooks/
│   ├── useAuth.ts                    # 🔐 Autenticación con token localStorage
│   ├── useIA.ts                      # ⚙️ Llamadas a la IA
│   ├── usePasswordStrength.ts        # 💪 Hook para fortaleza de contraseña
│   ├── useResenasProducto.ts         # 🔁 Hook para reseñas públicas de producto
│   └── useFormularioRegistro.ts      # 🧾 Manejo centralizado del formulario de registro
│
├── pages/
│   ├── api/
│   │   └── hello.ts
│   ├── cambiar-password.tsx          # 🔑 Página para cambio de contraseña con sesión activa
│   ├── ia.tsx                        # 🧠 Interfaz con el chatbot de IA
│   ├── index.tsx                     # 🏠 Página principal
│   ├── login.tsx                     # 🔐 Incluye login tradicional y con Google
│   ├── perfil.tsx                    # 👤 Vista y edición del perfil del usuario
│   ├── registro.tsx                  # ✅ Registro tradicional y con Google
│   ├── reset-password.tsx            # 🔐 Establecer nueva contraseña vía token
│   ├── recuperar-password.tsx        # 📨 Solicitud de recuperación de contraseña
│   ├── mensajes/
│   │   └── [id].tsx                  # 💬 Chat entre comprador y vendedor
│   ├── productos/
│   │   └── historial/
│   │       └── [id].tsx              # 📜 Historial de cambios de un producto
│   ├── resenas-producto/
│   │   ├── [id].tsx                  # 📋 Detalle de reseñas por producto
│   │   └── resumen.tsx              # 📊 Vista resumen de reseñas y rankings
│   ├── comprador/
│   │   ├── carrito.tsx               # 🛒 Carrito de compras
│   │   ├── crear-resena.tsx         # ✍️ Crear nueva reseña
│   │   ├── editar-resena.tsx        # 📝 Editar reseña existente
│   │   ├── mis-pedidos.tsx          # 📦 Pedidos realizados por el comprador
│   │   └── mis-resenas.tsx          # 🧾 Reseñas hechas por el comprador
│   └── vendedor/
│       ├── dashboard-vendedor.tsx   # 📈 Dashboard con gráficas y métricas
│       ├── panel-vendedor.tsx       # 🧮 Panel general para gestión del vendedor
│       ├── Pedidos-Vendedor.tsx     # 📋 Lista de pedidos del vendedor
│       ├── responder-resenas.tsx    # ✍️ Respuesta a reseñas de productos
│       ├── resumen-resenas.tsx      # 📊 Vista resumen de calificaciones por vendedor
│       └── perfil-vendedor/
│           └── [id].tsx             # 🧑‍💼 Perfil público del vendedor con productos y contacto
│
├── public/
│   └── (imágenes, íconos, etc.)      # 📁 Recursos estáticos
│
├── services/
│   └── apiService.ts                # 📡 Función centralizada para llamadas al backend
│
├── styles/
│   └── globals.css                  # 🎨 Estilos globales de Tailwind
│
├── utils/
│   ├── estrellas.ts                 # 🌟 Lógica de estrellas animadas
│   ├── usuario.ts                   # 🧠 Función para construir URL de avatar
│   └── validarRegistro.ts           # ✅ Validación modular y reutilizable para registro
│
├── .env.local                       # ⚙️ Incluye NEXT_PUBLIC_GOOGLE_CLIENT_ID
├── tailwind.config.js               # 🎨 Configuración de Tailwind
├── tsconfig.json                    # ⚙️ Configuración TypeScript
└── next.config.js                   # ⚙️ Configuración de Next.js

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
Autenticación

    /login → Inicio de sesión (correo/contraseña o Google)

    /registro → Registro con validaciones y con Google

Comprador

    /carrito → Ver carrito

    /mis-pedidos → Ver historial de pedidos

    /crear-resena → Escribir nueva reseña con estrellas animadas

    /editar-resena → Editar o eliminar reseñas (si no han sido respondidas)

    /mis-resenas → Listado de reseñas propias

Vendedor

    /vendedor/dashboard-vendedor → Vista completa de ventas, calificaciones, evoluciones y devoluciones

    /responder-resenas directamente desde el dashboard

    /resumen-resenas

Público

    /resenas-producto/[id] → Página para ver reseñas completas de un producto

    Permite mostrar respuestas del vendedor como subcomentario

Inteligencia Artificial

    /ia → Chat con IA para sugerencias de productos

Cuenta

    /cambiar-password

    /recuperar-password

    /reset-password

✨ Componentes Destacados

    Estrellas.tsx: Calificación visual con emojis, vibración y estado offline

    useResenasProducto.ts: Hook para obtener reseñas y promedio reutilizable

    ReseñasBox.tsx: Vista de últimas reseñas debajo del producto

    moderacionService.ts: Verifica y limpia contenido ofensivo antes de enviarlo

    utils/estrellas.ts: Función para renderizar estrella, estrella media o vacía

    Login con Google: usando `@react-oauth/google`

---

## ✨ Funcionalidades Clave

- ⭐ Componente interactivo de estrellas** (vibración, emojis, media estrella)
- ✍️ Edición/eliminación de reseñas** con validación de tiempo
- 💬 Respuesta del vendedor a reseñas**
- 🚫 Moderación de respuestas** (insultos bloqueados)
- 📈 Dashboard del vendedor** con comparativas y ranking
- 📄 Exportar gráficos y resumen PDF**
- 🧾 Validación modular de formularios (`validarRegistro.ts`)
- 💪 Evaluación visual de contraseña (`usePasswordStrength.ts`)
- 🧠 Autenticación con Google y correo/contraseña
- 🔒 Validación de contraseña con barra visual
- ⭐ Sistema de reseñas y respuestas
- 📊 Gráficas dinámicas con Recharts
- 📤 Subida de documentos para validación de vendedores
- 🧾 Descarga de PDF desde gráficas
- 🔍 Moderación de contenido ofensivo
- 🧱 Diseño limpio, modular y responsive
- 🌐 Preparado para internacionalización y expansión a React Native

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