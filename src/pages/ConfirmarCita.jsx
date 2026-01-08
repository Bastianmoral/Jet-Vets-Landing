import { useSearchParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { decodeBookingData, isBookingExpired } from '../utils/bookingEncoder';
import { sendConfirmationToClient, buildGoogleCalendarUrl, initEmailJS } from '../utils/emailService';

export default function ConfirmarCita() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  useEffect(() => {
    initEmailJS();
    const dataParam = searchParams.get('data');
    if (dataParam) {
      const decoded = decodeBookingData(dataParam);
      if (decoded) {
        if (isBookingExpired(decoded)) {
          setError('Este enlace ha expirado. Por favor, pide al cliente que envie una nueva solicitud.');
          setStatus('expired');
        } else {
          setBookingData(decoded);
        }
      } else {
        setError('No se pudieron leer los datos de la cita.');
        setStatus('error');
      }
    } else {
      setError('No se encontraron datos de la cita en el enlace.');
      setStatus('error');
    }
  }, [searchParams]);

  const handleConfirm = async () => {
    setStatus('loading');
    try {
      await sendConfirmationToClient(bookingData);
      const calendarUrl = buildGoogleCalendarUrl(bookingData);
      window.open(calendarUrl, '_blank', 'noopener,noreferrer');
      setStatus('success');
    } catch (err) {
      console.error('Error al confirmar:', err);
      setError('Error al enviar la confirmacion. Por favor, intenta de nuevo.');
      setStatus('error');
    }
  };

  const handleCalendarOnly = () => {
    const calendarUrl = buildGoogleCalendarUrl(bookingData);
    window.open(calendarUrl, '_blank', 'noopener,noreferrer');
  };

  const handlePropose = () => {
    const dataParam = searchParams.get('data');
    navigate(`/jetvet/propuesta?data=${dataParam}`);
  };

  if (status === 'error' || status === 'expired') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">!</div>
          <h1 className="text-xl font-bold text-gray-800 mb-4">Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <a
            href="/jetvet"
            className="inline-block bg-primary text-white px-6 py-2 rounded-lg hover:bg-[#5c7c4d]"
          >
            Volver al inicio
          </a>
        </div>
      </div>
    );
  }

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-gray-500">Cargando...</div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-green-500 text-5xl mb-4">&#10003;</div>
          <h1 className="text-xl font-bold text-gray-800 mb-4">Cita Confirmada</h1>
          <p className="text-gray-600 mb-2">
            Se ha enviado un email de confirmacion a <strong>{bookingData.email}</strong>
          </p>
          <p className="text-gray-600 mb-6">
            Se abrio Google Calendar para agregar el evento.
          </p>
          <a
            href="/jetvet"
            className="inline-block bg-primary text-white px-6 py-2 rounded-lg hover:bg-[#5c7c4d]"
          >
            Volver al inicio
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Confirmar Cita</h1>

        <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-6">
          <h2 className="font-semibold text-green-800 mb-3">Resumen de la Solicitud</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li><strong>Cliente:</strong> {bookingData.tutor}</li>
            <li><strong>Paciente:</strong> {bookingData.nombre_paciente || '-'}</li>
            <li><strong>Especie/Raza:</strong> {bookingData.especie} - {bookingData.raza}</li>
            <li><strong>Edad:</strong> {bookingData.edad} años</li>
            <li><strong>Castrado:</strong> {bookingData.castrado}</li>
            <li><strong>Servicio:</strong> {bookingData.servicio}</li>
            <li><strong>Fecha solicitada:</strong> {bookingData.fecha}</li>
            <li><strong>Horario:</strong> {bookingData.horario}</li>
            <li><strong>Telefono:</strong> {bookingData.telefono || '-'}</li>
            <li><strong>Email:</strong> {bookingData.email || '-'}</li>
            {bookingData.mensaje && (
              <li><strong>Mensaje:</strong> {bookingData.mensaje}</li>
            )}
          </ul>
        </div>

        {status === 'loading' ? (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
            <p className="mt-2 text-gray-600">Enviando confirmacion...</p>
          </div>
        ) : (
          <div className="space-y-3">
            <button
              onClick={handleConfirm}
              disabled={!bookingData.email}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirmar y Notificar al Cliente
            </button>
            {!bookingData.email && (
              <p className="text-xs text-amber-600 text-center">
                El cliente no proporciono email. Solo puedes agregar al calendario.
              </p>
            )}
            <button
              onClick={handleCalendarOnly}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold"
            >
              Solo Agregar a Calendario
            </button>
            <button
              onClick={handlePropose}
              className="w-full bg-amber-500 text-white py-3 rounded-lg hover:bg-amber-600 font-semibold"
            >
              Proponer Otra Fecha
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
