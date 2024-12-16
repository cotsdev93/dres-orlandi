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
    disableDefaultUI: true, // Oculta los controles estándar
    gestureHandling: "greedy", // Permite zoom y movimiento
    styles: [
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [
          {
            color: "#d5d5d5", // Color de los caminos
          },
        ],
      },
    ],
  });

  // Place ID del lugar
  const placeId = "ChIJP0W_HXnHvJURGmfg0nBN2Lk";

  // Usar PlacesService para obtener detalles del lugar
  const service = new google.maps.places.PlacesService(map);

  service.getDetails(
    {
      placeId: placeId,
      fields: ["name", "formatted_address", "geometry"],
    },
    (place, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        // Crear un marcador
        const marker = new google.maps.Marker({
          position: place.geometry.location,
          map: map,
          title: place.name,
        });

        // Configurar clic en el marcador para abrir Google Maps con el nombre del lugar
        marker.addListener("click", () => {
          const googleMapsURL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            place.name
          )},+${encodeURIComponent(place.formatted_address)}`;
          window.open(googleMapsURL, "_blank");
        });

        // Opcional: Añadir una ventana informativa al marcador
        const infoWindow = new google.maps.InfoWindow({
          content: `<div><strong>${place.name}</strong><br>${place.formatted_address}</div>`,
        });

        // Mostrar infoWindow automáticamente
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
    const consultorioCarrousel = document.querySelector(
      ".consultorioCarrousel"
    );

    consultorioCarrousel.innerHTML = ""; // Limpia el contenedor.

    for (const foto of this.fotos) {
      consultorioCarrousel.innerHTML += `
      
        <img src="${foto.img}" alt="">
      
      `;
    }
  }
}

// CARROUSEL CONSULTORIO
const chevronLeft = document.querySelector(".fa-chevron-left");
const chevronRight = document.querySelector(".fa-chevron-right");
const carrousel = document.querySelector(".consultorioCarrousel");
const dots = document.querySelectorAll(".dot");

// Contador para manejar el desplazamiento
let currentIndex = 0;

// Captura el ancho del contenedor del carrusel
const carrouselContainer = document.querySelector(".consultorioCarrouselContainer");
const containerWidth = carrouselContainer.offsetWidth;

// Evento para mover a la izquierda
chevronLeft.addEventListener("click", function () {
  if (currentIndex > 0) {
    currentIndex--;
    updateCarrouselPosition();
  }
});

// Evento para mover a la derecha
chevronRight.addEventListener("click", function () {
  // Asegura que no se desplace más allá del contenido
  if (currentIndex < carrousel.children.length - 1) {
    currentIndex++;
    updateCarrouselPosition();
  }
});

// Función para actualizar la posición del carrusel
function updateCarrouselPosition() {
  const newTranslateX = -currentIndex * containerWidth;
  carrousel.style.transform = `translateX(${newTranslateX}px)`;
  updateDots();
}

// Función para actualizar el estado de los dots
function updateDots() {
  dots.forEach((dot, index) => {
    if (index === currentIndex) {
      dot.classList.add("active");
    } else {
      dot.classList.remove("active");
    }
  });
}

// Inicialización para que los dots reflejen la imagen actual
updateDots();

const carrouselFotos = new CarrouselFotos();

//////////////////////////////////////////// Preguntas Frecuentes

const preguntas = document.querySelectorAll(".preguntaContainer"); 
  
for (const pregunta of preguntas) {
  pregunta.addEventListener("click", () => {
    // Cierra cualquier pregunta que esté actualmente expandida
    for (const otraPregunta of preguntas) {
      if (otraPregunta !== pregunta) { // Evita cerrar la que se acaba de hacer clic
        otraPregunta.classList.remove("expandida"); // Remueve la clase expandida
        const otraFlecha = otraPregunta.querySelector(".flechaPregunta");
        if (otraFlecha) {
          otraFlecha.classList.remove("rotada"); // Asegura que la flecha se deshaga del giro
        }
      }
    }

    // Alterna la expansión de la pregunta actual
    pregunta.classList.toggle("expandida"); 
    const flecha = pregunta.querySelector(".flechaPregunta"); 
    if (flecha) {
      flecha.classList.toggle("rotada");
    }
  });
}

