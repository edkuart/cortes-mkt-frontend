// 📁 pages/resenas-producto/resumen.tsx

import React from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';

const ResumenMensualResenas = dynamic(
    () => import('../../components/ResumenMensualResenas'), 
    { ssr: false });


export default function ResumenResenasPage() {
  return (
    <>
      <Head>
        <title>Resumen Mensual de Reseñas</title>
      </Head>
      <main className="p-6 max-w-4xl mx-auto">
        <ResumenMensualResenas />
      </main>
    </>
  );
}
