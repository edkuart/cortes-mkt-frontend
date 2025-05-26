// 📁 pages/productos/historial/[id].tsx

import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Link from 'next/link';

interface Cambio {
  id: number;
  productoId: number;
  campo: string;
  valorAnterior: string;
  valorNuevo: string;
  imagenAnterior?: string;
  imagenNueva?: string;
  usuario?: string;
  createdAt: string;
}

export default function HistorialProductoPage() {
  const router = useRouter();
  const { id } = router.query;
  const [cambios, setCambios] = useState<Cambio[]>([]);
  const [loading, setLoading] = useState(true);
  const pdfRef = useRef<HTMLDivElement>(null);
  const [filtro, setFiltro] = useState<string>('todos');

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:4000/api/historial/${id}`)
        .then(res => res.json())
        .then(data => setCambios(data))
        .catch(() => toast.error('Error al cargar historial'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const descargarPDF = async () => {
    if (!pdfRef.current) return;
    const canvas = await html2canvas(pdfRef.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`historial_producto_${id}.pdf`);
  };

  const cambiosFiltrados = filtro === 'todos' ? cambios : cambios.filter(c => c.campo === filtro);
  const camposUnicos = Array.from(new Set(cambios.map(c => c.campo)));

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">📜 Historial de Cambios del Producto #{id}</h1>

      <div className="mb-4 flex justify-between flex-wrap gap-4 items-center">
        <div className="text-sm text-gray-600 space-x-2">
          <span>🔎 Filtrar por campo:</span>
          <button onClick={() => setFiltro('todos')} className={filtro === 'todos' ? 'font-bold underline' : ''}>Todos</button>
          {camposUnicos.map(campo => (
            <button key={campo} onClick={() => setFiltro(campo)} className={filtro === campo ? 'font-bold underline text-blue-600' : ''}>{campo}</button>
          ))}
        </div>
        <button onClick={descargarPDF} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
          📄 Exportar historial a PDF
        </button>
      </div>

      <div ref={pdfRef}>
        {loading ? (
          <p className="text-gray-500">Cargando historial...</p>
        ) : cambiosFiltrados.length === 0 ? (
          <p className="text-gray-500">Este producto no tiene cambios registrados.</p>
        ) : (
          <ul className="space-y-4">
            {cambiosFiltrados.map((cambio) => (
              <li key={cambio.id} className="border rounded-lg p-4 bg-white shadow">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-700">
                    <strong>Cambio:</strong> <span className="text-blue-700 font-semibold">{cambio.campo}</span>
                  </p>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded">{cambio.campo}</span>
                </div>
                <p className="text-sm">
                  <span className="text-red-600 line-through">{cambio.valorAnterior}</span> →{' '}
                  <span className="text-green-600 font-semibold">{cambio.valorNuevo}</span>
                </p>
                {(cambio.imagenAnterior || cambio.imagenNueva) && (
                  <div className="flex gap-4 mt-2">
                    {cambio.imagenAnterior && (
                      <div>
                        <p className="text-xs text-gray-500">Antes:</p>
                        <img src={cambio.imagenAnterior} alt="Imagen anterior" className="w-20 h-20 rounded border" />
                      </div>
                    )}
                    {cambio.imagenNueva && (
                      <div>
                        <p className="text-xs text-gray-500">Después:</p>
                        <img src={cambio.imagenNueva} alt="Imagen nueva" className="w-20 h-20 rounded border" />
                      </div>
                    )}
                  </div>
                )}
                {cambio.usuario && (
                  <p className="text-xs text-gray-500 mt-1">Modificado por: {cambio.usuario}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  {dayjs(cambio.createdAt).format('DD/MM/YYYY HH:mm')}hs
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}