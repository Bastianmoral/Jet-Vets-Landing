// src/components/FormularioReserva.jsx
import { useSearchParams } from 'react-router-dom';
import TitleWithClouds from './TitleWithClouds';

export default function FormularioReserva() {
  const [searchParams] = useSearchParams();
  const asunto = searchParams.get('asunto') || '';

  return (

    <section id="reserva" className="min-h-screen bg-[#C5E0D8] md:bg-[#F6E9DF] dark:bg-transparent flex flex-col items-center justify-center px-4">
      <div className="mb-8"><TitleWithClouds as="h1" className="text-4xl volkhov-bold text-center dark:text-white">RESERVA TU HORA</TitleWithClouds></div>
      <form className="bg-white dark:bg-neutral-800 dark:text-white p-8 rounded-xl shadow-md w-full max-w-md space-y-4">

    <section id="reserva" className="min-h-screen bg-[#C5E0D8] md:bg-[#F6E9DF] flex flex-col items-center justify-center px-4">
      <div className="mb-8"><TitleWithClouds as="h1" className="text-4xl volkhov-bold text-center">RESERVA TU HORA</TitleWithClouds></div>
      <form className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-4">

        <div className="grid-col">
          <label className="text-sm font-semibold mb-1">Especie</label>
          <input type="text" name="nombre" className="border rounded w-20 ml-2 mr-2 py-1 dark:bg-neutral-700" />
          <label className="text-sm font-semibold mb-1">Edad</label>
          <input type="text" name="nombre" className="border rounded w-20 ml-2 mr-2 py-1 dark:bg-neutral-700" />
        </div>
        <div className="grid-col">
          <label className="text-sm font-semibold mb-1">Castrado</label>
          <input type="text" name="Castrado" className="border rounded w-20 ml-2 mr-2 py-1 dark:bg-neutral-700" />
          <label className="text-sm font-semibold mb-1">Raza</label>
          <input type="text" name="Raza" className="border rounded w-20 ml-2 mr-2 py-1 dark:bg-neutral-700" />
        </div>
        <div className="grid-col">
          <label className="block text-sm font-semibold mb-1">Motivo de Consulta</label>
          <input type="text" name="asunto" value={asunto} readOnly className="w-full border rounded px-3 py-2 bg-gray-100 dark:bg-neutral-700" />
        </div>
        <div>
          <label className="text-sm font-semibold mb-1">Nombre compañero/tutor</label>
          <input type="text" name="nombre" className="border rounded w-[52%] ml-2 mr-2 py-1 dark:bg-neutral-700" />
        </div>
        <div className="grid-col">
          <label className="text-sm font-semibold mb-1">Mensaje</label>
          <textarea name="mensaje" className="w-full border rounded px-3 py-2 h-24 dark:bg-neutral-700"></textarea>
        </div>
        <button type="submit" className="bg-primary text-white px-6 py-2 rounded hover:bg-[#5c7c4d]">
          Reservar Hora
        </button>
      </form>
    </section>
  );
}

// Asegúrate que App.jsx tenga esta ruta:
// <Route path="/reserva" element={<FormularioReserva />} />

// Y que el botón de las cartas apunte a /reserva?asunto=...
