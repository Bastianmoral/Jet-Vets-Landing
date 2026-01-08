// src/components/FormularioReserva.jsx
import { useMemo, useRef, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { texts } from '../translations';
import { buildConfirmationUrl, buildProposalUrl } from '../utils/bookingEncoder';
import { sendAppointmentRequest, initEmailJS } from '../utils/emailService';

// Utilidades de sanitización
const sanitizeInput = (value, maxLength = 200) => {
  if (!value) return '';
  // Elimina caracteres peligrosos y limita longitud
  return value
    .toString()
    .trim()
    .slice(0, maxLength)
    .replace(/[<>]/g, '') // Elimina < y > para prevenir XSS básico
    .replace(/[\x00-\x1F\x7F]/g, ''); // Elimina caracteres de control
};

const sanitizeText = (value = '') => encodeURIComponent(value.toString().trim());

// Formato local sin zona horaria para Google Calendar (YYYYMMDDTHHmmss)
// Google interpreta el timestamp sin zona como hora local del navegador.
const formatDateToGoogleCalendar = (date) => {
  const pad = (value) => String(value).padStart(2, '0');
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate())
  ].join('') + 'T' + [
    pad(date.getHours()),
    pad(date.getMinutes()),
    pad(date.getSeconds())
  ].join('');
};

const buildGoogleCalendarUrl = ({ title, start, end, details, location, guests }) => {
  const baseUrl = 'https://calendar.google.com/calendar/render';
  const params = [
    'action=TEMPLATE',
    `text=${sanitizeText(title)}`,
    `dates=${sanitizeText(`${start}/${end}`)}`,
    `details=${sanitizeText(details)}`
  ];

  if (location) {
    params.push(`location=${sanitizeText(location)}`);
  }

  const guestList = Array.isArray(guests) ? guests.filter(Boolean).join(',') : guests;
  if (guestList) {
    params.push(`add=${sanitizeText(guestList)}`);
  }

  return `${baseUrl}?${params.join('&')}`;
};

const parseTimeRange = (value) => {
  if (!value) return null;
  const [startRaw, endRaw] = value.split('-').map((part) => part.trim());
  if (!startRaw || !endRaw) return null;
  return { startRaw, endRaw };
};

const buildDateFromParts = (dateValue, timeValue) => {
  if (!dateValue || !timeValue) return null;
  const [year, month, day] = dateValue.split('-').map(Number);
  const [hour, minute] = timeValue.split(':').map(Number);
  if (!year || !month || !day || Number.isNaN(hour) || Number.isNaN(minute)) return null;
  return new Date(year, month - 1, day, hour, minute, 0);
};

// Validaciones mejoradas
const validators = {
  email: (value) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(value);
  },
  phone: (value) => {
    // Formato internacional: +XX XXX XXX XXX (mínimo 9 dígitos)
    const cleaned = value.replace(/[\s\-()]/g, '');
    const regex = /^\+?[1-9]\d{8,14}$/;
    return regex.test(cleaned);
  },
  text: (value, minLength = 2, maxLength = 200) => {
    const trimmed = value.trim();
    return trimmed.length >= minLength && trimmed.length <= maxLength;
  },
  age: (value) => {
    // Solo números positivos (0-50 años aproximadamente)
    const regex = /^[0-9]{1,2}$/;
    return regex.test(value) && parseInt(value) >= 0 && parseInt(value) <= 50;
  }
};

