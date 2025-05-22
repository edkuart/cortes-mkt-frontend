// 📁 components/DashboardVendedor/ResenasRecientes.tsx

import React, { useState, useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';

interface Reseña {
  id: number;
  comentario: string;
  calificacion: number;
  createdAt: string;
  Comprador?: { nombreCompleto: string };
}

interface Props {
  resenas: Reseña[];
  filtro: 'todas' | 'positivas' | 'negativas';
  setFiltro: (filtro: 'todas' | 'positivas' | 'negativas') => void;
}

const ResenasRecientes: React.FC<Props> = ({ resenas, filtro, setFiltro }) => {
  const [pagina, setPagina] = useState(1);
  const [busqueda, setBusqueda] = useState('');
  const [orden, setOrden] = useState<'fecha' | 'calificacion'>('fecha');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [expandidaIds, setExpandidaIds] = useState<number[]>([]);
  const inputBusquedaRef = useRef<HTMLInputElement>(null);
  const porPagina = 5;

  useEffect(() => {
    const ultimoFiltro = localStorage.getItem('resenasFiltro');
    if (ultimoFiltro === 'positivas' || ultimoFiltro === 'negativas' || ultimoFiltro === 'todas') {
      setFiltro(ultimoFiltro);
    }
  }, [setFiltro]);

  useEffect(() => {
    localStorage.setItem('resenasFiltro', filtro);
  }, [filtro]);

  useEffect(() => {
    if (modalAbierto && inputBusquedaRef.current) {
      inputBusquedaRef.current.focus();
    }
  }, [modalAbierto]);

  useEffect(() => {
    const cerrarConEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModalAbierto(false);
    };
    document.addEventListener('keydown', cerrarConEscape);
    return () => document.removeEventListener('keydown', cerrarConEscape);
  }, []);

  const resaltado = (texto: string, palabra: string) => {
    if (!palabra) return texto;
    const partes = texto.split(new RegExp(`(${palabra})`, 'gi'));
    return partes.map((parte, i) =>
      parte.toLowerCase() === palabra.toLowerCase() ? <mark key={i}>{parte}</mark> : parte
    );
  };

  const toggleExpandida = (id: number) => {
    setExpandidaIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const filtradas = Array.isArray(resenas) ? resenas.filter((r) => {
    const coincideFiltro =
      (filtro === 'positivas' && r.calificacion >= 4) ||
      (filtro === 'negativas' && r.calificacion <= 2) ||
      filtro === 'todas';
    const coincideBusqueda = r.comentario.toLowerCase().includes(busqueda.toLowerCase());
    return coincideFiltro && coincideBusqueda;
  }) : [];

  const ordenadas = filtradas.sort((a, b) => {
    if (orden === 'fecha') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      return b.calificacion - a.calificacion;
    }
  });

  const totalPaginas = Math.ceil(ordenadas.length / porPagina);
  const actuales = ordenadas.slice((pagina - 1) * porPagina, pagina * porPagina);

  const exportarResenasPDF = () => {
    const input = document.getElementById('bloque-reseñas');
    if (!input) return toast.error('No se encontró el bloque de reseñas');

    html2canvas(input).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('reseñas-vendedor.pdf');
    });
  };

  const exportarResenasCSV = () => {
    if (actuales.length === 0) return toast.error('No hay reseñas para exportar');

    const encabezado = 'Calificación,Comentario,Cliente,Fecha\n';
    const filas = actuales.map(r => {
      const cliente = r.Comprador?.nombreCompleto || 'Cliente';
      const fecha = dayjs(r.createdAt).format('DD/MM/YYYY');
      const comentarioLimpio = r.comentario.replace(/\n/g, ' ').replace(/"/g, '""');
      return `"${r.calificacion}","${comentarioLimpio}","${cliente}","${fecha}"`;
    });

    const csv = encabezado + filas.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'reseñas-filtradas.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getColorYIcono = (calificacion: number) => {
    if (calificacion >= 4) return { clase: 'text-green-600', icono: '✅' };
    if (calificacion <= 2) return { clase: 'text-red-500', icono: '⚠️' };
    return { clase: 'text-yellow-600', icono: '🟡' };
  };

  if (ordenadas.length === 0) return null;

  return (
    <div className="col-span-1 md:col-span-2 bg-white p-4 shadow rounded" role="region" aria-label="Últimas reseñas de clientes">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
        <h2 className="text-lg font-semibold">📜 Últimas reseñas</h2>
        <div className="flex items-center gap-2 flex-wrap">
          <input
            ref={inputBusquedaRef}
            type="text"
            placeholder="🔍 Buscar comentario..."
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setPagina(1);
            }}
            className="text-sm border px-2 py-1 rounded w-48"
          />
          <select
            className="text-sm border px-2 py-1 rounded"
            value={filtro}
            onChange={(e) => {
              setFiltro(e.target.value as any);
              setPagina(1);
            }}
          >
            <option value="todas">Todas</option>
            <option value="positivas">Positivas (4-5)</option>
            <option value="negativas">Negativas (1-2)</option>
          </select>
          <select
            className="text-sm border px-2 py-1 rounded"
            value={orden}
            onChange={(e) => {
              setOrden(e.target.value as 'fecha' | 'calificacion');
              setPagina(1);
            }}
          >
            <option value="fecha">📆 Ordenar por fecha</option>
            <option value="calificacion">⭐ Ordenar por calificación</option>
          </select>
          <button
            onClick={() => setModalAbierto(true)}
            className="text-sm px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            🔍 Ver todas
          </button>
          <button
            onClick={exportarResenasPDF}
            className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            📄 Exportar PDF
          </button>
          <button
            onClick={exportarResenasCSV}
            className="text-sm px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
          >
            📊 Exportar CSV
          </button>
        </div>
      </div>

      <div id="bloque-reseñas">
        <ul className="space-y-2">
          {actuales.map((r) => {
            const { clase, icono } = getColorYIcono(r.calificacion);
            const esExpandida = expandidaIds.includes(r.id);
            const comentarioMostrar = esExpandida
              ? r.comentario
              : r.comentario.length > 200
              ? `${r.comentario.slice(0, 200)}...`
              : r.comentario;
            return (
              <li key={r.id} className="border-b pb-2">
                <p className={`text-sm ${clase}`}>
                  {icono} {resaltado(comentarioMostrar, busqueda)}
                </p>
                {r.comentario.length > 200 && (
                  <button
                    onClick={() => toggleExpandida(r.id)}
                    className="text-blue-600 text-xs underline mt-1"
                  >
                    {esExpandida ? 'Leer menos' : 'Leer más'}
                  </button>
                )}
                <p className="text-xs text-gray-500">
                  {r.Comprador?.nombreCompleto || 'Cliente'} - {dayjs(r.createdAt).format('DD/MM/YYYY')}
                </p>
              </li>
            );
          })}
        </ul>

        <div className="flex justify-between mt-4">
          <button
            disabled={pagina === 1}
            onClick={() => setPagina(p => Math.max(1, p - 1))}
            className="text-sm px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            ⬅ Anterior
          </button>
          <span className="text-sm text-gray-600">Página {pagina} de {totalPaginas}</span>
          <button
            disabled={pagina === totalPaginas}
            onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
            className="text-sm px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Siguiente ➡
          </button>
        </div>
      </div>

      {modalAbierto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full p-6 overflow-y-auto max-h-[80vh]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">📋 Todas las reseñas</h3>
              <button
                onClick={() => setModalAbierto(false)}
                className="text-red-600 hover:underline"
              >
                ✖ Cerrar
              </button>
            </div>
            <ul className="space-y-2">
              {ordenadas.map((r) => {
                const { clase, icono } = getColorYIcono(r.calificacion);
                return (
                  <li key={r.id} className="border-b pb-2">
                    <p className={`text-sm font-medium ${clase}`}>
                      {icono} {r.calificacion} - "{resaltado(r.comentario, busqueda)}"
                    </p>
                    <p className="text-xs text-gray-500">
                      {r.Comprador?.nombreCompleto || 'Cliente'} - {dayjs(r.createdAt).format('DD/MM/YYYY')}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResenasRecientes;