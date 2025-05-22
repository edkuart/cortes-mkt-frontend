// 📁 pages/index.tsx

import Image from "next/image";
import ProductoForm from "../components/ProductoForm";
import IAResponseBox from "../components/IAResponseBox"; 
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/router";
import FiltroCalificacion from "../components/FiltroCalificacion";
import { filtrarPorCalificacion } from "../utils/filtros";
import UserDropdownMenu from "../components/UserDropdownMenu";
import FondoAnimado from "../components/FondoAnimado";
import TarjetaGlass from "../components/TarjetaGlass";
import Link from "next/link";

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  imagen?: string;
  promedioCalificacion?: number;
}

export default function Home() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [productoEditar, setProductoEditar] = useState<Producto | null>(null);
  const [prompt, setPrompt] = useState("");
  const [respuestaIA, setRespuestaIA] = useState("");
  const [cargando, setCargando] = useState(false);
  const [filtroCalificacion, setFiltroCalificacion] = useState("todas");
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("token")) {
      router.push("/login");
    }
  }, []);

  useEffect(() => {
    fetch("http://localhost:4000/api/productos")
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch((err) => console.error("Error al obtener productos:", err));
  }, []);

  const handleGuardar = async (formData: FormData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("No autenticado");

      const res = await fetch("http://localhost:4000/api/productos", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (!res.ok) throw new Error("Error creando producto");

      const data = await res.json();
      setProductos((prev) => [...prev, data]);
    } catch (err) {
      console.error("Error al guardar producto:", err);
    }
  };

  const handleEliminar = async (id: number) => {
    const confirmar = window.confirm("¿Estás seguro de que querés eliminar este producto?");
    if (!confirmar) return;

    try {
      await fetch(`http://localhost:4000/api/productos/${id}`, {
        method: "DELETE",
      });
      setProductos((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error al eliminar producto:", err);
    }
  };

  const handleEditar = (producto: Producto) => {
    setProductoEditar(producto);
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleIA = async () => {
    if (!prompt.trim()) return;
    setCargando(true);
    try {
      const res = await fetch("http://localhost:4000/api/ia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setRespuestaIA(data.respuesta);
    } catch (error) {
      console.error("❌ Error al conectar con IA:", error);
      setRespuestaIA("Error al obtener respuesta de la IA.");
    } finally {
      setCargando(false);
    }
  };

  const productosFiltrados = filtrarPorCalificacion(productos, filtroCalificacion);
  productosFiltrados.sort((a, b) => (b.promedioCalificacion ?? 0) - (a.promedioCalificacion ?? 0));

  const productosDestacados = productos.filter(p => (p.promedioCalificacion ?? 0) >= 4.5);

  return (
    <FondoAnimado>
      <div className="font-sans grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <header className="w-full flex justify-between items-center">
          <div className="flex items-center gap-4">
            {isAuthenticated() && (
              <UserDropdownMenu
                avatar={user?.fotoPerfil ? `http://localhost:4000/${user.fotoPerfil}` : undefined}
                nombre={user?.nombre || "Usuario"}
                logout={logout}
              />
            )}
          </div>
        </header>

        <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-full">
          <Image src="/hero-cortes.jpg" alt="Cortes típicos guatemaltecos" width={1024} height={400} className="rounded-2xl shadow-lg object-cover w-full max-h-[400px]" />

          <h1 className="text-4xl sm:text-5xl font-bold text-jade text-center mt-8">Conectando tradición con tecnología</h1>
          <p className="text-lg text-madera text-center max-w-2xl">Explorá y vendé los cortes típicos más bellos de Guatemala, desde cualquier parte del país.</p>

          {/* Productos destacados */}
          {productosDestacados.length > 0 && (
            <TarjetaGlass className="w-full max-w-5xl">
              <h2 className="text-2xl font-bold text-center mb-6">🔥 Productos destacados</h2>
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                {productosDestacados.map(producto => (
                  <div key={producto.id} className="bg-white/60 dark:bg-black/30 p-4 rounded-xl shadow flex flex-col gap-2">
                    {producto.imagen ? (
                      <Image
                        src={`http://localhost:4000/${producto.imagen}`}
                        alt={producto.nombre}
                        width={400}
                        height={300}
                        className="rounded-lg object-cover w-full h-48"
                      />
                    ) : (
                      <div className="bg-gray-200 dark:bg-gray-700 w-full h-48 rounded-lg flex items-center justify-center text-gray-500 text-sm italic">
                        Sin imagen
                      </div>
                    )}
                    <p className="text-lg font-semibold text-jade">{producto.nombre}</p>
                    <p className="text-sm text-madera">Q{producto.precio.toFixed(2)}</p>
                    {producto.promedioCalificacion && (
                      <p className="text-sm text-yellow-600">⭐ {producto.promedioCalificacion.toFixed(1)}</p>
                    )}
                    <div className="flex gap-2 pt-2">
                      <button onClick={() => handleEditar(producto)} className="text-sm text-blue-600 hover:underline">✏️ Editar</button>
                      <button onClick={() => handleEliminar(producto.id)} className="text-sm text-red-600 hover:underline">🗑 Eliminar</button>
                    </div>
                  </div>
                ))}
              </div>
            </TarjetaGlass>
          )}

          <TarjetaGlass ref={formRef} className="w-full max-w-xl">
            <ProductoForm onSubmit={handleGuardar} productoEditar={productoEditar} />
          </TarjetaGlass>

          <div className="w-full max-w-xl">
            <FiltroCalificacion valor={filtroCalificacion} onChange={setFiltroCalificacion} />
          </div>

          <TarjetaGlass className="mt-12 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">¿Tienes una pregunta sobre los cortes?</h2>
            <IAResponseBox
              prompt={prompt}
              setPrompt={setPrompt}
              respuesta={respuestaIA}
              cargando={cargando}
              onSubmit={handleIA}
            />
          </TarjetaGlass>

          <TarjetaGlass className="mt-12 w-full max-w-4xl">
            <h2 className="text-2xl font-bold text-center mb-6">🌟 Testimonios de clientes felices</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="bg-white/60 dark:bg-black/40 p-4 rounded-xl shadow">
                <p className="text-madera dark:text-gray-100 italic">“Excelente calidad, me llegó rápido y en buen estado.”</p>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">– Ana M.</p>
              </div>
              <div className="bg-white/60 dark:bg-black/40 p-4 rounded-xl shadow">
                <p className="text-madera dark:text-gray-100 italic">“Una experiencia increíble. Pude contactar con la vendedora fácilmente.”</p>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">– Luis R.</p>
              </div>
              <div className="bg-white/60 dark:bg-black/40 p-4 rounded-xl shadow">
                <p className="text-madera dark:text-gray-100 italic">“La página es intuitiva y encontré justo lo que buscaba.”</p>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">– Marta Q.</p>
              </div>
            </div>
          </TarjetaGlass>
        </main>

        <footer className="w-full text-center text-sm text-gray-500 py-4 border-t border-white/20">
          <p>
            © {new Date().getFullYear()} Mercado de Cortes Típicos |{' '}
            <Link href="/politicas" className="hover:underline text-jade">Políticas</Link>{' '}|
            <Link href="/contacto" className="hover:underline text-jade"> Contacto</Link>
          </p>
        </footer>
      </div>
    </FondoAnimado>
  );
}
