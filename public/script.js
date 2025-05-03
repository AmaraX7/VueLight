  async function saveInfo() {
    const flight = document.getElementById("flight").value;

    try {
      const response = await fetch(`/check-flight/${flight}`);
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
      alert("Error al obtener la información del vuelo.");
    }
    
    displayInfo();
  }

  function displayInfo() {
    const data = JSON.parse(localStorage.getItem("flightInfo"));
    if (data) {
      document.getElementById("infoDisplay").innerText =
        `${data.flight} | Gate ${data.gate} | ${data.status}`;

      document.getElementById("extraInfo").innerText = `Delay: ${data.delay} min`;
    }

  }

  window.onload = displayInfo;
 