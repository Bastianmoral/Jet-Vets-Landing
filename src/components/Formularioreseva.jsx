// src/components/FormularioReserva.jsx
import { useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import emailjs from '@emailjs/browser';

// Íconos (no se verán en <select>, sirven para un dropdown custom futuro)

const SERVICES = [
  { titulo: 'Medicina general' },
  { titulo: 'Vacunación y desparasitación' },
  { titulo: 'Identificación de animales' },
  { titulo: 'Análisis clínicos' },
  { titulo: 'Certificados de salud y de viaje'},
  { titulo: 'Atención geriátrica'},
  { titulo: 'Diagnóstico por imagen (Radiografía y ecografía)' },
  { titulo: 'Cirugía' },
  { titulo: 'Traumatología' },
  { titulo: 'Otro motivo' },
];

export default function FormularioReserva() {
  const [searchParams] = useSearchParams();
  const asuntoParam = searchParams.get('asunto') || '';

  // Si viene por URL y existe en la lista, lo usamos como default
  const initialAsunto = SERVICES.some(s => s.titulo === asuntoParam) ? asuntoParam : '';

  const formRef = useRef(null);
  const [enviando, setEnviando] = useState(false);

  const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      alert('Error de configuración de EmailJS');
      return;
    }
    try {
      setEnviando(true);
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, { publicKey: PUBLIC_KEY });
      formRef.current.reset();
      alert('Solicitud enviada');
    } catch (err) {
      console.error('EmailJS error', err);
      alert('No se pudo enviar. Intenta nuevamente.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section
      id="reserva"
      className="min-h-screen bg-[#B6BE9C]/70 md:bg-[#B6BE9C] dark:bg-transparent flex flex-col items-center justify-center px-4"
    >
      <div className="mb-8">
        <h1 className="text-4xl volkhov-bold text-center dark:text-white">RESERVA TU HORA</h1>
      </div>

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="bg-white dark:bg-neutral-800 dark:text-white p-8 rounded-xl shadow-md w-full max-w-md space-y-4"
      >
        <input
  type="text"
  name="company"
  autoComplete="off"
  tabIndex="-1"
  className="hidden"
/>
        {/* Datos del paciente */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Especie</label>
            <input type="text" name="especie" required className="w-full border rounded px-3 py-2 dark:bg-neutral-700" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Edad</label>
            <input type="text" name="edad" required className="w-full border rounded px-3 py-2 dark:bg-neutral-700" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Castrado</label>
            <select name="castrado" required className="w-full border rounded px-3 py-2 dark:bg-neutral-700" defaultValue="">
              <option value="" disabled>Selecciona…</option>
              <option value="Sí">Sí</option>
              <option value="No">No</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Raza</label>
            <input type="text" name="raza" required className="w-full border rounded px-3 py-2 dark:bg-neutral-700" />
          </div>
        </div>

        {/* Motivo de consulta como SELECT */}
        <div>
          <label className="block text-sm font-semibold mb-1">Motivo de consulta</label>
          <select
            name="asunto"              // se mantiene para EmailJS: {{asunto}}
            required
            className="w-full border rounded px-3 py-2 dark:bg-neutral-700"
            defaultValue={initialAsunto || ''}
          >
            <option value="" disabled>Selecciona un servicio…</option>
            {SERVICES.map(s => (
              <option key={s.titulo} value={s.titulo}>{s.titulo}</option>
            ))}
          </select>
        </div>

        {/* Datos de contacto */}
        <div>
          <label className="block text-sm font-semibold mb-1">Nombre compañero/tutor</label>
          <input type="text" name="tutor" required className="w-full border rounded px-3 py-2 dark:bg-neutral-700" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Email</label>
            <input
              type="email"
              name="reply_to"        // EmailJS lo usa como Reply-To
              autoComplete="email"
              required
              className="w-full border rounded px-3 py-2 dark:bg-neutral-700"
              placeholder="correo@dominio.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Teléfono</label>
            <input
              type="tel"
              name="telefono"
              autoComplete="tel"
              inputMode="tel"
              pattern="^[\s\d()+\-\.]{6,}$"
              required
              className="w-full border rounded px-3 py-2 dark:bg-neutral-700"
              placeholder="+56 9 1234 5678"
              title="Ingresa un teléfono válido"
            />
          </div>
        </div>

        {/* Mensaje */}
        <div>
          <label className="block text-sm font-semibold mb-1">Mensaje</label>
          <textarea name="mensaje" required className="w-full border rounded px-3 py-2 h-24 dark:bg-neutral-700" />
        </div>

        <button
          type="submit"
          disabled={enviando}
          className="bg-primary text-white px-6 py-2 rounded hover:bg-[#5c7c4d] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {enviando ? 'Enviando…' : 'Reservar Hora'}
        </button>
      </form>
    </section>
  );
}
