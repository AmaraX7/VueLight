async function saveInfo() {
  const flight = document.getElementById("flight").value;
  
  if (!flight) {
    alert("Por favor, introduce un número de vuelo");
    return;
  }
  
  try {
   const response = await fetch(`/check-flight/${flight}`);
    
    const data = await response.json();
    
    if (!response.ok || data.error) {
      console.error("Error de API:", data);
      alert(`Error: ${data.error || 'Desconocido'}\n${data.message || data.details ? 'Ver consola para más detalles' : ''}`);
      return;
    }
    
    const info = {
      flight: data.flight_number,
      gate: data.departure_gate || "Desconocida",
      status: data.status || "Desconocido",
      delay: data.delay || 0,
    };
    
    localStorage.setItem("flightInfo", JSON.stringify(info));
    displayInfo();
  } catch (error) {
    console.error("Error al consultar el vuelo:", error);
    alert("Error al obtener la información del vuelo. Verifica la consola para más detalles.");
  }
}

function displayInfo() {
  const storedData = localStorage.getItem("flightInfo");
  if (storedData) {
    const data = JSON.parse(storedData);
   document.getElementById("infoDisplay").innerText =
  `${data.flight} | Gate ${data.gate} | ${data.status}`;
document.getElementById("extraInfo").innerText =
  `Delay: ${data.delay} min`;

  }
}

// Función para probar la conexión con el servidor
async function testServerConnection() {
  try {
    const response = await fetch('/test');
    const data = await response.json();
    console.log('Prueba de conexión al servidor:', data);
    return data.status === 'ok';
  } catch (error) {
    console.error('Error al conectar con el servidor:', error);
    return false;
  }
}

// Ejecutar displayInfo cuando se carga la página
window.onload = async function() {
  displayInfo();
  
  // Comprobar conexión con el servidor
  const serverOk = await testServerConnection();
  if (!serverOk) {
    alert('No se pudo conectar con el servidor. Verifica que el servidor esté en ejecución.');
  }
};
