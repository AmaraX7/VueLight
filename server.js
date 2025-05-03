const express = require('express');
const app = express();
const PORT = 3000;
const axios = require('axios');

app.use(express.static('public'));

// Ruta de prueba para verificar que el servidor funciona
app.get('/test', (req, res) => {
    res.json({ status: 'ok', message: 'Servidor funcionando correctamente' });
});

app.get('/check-flight/:flightNumber', async (req, res) => {
    const flightNumber = req.params.flightNumber;
    // Es mejor usar variables de entorno para las API keys
    const apiKey = process.env.AVIATION_API_KEY || '864b8d0f057f81f606dbe761847d8aee';
    
    console.log(`Consultando vuelo: ${flightNumber}`);
    
    try {
        const response = await axios.get(`https://api.aviationstack.com/v1/flights`, {
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
        console.error('Error completo:', error);
        if (error.response) {
            // La API devolvió un error con status code
            console.error('Datos de error:', error.response.data);
            console.error('Status:', error.response.status);
            
            // Devolver información más detallada sobre el error
            return res.status(error.response.status).json({ 
                error: 'Error en la API', 
                details: error.response.data,
                status: error.response.status
            });
        }
        res.status(500).json({ error: 'Error al consultar la API', message: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