export default function FormularioReserva({ lang = 'es' }) {
  const t = texts[lang].form;
  const [searchParams] = useSearchParams();
  const asuntoParam = (searchParams.get('asunto') || '').trim();

  const formRef = useRef(null);
  const [enviando, setEnviando] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const inviteeEmail = import.meta.env.VITE_JETVETS_CALENDAR_INVITEE_EMAIL;

  // Honeypot mejorado con timestamp
  const [honeypotTime] = useState(Date.now());

  // Inicializar EmailJS
  useEffect(() => {
    initEmailJS();
  }, []);

  const neuteredOptions = texts[lang].form.neuteredOptions;
  const reasonOptions   = texts[lang].form.reasonOptions;

  const { valueByLabelLower, labelByValue } = useMemo(() => {
    const dicts = [
      texts.es.form.reasonOptions,
      texts.en.form.reasonOptions
    ];

    const _valueByLabelLower = new Map();
    const _labelByValue = new Map();

    dicts.forEach(list => {
      list.forEach(({ value, label }) => {
        const key = (label || '').toLowerCase();
        if (key && !_valueByLabelLower.has(key)) {
          _valueByLabelLower.set(key, value);
        }
        if (!_labelByValue.has(value)) {
          _labelByValue.set(value, label);
        }
      });
    });

    return { valueByLabelLower: _valueByLabelLower, labelByValue: _labelByValue };
  }, []);

  const initialReasonValue = useMemo(() => {
    if (!asuntoParam) return '';
    const found = valueByLabelLower.get(asuntoParam.toLowerCase());
    return found || '';
  }, [asuntoParam, valueByLabelLower]);

  const [reasonValue, setReasonValue] = useState(initialReasonValue);
  const [otherReason, setOtherReason] = useState(
    initialReasonValue === 'other' ? asuntoParam : ''
  );

  const reasonLabel = reasonValue ? (labelByValue.get(reasonValue) || reasonValue) : '';

  // Estado para especie (Perro, Gato, Otro)
  const [especieValue, setEspecieValue] = useState('');
  const [otraEspecie, setOtraEspecie] = useState('');

  const speciesOptions = texts[lang].form.speciesOptions || [
    { value: 'perro', label: lang === 'es' ? 'Perro' : 'Dog' },
    { value: 'gato', label: lang === 'es' ? 'Gato' : 'Cat' },
    { value: 'otro', label: lang === 'es' ? 'Otro' : 'Other' }
  ];

  // Validación en tiempo real
  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'reply_to':
        if (value && !validators.email(value)) {
          newErrors[name] = t.emailError || 'Email inválido';
        } else {
          delete newErrors[name];
        }
        break;
      case 'telefono':
        if (value && !validators.phone(value)) {
          newErrors[name] = t.phoneError || 'Teléfono inválido (ej: +34612345678)';
        } else {
          delete newErrors[name];
        }
        break;
      case 'edad':
        if (!validators.age(value)) {
          newErrors[name] = t.ageError || 'Edad inválida (0-50)';
        } else {
          delete newErrors[name];
        }
        break;
      case 'especie':
      case 'raza':
      case 'tutor':
        if (!validators.text(value, 2, 100)) {
          newErrors[name] = t.textError || 'Debe tener entre 2 y 100 caracteres';
        } else {
          delete newErrors[name];
        }
        break;
      case 'mensaje':
        if (!validators.text(value, 10, 1000)) {
          newErrors[name] = t.messageError || 'Debe tener entre 10 y 1000 caracteres';
        } else {
          delete newErrors[name];
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');

    // Verificar honeypot
    const formData = new FormData(formRef.current);
    const honeypotValue = formData.get('company');
    const honeypotTimestamp = formData.get('timestamp');
    
    // Si el honeypot está lleno o el formulario se envió muy rápido (< 3 segundos), es spam
    if (honeypotValue || (Date.now() - parseInt(honeypotTimestamp)) < 3000) {
      console.warn('Spam detectado');
      return;
    }

    const allErrors = {};
    const preferredDate = sanitizeInput(formData.get('preferred_date'), 20);
    const preferredBlock = sanitizeInput(formData.get('preferred_block'), 50);
    const phoneValue = sanitizeInput(formData.get('telefono'), 20);
    const emailValue = sanitizeInput(formData.get('reply_to'), 100);
    const serviceValue = sanitizeInput(formData.get('asunto'), 200);

    if (!serviceValue) {
      allErrors.asunto = t.serviceRequired || 'Selecciona un servicio';
    }

    if (!preferredDate) {
      allErrors.preferred_date = t.dateRequired || 'Selecciona una fecha preferida';
    } else {
      // Validar que la fecha no sea en el pasado
      const selectedDate = new Date(preferredDate + 'T00:00:00');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        allErrors.preferred_date = t.datePastError || 'La fecha no puede ser en el pasado';
      }
    }

    if (!preferredBlock) {
      allErrors.preferred_block = t.timeBlockRequired || 'Selecciona un bloque horario';
    }

    if (!phoneValue && !emailValue) {
      const message = t.contactRequired || 'Indica teléfono o correo';
      allErrors.telefono = message;
      allErrors.reply_to = message;
    }

    if (phoneValue && !validators.phone(phoneValue)) {
      allErrors.telefono = t.phoneError || 'Teléfono inválido (ej: +34612345678)';
    }

    if (emailValue && !validators.email(emailValue)) {
      allErrors.reply_to = t.emailError || 'Email inválido';
    }

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      return;
    }

    try {
      setEnviando(true);

      // Preparar datos de la reserva
      const bookingData = {
        nombre_paciente: sanitizeInput(formData.get('nombre_paciente'), 100),
        especie: sanitizeInput(formData.get('especie'), 100),
        edad: sanitizeInput(formData.get('edad'), 10),
        castrado: sanitizeInput(formData.get('castrado'), 50),
        raza: sanitizeInput(formData.get('raza'), 100),
        servicio: sanitizeInput(formData.get('motivo_consulta_label'), 200) || sanitizeInput(formData.get('asunto'), 200),
        tutor: sanitizeInput(formData.get('tutor'), 100),
        telefono: sanitizeInput(formData.get('telefono'), 20),
        email: sanitizeInput(formData.get('reply_to'), 100),
        mensaje: sanitizeInput(formData.get('mensaje'), 1000),
        fecha: preferredDate,
        horario: preferredBlock,
        createdAt: Date.now(),
      };

      // Generar URLs de accion para el veterinario
      const baseUrl = import.meta.env.VITE_APP_BASE_URL || `${window.location.origin}/jetvet`;
      bookingData.confirmUrl = buildConfirmationUrl(baseUrl, bookingData);
      bookingData.propuestaUrl = buildProposalUrl(baseUrl, bookingData);

      // Enviar email al veterinario via EmailJS
      await sendAppointmentRequest(bookingData);

      setErrors({});
      formRef.current?.reset();
      setReasonValue('');
      setOtherReason('');
      setEspecieValue('');
      setOtraEspecie('');
      setSuccessMessage(
        t.requestSent ||
          'Tu solicitud ha sido enviada. Te contactaremos pronto para confirmar la disponibilidad.'
      );
    } catch (err) {
      console.error('Error al enviar solicitud:', err);
      setErrors({
        submit: t.sendError || 'Error al enviar la solicitud. Por favor, intenta de nuevo.'
      });
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
        {/* Honeypots mejorados */}
        <input
          type="text"
          name="company"
          autoComplete="off"
          tabIndex="-1"
          className="absolute -left-[9999px]"
          aria-hidden="true"
        />
        <input
          type="hidden"
          name="timestamp"
          value={honeypotTime}
        />
        <input type="hidden" name="calendar_url" />

        {/* Nombre del paciente (mascota) */}
        <div>
          <label className="block text-sm font-semibold mb-1">{t.petName || 'Nombre del paciente'}</label>
          <input
            type="text"
            name="nombre_paciente"
            required
            maxLength={100}
            pattern="^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]{2,100}$"
            title={t.petNameTitle || 'Nombre de tu mascota'}
            className="w-full border rounded px-3 py-2 dark:bg-neutral-700"
          />
        </div>

        {/* Fila 1: Especie / Edad */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">{t.species}</label>
            <select
              name="especie_select"
              required
              value={especieValue}
              onChange={(e) => {
                setEspecieValue(e.target.value);
                if (e.target.value !== 'otro') setOtraEspecie('');
              }}
              className="w-full border rounded px-3 py-2 dark:bg-neutral-700"
            >
              <option value="" disabled>--</option>
              {speciesOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <input
              type="hidden"
              name="especie"
              value={especieValue === 'otro' ? otraEspecie : (speciesOptions.find(o => o.value === especieValue)?.label || '')}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">{t.age}</label>
            <input
              type="text"
              name="edad"
              required
              maxLength={2}
              pattern="^[0-9]{1,2}$"
              title={t.ageTitle || 'Edad en años (0-50)'}
              onBlur={(e) => validateField('edad', e.target.value)}
              className="w-full border rounded px-3 py-2 dark:bg-neutral-700"
            />
            {errors.edad && <p className="text-red-500 text-xs mt-1">{errors.edad}</p>}
          </div>
        </div>

        {/* Si especie es "otro", mostrar input adicional */}
        {especieValue === 'otro' && (
          <div>
            <label className="block text-sm font-semibold mb-1">
              {t.otherSpeciesLabel || 'Especifica la especie'}
            </label>
            <input
              type="text"
              value={otraEspecie}
              onChange={(e) => setOtraEspecie(e.target.value)}
              required
              maxLength={100}
              placeholder={t.otherSpeciesPlaceholder || 'Ej: Conejo, Hamster, Ave...'}
              className="w-full border rounded px-3 py-2 dark:bg-neutral-700"
            />
          </div>
        )}

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
              maxLength={100}
              pattern="^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]{2,100}$"
              title={t.breedTitle || 'Solo letras (2-100 caracteres)'}
              onBlur={(e) => validateField('raza', e.target.value)}
              className="w-full border rounded px-3 py-2 dark:bg-neutral-700"
            />
            {errors.raza && <p className="text-red-500 text-xs mt-1">{errors.raza}</p>}
          </div>
        </div>

        {/* Motivo de consulta */}
        <div>
          <label className="block text-sm font-semibold mb-1">{t.reason}</label>
          <select
            name="asunto"
            className="w-full border rounded px-3 py-2 dark:bg-neutral-700"
            value={reasonValue}
            onChange={(e) => {
              const v = e.target.value;
              setReasonValue(v);
              setErrors((prev) => {
                const next = { ...prev };
                delete next.asunto;
                return next;
              });
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
          {errors.asunto && <p className="text-red-500 text-xs mt-1">{errors.asunto}</p>}

          <input type="hidden" name="motivo_consulta_label" value={reasonLabel} />

          {reasonValue === 'other' && (
            <div className="mt-2">
              <label className="block text-sm font-semibold mb-1">
                {t.otherReasonLabel || 'Describe el motivo'}
              </label>
              <textarea
                name="motivo_consulta_otro"
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
                maxLength={500}
                placeholder={t.otherReasonPlaceholder || 'Escribe aquí…'}
                className="w-full border rounded px-3 py-2 h-20 dark:bg-neutral-700"
              />
            </div>
          )}
        </div>

        {/* Fecha y bloque horario */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">
              {t.preferredDate || 'Fecha preferida'}
            </label>
            <input
              type="date"
              name="preferred_date"
              min={new Date().toISOString().split('T')[0]}
              onChange={() =>
                setErrors((prev) => {
                  const next = { ...prev };
                  delete next.preferred_date;
                  return next;
                })
              }
              className="w-full border rounded px-3 py-2 dark:bg-neutral-700"
            />
            {errors.preferred_date && (
              <p className="text-red-500 text-xs mt-1">{errors.preferred_date}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">
              {t.preferredTimeBlock || 'Bloque horario preferido'}
            </label>
            <select
              name="preferred_block"
              defaultValue=""
              onChange={() =>
                setErrors((prev) => {
                  const next = { ...prev };
                  delete next.preferred_block;
                  return next;
                })
              }
              className="w-full border rounded px-3 py-2 dark:bg-neutral-700"
            >
              <option value="" disabled>
                {t.timeBlockPlaceholder || 'Selecciona un bloque…'}
              </option>
              {(t.timeBlockOptions || [
                '09:00 - 11:00',
                '11:00 - 13:00',
                '15:00 - 17:00',
                '17:00 - 19:00'
              ]).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.preferred_block && (
              <p className="text-red-500 text-xs mt-1">{errors.preferred_block}</p>
            )}
          </div>
        </div>

        {/* Datos de contacto */}
        <div>
          <label className="block text-sm font-semibold mb-1">{t.tutor}</label>
            <input
              type="text"
              name="tutor"
              required
              maxLength={100}
              pattern="^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]{2,100}$"
              title={t.tutorTitle || 'Nombre completo (2-100 caracteres)'}
              onBlur={(e) => validateField('tutor', e.target.value)}
              className="w-full border rounded px-3 py-2 dark:bg-neutral-700"
            />
          {errors.tutor && <p className="text-red-500 text-xs mt-1">{errors.tutor}</p>}
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
              maxLength={20}
              pattern="^\+?[1-9]\d{8,14}$"
              placeholder="+34612345678"
              title={t.phoneTitle || 'Formato: +34612345678 (9-15 dígitos)'}
              onBlur={(e) => validateField('telefono', e.target.value)}
              onChange={() =>
                setErrors((prev) => {
                  const next = { ...prev };
                  delete next.telefono;
                  return next;
                })
              }
              className="w-full border rounded px-3 py-2 dark:bg-neutral-700"
            />
            {errors.telefono && <p className="text-red-500 text-xs mt-1">{errors.telefono}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">{t.email}</label>
            <input
              type="email"
              name="reply_to"
              autoComplete="email"
              maxLength={100}
              placeholder="correo@ejemplo.com"
              title={t.emailTitle || 'Email válido'}
              onBlur={(e) => validateField('reply_to', e.target.value)}
              onChange={() =>
                setErrors((prev) => {
                  const next = { ...prev };
                  delete next.reply_to;
                  return next;
                })
              }
              className="w-full border rounded px-3 py-2 dark:bg-neutral-700"
            />
            {errors.reply_to && <p className="text-red-500 text-xs mt-1">{errors.reply_to}</p>}
          </div>
        </div>

        {/* Mensaje */}
        <div>
          <label className="block text-sm font-semibold mb-1">{t.message}</label>
          <textarea
            name="mensaje"
            required
            maxLength={1000}
            minLength={10}
            onBlur={(e) => validateField('mensaje', e.target.value)}
            className="w-full border rounded px-3 py-2 h-24 dark:bg-neutral-700"
          />
          {errors.mensaje && <p className="text-red-500 text-xs mt-1">{errors.mensaje}</p>}
        </div>

        {errors.submit && (
          <p className="text-red-500 text-sm text-center">{errors.submit}</p>
        )}

        <button
          type="submit"
          disabled={enviando || Object.keys(errors).filter(k => k !== 'submit').length > 0}
          className="bg-primary text-white px-6 py-2 rounded hover:bg-[#5c7c4d] disabled:opacity-60 disabled:cursor-not-allowed w-full"
        >
          {enviando ? (t.sending || 'Enviando…') : t.submit}
        </button>
        <p className="text-xs text-gray-500 dark:text-gray-300">
          {t.disclaimer ||
            '*La solicitud de cita no constituye confirmación automática. Confirmaremos disponibilidad a la brevedad.*'}
        </p>
        {successMessage && (
          <p className="text-sm text-green-600 dark:text-green-400">{successMessage}</p>
        )}
      </form>
    </section>
  );
}