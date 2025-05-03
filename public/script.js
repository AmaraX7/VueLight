async function saveInfo() {
  const flight = document.getElementById("flight").value;
  
  if (!flight) {
    alert("Por favor, introduce un número de vuelo");
    return;
  }
  
  try {
    const response = await fetch(`/check-flight/${flight}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    if (data.error) {
      alert(data.error);
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
    document.getElementById("extraInfo").innerText = `Delay: ${data.delay} min`;
  }
}

// Ejecutar displayInfo cuando se carga la página
window.onload = displayInfo;
