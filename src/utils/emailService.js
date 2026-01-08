import emailjs from '@emailjs/browser';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const TEMPLATE_SOLICITUD = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const TEMPLATE_CONFIRMACION = import.meta.env.VITE_EMAILJS_TEMPLATE_CONFIRMACION;
const TEMPLATE_PROPUESTA = import.meta.env.VITE_EMAILJS_TEMPLATE_PROPUESTA;
const VET_EMAIL = import.meta.env.VITE_VET_EMAIL;

let initialized = false;

export const initEmailJS = () => {
  if (!initialized && PUBLIC_KEY) {
    emailjs.init(PUBLIC_KEY);
    initialized = true;
  }
};

// Enviar solicitud de cita al veterinario
// Variables del template: nombre_paciente, tutor, reply_to, telefono, especie, raza, edad, castrado, asunto, mensaje, confirm_url, reject_url, fecha_preferida, horario_preferido
export const sendAppointmentRequest = async (bookingData) => {
  initEmailJS();

  const templateParams = {
    // Variables existentes del template original
    to_email: VET_EMAIL,
    nombre_paciente: bookingData.nombre_paciente,
    tutor: bookingData.tutor,
    reply_to: bookingData.email,
    telefono: bookingData.telefono,
    especie: bookingData.especie,
    raza: bookingData.raza,
    edad: bookingData.edad,
    castrado: bookingData.castrado,
    asunto: bookingData.servicio,
    mensaje: bookingData.mensaje,
    // Variables nuevas para los botones de accion
    confirm_url: bookingData.confirmUrl,
    reject_url: bookingData.propuestaUrl,
    fecha_preferida: bookingData.fecha,
    horario_preferido: bookingData.horario,
  };

  return emailjs.send(SERVICE_ID, TEMPLATE_SOLICITUD, templateParams);
};

// Enviar confirmación al cliente (ejecutado desde navegador del vet)
export const sendConfirmationToClient = async (bookingData) => {
  initEmailJS();

  const templateParams = {
    to_email: bookingData.email,
    to_name: bookingData.tutor,
    pet_species: bookingData.especie,
    pet_breed: bookingData.raza,
    service: bookingData.servicio,
    confirmed_date: bookingData.fecha,
    confirmed_time: bookingData.horario,
    vet_name: 'Jet Vets',
  };

  return emailjs.send(SERVICE_ID, TEMPLATE_CONFIRMACION, templateParams);
};

// Enviar propuesta de nueva fecha al cliente
export const sendProposalToClient = async (bookingData, proposedDate, proposedTime, vetMessage) => {
  initEmailJS();

  const templateParams = {
    to_email: bookingData.email,
    to_name: bookingData.tutor,
    pet_species: bookingData.especie,
    pet_breed: bookingData.raza,
    service: bookingData.servicio,
    original_date: bookingData.fecha,
    original_time: bookingData.horario,
    proposed_date: proposedDate,
    proposed_time: proposedTime,
    vet_message: vetMessage,
    vet_name: 'Jet Vets',
  };

  return emailjs.send(SERVICE_ID, TEMPLATE_PROPUESTA, templateParams);
};

// Construir URL de Google Calendar
export const buildGoogleCalendarUrl = (bookingData) => {
  const formatDate = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return null;
    const [year, month, day] = dateStr.split('-').map(Number);
    const timeParts = timeStr.split('-')[0]?.trim().split(':').map(Number) || [9, 0];
    const [hour, minute] = timeParts;
    const date = new Date(year, month - 1, day, hour, minute, 0);
    const pad = (v) => String(v).padStart(2, '0');
    return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T${pad(date.getHours())}${pad(date.getMinutes())}00`;
  };

  const startDate = formatDate(bookingData.fecha, bookingData.horario);
  const endTimeParts = bookingData.horario?.split('-')[1]?.trim().split(':').map(Number) || [10, 0];
  const [year, month, day] = (bookingData.fecha || '').split('-').map(Number);
  const endDateObj = new Date(year, month - 1, day, endTimeParts[0], endTimeParts[1], 0);
  const pad = (v) => String(v).padStart(2, '0');
  const endDate = `${endDateObj.getFullYear()}${pad(endDateObj.getMonth() + 1)}${pad(endDateObj.getDate())}T${pad(endDateObj.getHours())}${pad(endDateObj.getMinutes())}00`;

  const details = [
    `Cliente: ${bookingData.tutor}`,
    `Paciente: ${bookingData.nombre_paciente || '-'}`,
    `Especie: ${bookingData.especie} - ${bookingData.raza}`,
    `Edad: ${bookingData.edad}`,
    `Castrado: ${bookingData.castrado}`,
    `Servicio: ${bookingData.servicio}`,
    `Contacto: ${bookingData.telefono || ''} / ${bookingData.email || ''}`,
    `Mensaje: ${bookingData.mensaje || '-'}`,
  ].join('\n');

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `Jet Vets - ${bookingData.nombre_paciente || bookingData.especie} - ${bookingData.servicio}`,
    dates: `${startDate}/${endDate}`,
    details: details,
  });

  if (bookingData.email) {
    params.set('add', bookingData.email);
  }

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};
