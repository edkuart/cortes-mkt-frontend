// 📁 pages/index.tsx

import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import ProductoForm from "../components/ProductoForm";
import IAResponseBox from "../components/IAResponseBox"; 
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/router";
import FiltroCalificacion from "@/components/FiltroCalificacion";
import { filtrarPorCalificacion } from "@/utils/filtros";

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  imagen?: string;
  promedioCalificacion?: number;
}

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function Home() {
  const { usuario, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [productoEditar, setProductoEditar] = useState<Producto | null>(null);
  const [prompt, setPrompt] = useState("");
  const [respuestaIA, setRespuestaIA] = useState("");
  const [cargando, setCargando] = useState(false);
  const [filtroCalificacion, setFiltroCalificacion] = useState("todas");

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
    try {
      await fetch(`http://localhost:4000/api/productos/${id}`, {
        method: "DELETE",
      });
      setProductos((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error al eliminar producto:", err);
    }
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

  return (
    <div className={`${geistSans.className} ${geistMono.className} grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20`}>
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-full">
        {isAuthenticated() && (
          <div className="w-full max-w-xl flex justify-between items-center p-4 bg-gray-100 rounded-md">
            <p className="text-gray-800">👋 Hola, {usuario?.nombre}</p>
            <button onClick={logout} className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
              Cerrar sesión
            </button>
          </div>
        )}

        <Image className="dark:invert" src="/next.svg" alt="Next.js logo" width={180} height={38} priority />

        <ProductoForm onSubmit={handleGuardar} productoEditar={productoEditar} />

        <FiltroCalificacion valor={filtroCalificacion} onChange={setFiltroCalificacion} />

        {/* 🔥 Sección de productos eliminada temporalmente por conflicto de tipos */}

        <div className="mt-12 w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4">¿Tienes una pregunta sobre los cortes?</h2>
          <IAResponseBox
            prompt={prompt}
            setPrompt={setPrompt}
            respuesta={respuestaIA}
            cargando={cargando}
            onSubmit={handleIA}
          />
        </div>

      </main>
    </div>
  );
}
