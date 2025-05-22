//📁 utils/pdfExport.ts

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import dayjs from 'dayjs';

interface Usuario {
  nombre: string;
  correo: string;
}

export default async function exportarPDFDesdeSeccion(
  seccionRef: HTMLElement | null,
  usuario: Usuario,
  nombreArchivo: string
) {
  if (!seccionRef || !usuario) return;

  const canvas = await html2canvas(seccionRef);
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF();
  const imgProps = pdf.getImageProperties(imgData);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  const timestamp = dayjs().format('YYYY-MM-DD_HH-mm');

  pdf.setFontSize(10);
  pdf.text(`Usuario: ${usuario.nombre}`, 10, 10);
  pdf.text(`Correo: ${usuario.correo}`, 10, 15);
  pdf.addImage(imgData, 'PNG', 0, 20, pdfWidth, pdfHeight);
  pdf.save(`${nombreArchivo}_${timestamp}.pdf`);
}