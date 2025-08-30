// src/components/FormularioReserva.jsx
import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import TitleWithClouds from './TitleWithClouds';

export default function FormularioReserva() {
  const [searchParams] = useSearchParams();
  const asunto = searchParams.get('asunto') || '';
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: import.meta.env.VITE_EMAILJS_SERVICE_ID,
          template_id: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
          user_id: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
          template_params: Object.fromEntries(formData.entries()),
        }),
      });
      if (res.ok) {
        setStatus('success');
        e.target.reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <section
      id="reserva"
      className="min-h-screen bg-[#C5E0D8] md:bg-[#F6E9DF] dark:bg-transparent flex flex-col items-center justify-center px-4"
    >
      <div className="mb-8">
        <TitleWithClouds as="h1" className="text-4xl volkhov-bold text-center dark:text-white">
          RESERVA TU HORA
        </TitleWithClouds>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-neutral-800 dark:text-white p-8 rounded-xl shadow-md w-full max-w-md space-y-4">

        {/* Fila 1: Especie / Edad */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Especie</label>
            <input
              type="text"
              name="especie"
              className="w-full border rounded px-3 py-2 dark:bg-neutral-700"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Edad</label>
            <input
              type="text"
              name="edad"
              className="w-full border rounded px-3 py-2 dark:bg-neutral-700"
            />
          </div>
        </div>

        {/* Fila 2: Castrado / Raza */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Castrado</label>
            <input
              type="text"
              name="castrado"
              className="w-full border rounded px-3 py-2 dark:bg-neutral-700"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Raza</label>
            <input
              type="text"
              name="raza"
              className="w-full border rounded px-3 py-2 dark:bg-neutral-700"
            />
          </div>
        </div>

        {/* Motivo de consulta (desde URL) */}
        <div>
          <label className="block text-sm font-semibold mb-1">Motivo de Consulta</label>
          <input
            type="text"
            name="asunto"
            value={asunto}
            readOnly
            className="w-full border rounded px-3 py-2 bg-gray-100 dark:bg-neutral-700"
          />
        </div>

        {/* Tutor */}
        <div>
          <label className="block text-sm font-semibold mb-1">Nombre compañero/tutor</label>
          <input
            type="text"
            name="tutor"
            className="w-full border rounded px-3 py-2 dark:bg-neutral-700"
          />
        </div>

        {/* Mensaje */}
        <div>
          <label className="block text-sm font-semibold mb-1">Mensaje</label>
          <textarea
            name="mensaje"
            className="w-full border rounded px-3 py-2 h-24 dark:bg-neutral-700"
          />
        </div>

        <button
          type="submit"
          className="bg-primary text-white px-6 py-2 rounded hover:bg-[#5c7c4d]"
        >
          Reservar Hora
        </button>
      </form>
      {status === 'success' && (
        <p className="mt-4 text-green-600">Solicitud enviada</p>
      )}
      {status === 'error' && (
        <p className="mt-4 text-red-600">Hubo un problema, inténtalo más tarde</p>
      )}
    </section>
  );
}
