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
- dayjs → Para formateo de fechas en el dashboard y reseñas.
- classnames 
---

frontend/
├── components/
│   ├── Form/
│   │   ├── InputArchivo.tsx          # 📤 Input especializado para archivos (vendedor)
│   │   ├── InputText.tsx             # 🧾 Reutilizable para inputs de texto/email/password
│   │   └── SelectRol.tsx             # 👤 Selector de rol (comprador/vendedor)
│   ├── ConversacionCard.tsx          # 💬 Card para mostrar chats previos
│   ├── Estrellas.tsx                 # ⭐ Visualizador de calificación
│   ├── FondoAnimado.tsx              # 🌄 Fondo animado con partículas
│   ├── HeroPrincipal.tsx             # 🧵 Sección principal con mensaje hero
│   ├── IAResponseBox.tsx             # 🤖 Respuestas generadas por IA
│   ├── InsigniasVendedor.tsx         # 🥇 Muestra insignias en productos y perfiles
│   ├── Layout.tsx                    # 🧱 Layout general con menú de usuario y título
│   ├── PedidoCard.tsx                # 🧾 Vista individual de un pedido
│   ├── PedidoForm.tsx                # 📥 Formulario de solicitud
│   ├── ProductoCard.tsx              # 🛍 Vista individual de producto
│   ├── ProductoForm.tsx              # 🧾 Formulario para crear producto
│   ├── ReseñasBox.tsx                # ✍️ Caja para ver y dejar reseñas
│   ├── SolicitarDevolucion.tsx       # 📦 Solicitud de devolución
│   ├── TarjetaGlass.tsx              # 🧊 Componente visual con estilo glassmorphism
│   ├── TituloPrincipal.tsx           # 🏷 Título reutilizable del sitio
│   ├── UserDropdownMenu.tsx          # 👤 Menú desplegable del usuario
│   └── DashboardVendedor/
│       ├── GraficoEvolucion.tsx      # 📈 Gráfico combinado de métricas por mes
│       ├── ResenasRecientes.tsx      # ✍️ Reseñas recientes filtrables
│       ├── ResumenRanking.tsx        # 🏅 Posición y rendimiento del vendedor
│       ├── ResumenVentas.tsx         # 💵 Resumen financiero de ventas
│       ├── TablaDevoluciones.tsx     # 📦 Tabla con devoluciones pendientes
│       ├── TopClientes.tsx           # 👥 Clientes con más compras
│       └── TopProductos.tsx          # 🔥 Productos más vendidos (gráfico/tabla)
│
├── hooks/
│   ├── useAuth.ts                    # 🔐 Autenticación con token localStorage
│   ├── useIA.ts                      # ⚙️ Llamadas a la IA
│   ├── usePasswordStrength.ts        # 💪 Fortaleza de contraseña
│   ├── useResenasProducto.ts         # 🔁 Hook para reseñas públicas de producto
│   ├── useFormularioRegistro.ts      # 🧾 Formulario de registro centralizado
│   └── usePedidosResumen.ts          # 📊 Procesamiento de pedidos para estadísticas
│
├── pages/
│   ├── api/
│   │   └── hello.ts
│   ├── cambiar-password.tsx          # 🔑 Cambiar contraseña (usuario logueado)
│   ├── ia.tsx                        # 🧠 Chat con IA integrada
│   ├── index.tsx                     # 🏠 Landing page
│   ├── login.tsx                     # 🔐 Login con correo o Google
│   ├── perfil.tsx                    # 👤 Página de edición de perfil
│   ├── registro.tsx                  # ✅ Registro con validaciones
│   ├── reset-password.tsx            # 🔐 Reset con token por correo
│   ├── recuperar-password.tsx        # 📨 Solicitud de recuperación
│   ├── mensajes/
│   │   └── [id].tsx                  # 💬 Vista de conversación
│   ├── productos/
│   │   └── historial/
│   │       └── [id].tsx              # 📜 Historial de cambios de un producto
│   ├── resenas-producto/
│   │   ├── [id].tsx                  # 📋 Reseñas por producto
│   │   └── resumen.tsx               # 📊 Estadísticas globales de reseñas
│   ├── comprador/
│   │   ├── carrito.tsx               # 🛒 Carrito de compras
│   │   ├── crear-resena.tsx          # ✍️ Nueva reseña de pedido
│   │   ├── editar-resena.tsx         # 📝 Edición de reseña previa
│   │   ├── mis-pedidos.tsx           # 📦 Historial del comprador
│   │   ├── mis-resenas.tsx           # 📋 Lista de reseñas hechas
│   │   └── perfil-comprador.tsx      # 📘 Perfil y resumen del comprador
│   └── vendedor/
│       ├── dashboard-vendedor.tsx    # 📈 Dashboard con métricas
│       ├── panel-vendedor.tsx        # 🧮 Vista general del vendedor
│       ├── Pedidos-Vendedor.tsx      # 📋 Pedidos recibidos
│       ├── responder-resenas.tsx     # ✍️ Gestionar respuestas a reseñas
│       ├── resumen-resenas.tsx       # 📊 Estadísticas de calificaciones
│       └── perfil-vendedor/
│           └── [id].tsx              # 🧑‍💼 Perfil público del vendedor
│
├── public/
│   └── (imágenes, íconos, etc.)      # 📁 Recursos estáticos
│
├── services/
│   ├── actividadService.ts           # 📊 Actividad del comprador
│   ├── apiService.ts                 # 📡 Llamadas centralizadas al backend
│   └── moderacionService.ts          # 🚫 Filtro de contenido ofensivo
│
├── styles/
│   └── globals.css                   # 🎨 Estilos globales Tailwind
│
├── utils/
│   ├── estrellas.ts                  # 🌟 Cálculo de estrellas animadas
│   ├── usuario.ts                    # 🧠 Avatar y datos visuales del usuario
│   ├── validarRegistro.ts            # ✅ Validaciones para el registro
│   └── pdfExport.ts                  # 📄 Función para exportar divs a PDF
│
├── .env.local                        # ⚙️ Variables de entorno (cliente)
├── tailwind.config.js               # 🎨 Configuración Tailwind
├── tsconfig.json                    # ⚙️ Configuración TS
└── next.config.js                   # ⚙️ Configuración Next.js

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

    /perfil-comprador → Panel de actividad como comprador (pedidos, reseñas, total gastado)

    /historial/[id] → Historial de cambios realizados sobre un producto

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

    InsigniasVendedor.tsx: Para mostrar insignias como "Top" o "Verificado"

    ConversacionCard.tsx: Tarjeta que resume una conversación en mensajes

    perfil-comprador.tsx: Página con total gastado, últimos pedidos, etc.

    actividadService.ts: Nuevo servicio que centraliza lógica de dashboard comprador

