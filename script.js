console.log("funca");

// Clase para manejar los servicios
class Servicios {
  constructor() {
    this.servicios = {}; // Cambié a un objeto para manejar múltiples categorías
    this.cargarServicios(); // Llama a cargar los servicios
  }

  async cargarServicios() {
    try {
      const resultado = await fetch("./JSON/servicios.JSON"); // Carga los datos del archivo JSON
      this.servicios = await resultado.json(); // Guarda los datos en el objeto `servicios`

      // Cargar las categorías en sus respectivos contenedores
      cargarServiciosCategoria(this.servicios.estetica, ".serviciosEsteticos");
      cargarServiciosCategoria(this.servicios.medicina, ".serviciosMedicos");
    } catch (error) {
      console.error("Error al cargar los servicios:", error); // Captura errores de carga
    }
  }
}

// Instancia de la clase Servicios
const servicios = new Servicios();

// Función para cargar los servicios de una categoría específica
function cargarServiciosCategoria(listaServicios, selector) {
  const contenedor = document.querySelector(selector);

  if (!contenedor) {
    console.error(`No se encontró el contenedor con el selector: ${selector}`);
    return;
  }

  contenedor.innerHTML = ""; // Limpia el contenedor antes de agregar contenido

  // Itera sobre la lista de servicios y genera el HTML
  for (const servicio of listaServicios) {
    contenedor.innerHTML += `
      <div class="servicioContainer">
        <div class="imgContainer">
          <img class="imgServicio" src="${servicio.img}" alt="${servicio.nombre}">
        </div>
        <h2>${servicio.nombre}</h2>
      </div>`;
  }
}

// Consultorios MAP
function initMap() {
  const location = { lat: -34.64087678885384, lng: -58.56284795125639 };

  // Crear el mapa
  const map = new google.maps.Map(document.getElementById("map"), {
    center: location,
    zoom: 16,
    disableDefaultUI: true,
    gestureHandling: "none",
    styles: [
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [
          {
            color: "#d5d5d5",
          },
        ],
      },
    ],
  });

  // Cargar la PlacesService para obtener detalles del lugar
  const service = new google.maps.places.PlacesService(map);

  // Aquí colocamos el Place ID que nos diste
  const placeId = "ChIJP0W_HXnHvJURGmfg0nBN2Lk";

  // Utilizamos PlacesService para obtener el lugar por Place ID
  service.getDetails(
    {
      placeId: placeId,
      fields: ["name", "formatted_address", "geometry"], // Puedes agregar más campos según lo que necesites
    },
    (place, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        // Crear un marcador en el mapa en la ubicación del lugar
        const marker = new google.maps.Marker({
          position: place.geometry.location,
          map: map,
          title: place.name,
        });

        // Crear un infoWindow para mostrar información del lugar
        const infoWindow = new google.maps.InfoWindow({
          content: `<div><strong>${place.name}</strong><br>${place.formatted_address}</div>`,
        });

        // Abrir el InfoWindow automáticamente sin necesidad de clic
        infoWindow.open(map, marker);

        // Centrar el mapa en la ubicación del marcador
        map.setCenter(place.geometry.location);
      } else {
        console.error("No se pudo obtener los detalles del lugar: " + status);
      }
    }
  );
}

// CARROUSEL FOTOS

class CarrouselFotos {
  constructor() {
    this.fotos = []; // Inicializa fotos como un arreglo vacío.
    this.cargarRegistros().then(() => {
      this.cargarFotos();
    });
  }

  async cargarRegistros() {
    try {
      const resultado = await fetch("./JSON/fotosConsultorios.JSON");
      this.fotos = await resultado.json();
    } catch (error) {
      console.error("Error cargando las fotos:", error); // Este mensaje podría eliminarse si no es crucial.
    }
  }

  cargarFotos() {
    const consultorioCarrousel = document.querySelector(".consultorioCarrousel");

    consultorioCarrousel.innerHTML = ""; // Limpia el contenedor.

    for (const foto of this.fotos) {
      consultorioCarrousel.innerHTML += `
      <div class="fotoCarrouselContainer">
        <img src="${foto.img}" alt="Foto del consultorio">
      </div>
      `;
    }
  }
}

// Crear instancia de CarrouselFotos.
const carrouselFotos = new CarrouselFotos();

// Verificar en consola el estado del objeto.
console.log(carrouselFotos);
