// src/components/FormularioReserva.jsx
import { useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { texts } from '../translations';

export default function FormularioReserva({ lang }) {
  const [searchParams] = useSearchParams();
  const asunto = searchParams.get('asunto') || '';
  const formRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = formRef.current;
    if (!window.emailjs) return;
    window.emailjs
      .sendForm('SERVICE_ID', 'TEMPLATE_ID', form)
      .then(() => {
        // TODO: revisar conflictos de horario antes de crear eventos en Google Calendar
        form.reset();
        alert('Solicitud enviada');
      })
      .catch((err) => {
        console.error('EmailJS error', err);
      });
  };

  return (
    <section
      id="reserva"
      className="min-h-screen bg-[#B6BE9C]/70 md:bg-[#B6BE9C] dark:bg-transparent flex flex-col items-center justify-center px-4"
    >
      <div className="mb-8">

        <h1 className="text-4xl volkhov-bold text-center dark:text-white">
          {texts[lang].form.title}
        </h1>

      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="bg-white dark:bg-neutral-800 dark:text-white p-8 rounded-xl shadow-md w-full max-w-md space-y-4">

        {/* Fila 1: Especie / Edad */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">{texts[lang].form.species}</label>
            <input
              type="text"
              name="especie"
              className="w-full border rounded px-3 py-2 dark:bg-neutral-700"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">{texts[lang].form.age}</label>
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
            <label className="block text-sm font-semibold mb-1">{texts[lang].form.neutered}</label>
            <input
              type="text"
              name="castrado"
              className="w-full border rounded px-3 py-2 dark:bg-neutral-700"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">{texts[lang].form.breed}</label>
            <input
              type="text"
              name="raza"
              className="w-full border rounded px-3 py-2 dark:bg-neutral-700"
            />
          </div>
        </div>

        {/* Motivo de consulta (desde URL) */}
        <div>
          <label className="block text-sm font-semibold mb-1">{texts[lang].form.reason}</label>
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
          <label className="block text-sm font-semibold mb-1">{texts[lang].form.tutor}</label>
          <input
            type="text"
            name="tutor"
            className="w-full border rounded px-3 py-2 dark:bg-neutral-700"
          />
        </div>

        {/* Mensaje */}
        <div>
          <label className="block text-sm font-semibold mb-1">{texts[lang].form.message}</label>
          <textarea
            name="mensaje"
            className="w-full border rounded px-3 py-2 h-24 dark:bg-neutral-700"
          />
        </div>

        <button
          type="submit"
          className="bg-primary text-white px-6 py-2 rounded hover:bg-[#5c7c4d]"
        >
          {texts[lang].form.submit}
        </button>
      </form>
    </section>
  );
}
