const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

// Static files
app.use(express.static('public'));

// Endpoint de test
app.get('/test', (req, res) => {
  res.json({ status: 'ok' });
});

// Ruta API para consultar vuelos
app.get('/check-flight/:flightNumber', async (req, res) => {
  const flightNumber = req.params.flightNumber;
  const apiKey = 'TU_API_KEY'; // Sustituye por tu key real de aviationstack

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
      res.json({
        airline: flightInfo.airline.name,
        flight_number: flightInfo.flight.iata,
        departure_airport: flightInfo.departure.airport,
        arrival_airport: flightInfo.arrival.airport,
        status: flightInfo.flight_status,
        delay: flightInfo.departure.delay || 0,
        departure_gate: flightInfo.departure.gate || "Desconocida",
      });
    } else {
      res.status(404).json({ error: 'Vuelo no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al consultar la API' });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
