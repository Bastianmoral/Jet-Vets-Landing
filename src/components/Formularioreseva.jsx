// src/components/FormularioReserva.jsx
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { texts } from '../translations';

export default function FormularioReserva({ lang }) {
  const [searchParams] = useSearchParams();
  const asunto = searchParams.get('asunto') || '';
  const formRef = useRef(null);
  const [neuteredValue, setNeuteredValue] = useState('');
  const [selectedReasons, setSelectedReasons] = useState([]);
  const [otherReason, setOtherReason] = useState('');

  const neuteredOptions = texts[lang].form.neuteredOptions;
  const reasonOptions = texts[lang].form.reasonOptions;

  const normalizedReasonValue = useMemo(() => {
    if (!asunto) return { values: [], other: '' };

    const allReasonOptions = [
      ...texts.es.form.reasonOptions,
      ...texts.en.form.reasonOptions,
    ];

    const matched = allReasonOptions.find(
      (option) => option.label.toLowerCase() === asunto.toLowerCase()
    );

    if (matched) {
      return { values: [matched.value], other: '' };
    }

    return { values: ['other'], other: asunto };
  }, [asunto]);

  useEffect(() => {
    setSelectedReasons(normalizedReasonValue.values);
    setOtherReason(normalizedReasonValue.other);
  }, [normalizedReasonValue]);

  useEffect(() => {
    if (!selectedReasons.includes('other') && otherReason) {
      setOtherReason('');
    }
  }, [selectedReasons, otherReason]);

  const reasonLabelMap = useMemo(() => {
    const map = new Map();
    const dictionaries = [reasonOptions, texts.es.form.reasonOptions, texts.en.form.reasonOptions];

    dictionaries.forEach((list) => {
      list.forEach((option) => {
        if (!map.has(option.value)) {
          map.set(option.value, option.label);
        }
      });
    });

    return map;
  }, [reasonOptions]);

  const selectedReasonLabels = useMemo(
    () => selectedReasons.map((value) => reasonLabelMap.get(value) ?? value),
    [selectedReasons, reasonLabelMap]
  );

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
            <select
              name="castrado"
              value={neuteredValue}
              onChange={(event) => setNeuteredValue(event.target.value)}
              className="w-full border rounded px-3 py-2 dark:bg-neutral-700"
            >
              <option value="" disabled>
                --
              </option>
              {neuteredOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
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
          <select
            multiple
            name="motivo_consulta"
            value={selectedReasons}
            onChange={(event) =>
              setSelectedReasons(
                Array.from(event.target.selectedOptions, (option) => option.value)
              )
            }
            className="w-full border rounded px-3 py-2 h-32 dark:bg-neutral-700"
          >
            {reasonOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <input type="hidden" name="motivo_consulta_detalle" value={selectedReasonLabels.join(', ')} />
        </div>

        {selectedReasons.includes('other') && (
          <div>
            <label className="block text-sm font-semibold mb-1">{texts[lang].form.otherReasonLabel}</label>
            <textarea
              name="motivo_consulta_otro"
              value={otherReason}
              onChange={(event) => setOtherReason(event.target.value)}
              placeholder={texts[lang].form.otherReasonPlaceholder}
              className="w-full border rounded px-3 py-2 h-20 dark:bg-neutral-700"
            />
          </div>
        )}

        {/* Tutor */}
        <div>
          <label className="block text-sm font-semibold mb-1">{texts[lang].form.tutor}</label>
          <input
            type="text"
            name="tutor"
            className="w-full border rounded px-3 py-2 dark:bg-neutral-700"
          />
        </div>

        {/* Contacto */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">{texts[lang].form.phone}</label>
            <input
              type="tel"
              name="telefono"
              className="w-full border rounded px-3 py-2 dark:bg-neutral-700"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">{texts[lang].form.email}</label>
            <input
              type="email"
              name="correo"
              className="w-full border rounded px-3 py-2 dark:bg-neutral-700"
            />
          </div>
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
