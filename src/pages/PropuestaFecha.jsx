import { useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { decodeBookingData, isBookingExpired } from '../utils/bookingEncoder';
import { sendProposalToClient, initEmailJS } from '../utils/emailService';

const TIME_BLOCKS = [
  '09:00 - 11:00',
  '11:00 - 13:00',
  '15:00 - 17:00',
  '17:00 - 19:00'
];

export default function PropuestaFecha() {
  const [searchParams] = useSearchParams();
  const [bookingData, setBookingData] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  const [proposedDate, setProposedDate] = useState('');
  const [proposedTime, setProposedTime] = useState('');
  const [vetMessage, setVetMessage] = useState('');

  useEffect(() => {
    initEmailJS();
    const dataParam = searchParams.get('data');
    if (dataParam) {
      const decoded = decodeBookingData(dataParam);
      if (decoded) {
        if (isBookingExpired(decoded)) {
          setError('Este enlace ha expirado.');
          setStatus('expired');
        } else {
          setBookingData(decoded);
        }
      } else {
        setError('No se pudieron leer los datos.');
        setStatus('error');
      }
    } else {
      setError('No se encontraron datos en el enlace.');
      setStatus('error');
    }
  }, [searchParams]);

  const handleSendProposal = async () => {
    if (!proposedDate || !proposedTime) {
      setError('Por favor selecciona fecha y horario.');
      return;
    }

    setStatus('loading');
    setError(null);

    try {
      await sendProposalToClient(bookingData, proposedDate, proposedTime, vetMessage);
      setStatus('success');
    } catch (err) {
      console.error('Error al enviar propuesta:', err);
      setError('Error al enviar la propuesta. Por favor, intenta de nuevo.');
      setStatus('error');
    }
  };

  if (status === 'expired') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-amber-500 text-5xl mb-4">!</div>
          <h1 className="text-xl font-bold text-gray-800 mb-4">Enlace Expirado</h1>
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

  if (!bookingData && status !== 'error') {
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
          <h1 className="text-xl font-bold text-gray-800 mb-4">Propuesta Enviada</h1>
          <p className="text-gray-600 mb-2">
            Se ha enviado la propuesta de nueva fecha a <strong>{bookingData.email}</strong>
          </p>
          <p className="text-gray-600 mb-6">
            Nueva fecha propuesta: <strong>{proposedDate}</strong> a las <strong>{proposedTime}</strong>
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

  if (!bookingData) {
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

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Proponer Nueva Fecha</h1>

        <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg mb-6">
          <h2 className="font-semibold text-amber-800 mb-3">Solicitud Original</h2>
          <ul className="space-y-1 text-sm text-gray-700">
            <li><strong>Cliente:</strong> {bookingData.tutor}</li>
            <li><strong>Paciente:</strong> {bookingData.nombre_paciente || '-'}</li>
            <li><strong>Especie/Raza:</strong> {bookingData.especie} - {bookingData.raza}</li>
            <li><strong>Servicio:</strong> {bookingData.servicio}</li>
            <li><strong>Fecha solicitada:</strong> {bookingData.fecha}</li>
            <li><strong>Horario solicitado:</strong> {bookingData.horario}</li>
          </ul>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Nueva fecha propuesta
            </label>
            <input
              type="date"
              value={proposedDate}
              onChange={(e) => setProposedDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Nuevo horario propuesto
            </label>
            <select
              value={proposedTime}
              onChange={(e) => setProposedTime(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Selecciona un horario...</option>
              {TIME_BLOCKS.map((block) => (
                <option key={block} value={block}>{block}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Mensaje para el cliente (opcional)
            </label>
            <textarea
              value={vetMessage}
              onChange={(e) => setVetMessage(e.target.value)}
              placeholder="Ej: Lamentablemente no tenemos disponibilidad para la fecha solicitada..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {error && status === 'error' && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        {status === 'loading' ? (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
            <p className="mt-2 text-gray-600">Enviando propuesta...</p>
          </div>
        ) : (
          <div className="space-y-3">
            <button
              onClick={handleSendProposal}
              disabled={!bookingData.email}
              className="w-full bg-amber-500 text-white py-3 rounded-lg hover:bg-amber-600 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Enviar Propuesta al Cliente
            </button>
            {!bookingData.email && (
              <p className="text-xs text-red-600 text-center">
                El cliente no proporciono email. No se puede enviar propuesta.
              </p>
            )}
            <a
              href="/jetvet"
              className="block w-full text-center bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 font-semibold"
            >
              Cancelar
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