---

 ✨ Funcionalidades Clave

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
- 📄 Exportar actividad a PDF desde perfil del comprador
- 🛍 Historial de cambios en producto visible por admins y vendedores
- 📬 Resumen de conversaciones activas (últimos mensajes con otros usuarios)
- 🧾 Filtros de reseñas con persistencia (almacenado en localStorage)
- 🔐 Redirección automática en rutas protegidas con toast y setTimeout
- 🧠 Centralización de llamadas a la API en carpeta services/

---

🛠 Notas Adicionales

    Todas las reseñas pueden incluir respuestas de los vendedores

    Las respuestas aparecen como subcomentarios en el frontend

    Si se detecta una palabra ofensiva en una reseña o respuesta, se bloquea automáticamente con mensaje de error

    Las estrellas funcionan offline y guardan temporalmente la calificación si no hay red

    Todo es modular para su futura integración en React Native

    Las reseñas del comprador pueden filtrarse y exportarse como PDF

    El sistema recuerda el filtro de reseñas seleccionado en el perfil

    Se valida automáticamente que solo los compradores accedan a /perfil-comprador

    Cada reseña puede ser vista con el producto asociado

---

## 📬 Contacto

    Para dudas o sugerencias: [edkuart@gmail.com](mailto:edkuart@gmail.com)

    ✨ Proyecto en desarrollo continuo, con enfoque en experiencia de usuario, visualización clara y escalabilidad. Se planea integrar reputación de vendedor, insignias y filtros por reseña próximamente.

Nuevas secciones / cambios:

    perfil-comprador.tsx con estadísticas y filtros

    historialController.js y vista /productos/historial/[id]

    actividadService.ts para llamadas agrupadas

    InsigniasVendedor.tsx para mostrar medallas como "Top Vendedor"

    UserDropdownMenu.tsx actualizado con acceso a /cambiar-password