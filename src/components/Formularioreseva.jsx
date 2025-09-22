// src/components/FormularioReserva.jsx
import { useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { texts } from '../translations';

export default function FormularioReserva({ lang = 'es' }) {
  const t = texts[lang].form;
  const [searchParams] = useSearchParams();
  const asuntoParam = (searchParams.get('asunto') || '').trim();

  const formRef = useRef(null);
  const [enviando, setEnviando] = useState(false);

  // EmailJS (Vite)
  const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  // Opciones i18n
  const neuteredOptions = texts[lang].form.neuteredOptions; // [{value:'yes',label:'Sí'}, ...]
  const reasonOptions   = texts[lang].form.reasonOptions;   // [{value:'general',label:'Medicina general'}, ... , {value:'other',label:'Otro motivo'}]

  // Mapa cross-idioma: value -> label y label -> value
  const { valueByLabelLower, labelByValue } = useMemo(() => {
    const dicts = [
      texts.es.form.reasonOptions,
      texts.en.form.reasonOptions
    ];

    const _valueByLabelLower = new Map();
    const _labelByValue = new Map();

    dicts.forEach(list => {
      list.forEach(({ value, label }) => {
        // Para búsqueda por label (proveniente de ?asunto= en cualquier idioma)
        const key = (label || '').toLowerCase();
        if (key && !_valueByLabelLower.has(key)) {
          _valueByLabelLower.set(key, value);
        }
        // Para mostrar el label correcto del idioma actual
        if (!_labelByValue.has(value)) {
          _labelByValue.set(value, label);
        }
      });
    });

    return { valueByLabelLower: _valueByLabelLower, labelByValue: _labelByValue };
  }, []);

  // Valor inicial del select según ?asunto= (acepta label ES/EN). Si no calza, queda vacío.
  const initialReasonValue = useMemo(() => {
    if (!asuntoParam) return '';
    const found = valueByLabelLower.get(asuntoParam.toLowerCase());
    return found || '';
  }, [asuntoParam, valueByLabelLower]);

  // Si el usuario elige "other", permitimos detalle
  const [reasonValue, setReasonValue] = useState(initialReasonValue);
  const [otherReason, setOtherReason] = useState(
    initialReasonValue === 'other' ? asuntoParam : ''
  );

  const reasonLabel = reasonValue ? (labelByValue.get(reasonValue) || reasonValue) : '';

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      alert('Error de configuración de EmailJS');
      return;
    }

    try {
      setEnviando(true);
      // Nota: tu template debería usar {{reply_to}} para responder al correo del tutor.
      await emailjs.sendForm(
        SERVICE_ID,
        TEMPLATE_ID,
        formRef.current,
        { publicKey: PUBLIC_KEY }
      );
      formRef.current.reset();
      setReasonValue('');
      setOtherReason('');
      alert(t.sentOK || 'Solicitud enviada');
    } catch (err) {
      console.error('EmailJS error', err);
      alert(t.sentError || 'No se pudo enviar. Intenta nuevamente.');
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
        <h1 className="text-4xl volkhov-bold text-center dark:text-white">{t.title}</h1>
      </div>

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="bg-white dark:bg-neutral-800 dark:text-white p-8 rounded-xl shadow-md w-full max-w-md space-y-4"
      >
        {/* Honeypot anti-spam */}
        <input
          type="text"
          name="company"
          autoComplete="off"
          tabIndex="-1"
          className="hidden"
        />

        {/* Fila 1: Especie / Edad */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">{t.species}</label>
            <input
              type="text"
              name="especie"
              required
              className="w-full border rounded px-3 py-2 dark:bg-neutral-700"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">{t.age}</label>
            <input
              type="text"
              name="edad"
              required
              className="w-full border rounded px-3 py-2 dark:bg-neutral-700"
            />
          </div>
        </div>

        {/* Fila 2: Castrado / Raza */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">{t.neutered}</label>
            <select
              name="castrado"
              defaultValue=""
              required
              className="w-full border rounded px-3 py-2 dark:bg-neutral-700"
            >
              <option value="" disabled>--</option>
              {neuteredOptions.map(opt => (
                <option key={opt.value} value={opt.label}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">{t.breed}</label>
            <input
              type="text"
              name="raza"
              required
              className="w-full border rounded px-3 py-2 dark:bg-neutral-700"
            />
          </div>
        </div>

        {/* Motivo de consulta: SELECT simple (como la versión sin traducción) */}
        <div>
          <label className="block text-sm font-semibold mb-1">{t.reason}</label>
          <select
            name="asunto" // <- EmailJS: {{asunto}}
            required
            className="w-full border rounded px-3 py-2 dark:bg-neutral-700"
            value={reasonValue}
            onChange={(e) => {
              const v = e.target.value;
              setReasonValue(v);
              if (v !== 'other') setOtherReason('');
            }}
          >
            <option value="" disabled>
              {t.reasonPlaceholder || 'Selecciona un servicio…'}
            </option>
            {reasonOptions.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Campo oculto con el label del motivo (útil para el template de EmailJS) */}
          <input type="hidden" name="motivo_consulta_label" value={reasonLabel} />

          {/* Si elige "Otro", permitimos detallar */}
          {reasonValue === 'other' && (
            <div className="mt-2">
              <label className="block text-sm font-semibold mb-1">
                {t.otherReasonLabel || 'Describe el motivo'}
              </label>
              <textarea
                name="motivo_consulta_otro"
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
                placeholder={t.otherReasonPlaceholder || 'Escribe aquí…'}
                className="w-full border rounded px-3 py-2 h-20 dark:bg-neutral-700"
              />
            </div>
          )}
        </div>

        {/* Tutor */}
        <div>
          <label className="block text-sm font-semibold mb-1">{t.tutor}</label>
          <input
            type="text"
            name="tutor"
            required
            className="w-full border rounded px-3 py-2 dark:bg-neutral-700"
          />
        </div>

        {/* Contacto */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">{t.phone}</label>
            <input
              type="tel"
              name="telefono"
              autoComplete="tel"
              inputMode="tel"
              pattern="^[\s\d()+\-\.]{6,}$"
              required
              className="w-full border rounded px-3 py-2 dark:bg-neutral-700"
              placeholder={t.phonePlaceholder || '+34 612 345 678'}
              title={t.phoneTitle || 'Ingresa un teléfono válido'}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">{t.email}</label>
            <input
              type="email"
              name="reply_to"   // <- usa {{reply_to}} en tu template
              autoComplete="email"
              required
              className="w-full border rounded px-3 py-2 dark:bg-neutral-700"
              placeholder={t.emailPlaceholder || 'correo@dominio.es'}
            />
          </div>
        </div>

        {/* Mensaje */}
        <div>
          <label className="block text-sm font-semibold mb-1">{t.message}</label>
          <textarea
            name="mensaje"
            required
            className="w-full border rounded px-3 py-2 h-24 dark:bg-neutral-700"
          />
        </div>

        <button
          type="submit"
          disabled={enviando}
          className="bg-primary text-white px-6 py-2 rounded hover:bg-[#5c7c4d] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {enviando ? (t.sending || 'Enviando…') : t.submit}
        </button>
      </form>
    </section>
  );
}
