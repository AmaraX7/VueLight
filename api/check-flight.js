const axios = require('axios');

module.exports = async (req, res) => {
  const {
    query: { flightNumber },
    method
  } = req;

  if (method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const apiKey = 'TU_API_KEY'; // Sustituye con tu API real

  try {
    const response = await axios.get('http://api.aviationstack.com/v1/flights', {
      params: {
        access_key: apiKey,
        flight_iata: flightNumber
      }
    });

    const data = response.data;
    if (data.data && data.data.length > 0) {
      const flightInfo = data.data[0];
      return res.json({
        airline: flightInfo.airline.name,
        flight_number: flightInfo.flight.iata,
        departure_airport: flightInfo.departure.airport,
        arrival_airport: flightInfo.arrival.airport,
        status: flightInfo.flight_status,
        delay: flightInfo.departure.delay || 0,
        departure_gate: flightInfo.departure.gate || "Desconocida",
      });
    } else {
      return res.status(404).json({ error: 'Vuelo no encontrado' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al consultar la API' });
  }
};
