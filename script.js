console.log("funca");
// SERVICIOS

class Servicios {
    constructor() {
      this.servicios = [];
      this.cargarServicios(); // Llama a cargar los servicios
    }
  
    async cargarServicios() {
      const resultado = await fetch("./JSON/servicios.JSON"); // Carga los datos
      this.servicios = await resultado.json(); // Guarda los datos en el array
      cargarServicios(this.servicios); // Llama a la función cargarServicios cuando los datos estén listos
    }
  }
  
  const servicios = new Servicios(); // Crea una instancia de la clase
  
  function cargarServicios(listaServicios) {
    const divServicios = document.querySelector(".servicios");
  
    divServicios.innerHTML = ""; // Limpia el contenedor
  
    // Itera sobre la lista de servicios
    for (const servicio of listaServicios) {
      divServicios.innerHTML += `
          <div class="servicioContainer">
            <div class="imgContainer">
                <img class="imgServicio" src="${servicio.img}">
            </div>
            <h2>${servicio.nombre}</h2>
          </div>
          `;
    }
  }
  
  console.log("Esto es una instancia de la clase Servicios:", servicios);
  
