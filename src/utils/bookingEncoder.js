// Utilidades para codificar/decodificar datos de reserva en URLs
// Usa base64 para comprimir y ofuscar (NO es encriptación segura)

export const encodeBookingData = (data) => {
  try {
    const jsonString = JSON.stringify(data);
    const base64 = btoa(unescape(encodeURIComponent(jsonString)));
    return base64;
  } catch (error) {
    console.error('Error encoding booking data:', error);
    return null;
  }
};

export const decodeBookingData = (encodedString) => {
  try {
    const jsonString = decodeURIComponent(escape(atob(encodedString)));
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error decoding booking data:', error);
    return null;
  }
};

export const buildConfirmationUrl = (baseUrl, bookingData) => {
  const encoded = encodeBookingData(bookingData);
  return `${baseUrl}/confirmar?data=${encoded}`;
};

export const buildProposalUrl = (baseUrl, bookingData) => {
  const encoded = encodeBookingData(bookingData);
  return `${baseUrl}/propuesta?data=${encoded}`;
};

// Valida que los datos no hayan expirado (72 horas por defecto)
export const isBookingExpired = (bookingData, maxAgeMs = 72 * 60 * 60 * 1000) => {
  if (!bookingData?.createdAt) return false;
  return Date.now() - bookingData.createdAt > maxAgeMs;
};
