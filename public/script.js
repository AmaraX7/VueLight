document.getElementById('flight-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const flightNumber = document.getElementById('flight-number').value.trim();
  const resultDiv = document.getElementById('result');

  try {
    const response = await fetch(`/api/check-flight/${flightNumber}`);
    const data = await response.json();

    if (response.ok) {
      resultDiv.innerHTML = `
        <h2>Vuelo ${data.flight_number}</h2>
        <p><strong>Aerolínea:</strong> ${data.airline}</p>
        <p><strong>Origen:</strong> ${data.departure_airport}</p>
        <p><strong>Destino:</strong> ${data.arrival_airport}</p>
        <p><strong>Estado:</strong> ${data.status}</p>
        <p><strong>Retraso:</strong> ${data.delay} minutos</p>
        <p><strong>Puerta:</strong> ${data.departure_gate}</p>
      `;
    } else {
      resultDiv.innerHTML = `<p style="color: red;">Error: ${data.error}</p>`;
    }
  } catch (error) {
    resultDiv.innerHTML = `<p style="color: red;">Error al consultar el vuelo</p>`;
    console.error(error);
  }
});
