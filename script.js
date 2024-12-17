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

///////////////////////////////////////////// CARROUSEL FOTOS

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

////////////////////////////////////////// CARROUSEL CONSULTORIO

const chevronLeft = document.querySelector(".fa-chevron-left");
const chevronRight = document.querySelector(".fa-chevron-right");
const carrousel = document.querySelector(".consultorioCarrousel");
const dots = document.querySelectorAll(".dot");

// Contador para manejar el desplazamiento
let currentIndex = 0;

const carrouselContainer = document.querySelector(
  ".consultorioCarrouselContainer"
);
const containerWidth = carrouselContainer.offsetWidth;

// Evento para mover a la izquierda
chevronLeft.addEventListener("click", function () {
  if (currentIndex > 0) {
    currentIndex--;
  } else {
    // Si está en la primera foto y va a la izquierda, salta a la última
    currentIndex = carrousel.children.length - 1;
  }
  updateCarrouselPosition();
});

// Evento para mover a la derecha
chevronRight.addEventListener("click", function () {
  if (currentIndex < carrousel.children.length - 1) {
    currentIndex++;
  } else {
    // Si está en la última foto y va a la derecha, salta a la primera
    currentIndex = 0;
  }
  updateCarrouselPosition();
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

// Función para el cambio automático
function autoSlide() {
  currentIndex = (currentIndex + 1) % carrousel.children.length; // Avanza al siguiente índice o vuelve al inicio
  updateCarrouselPosition();
}

// Inicia el carrusel automático
const autoSlideInterval = setInterval(autoSlide, 5000);

// Detener el auto-slide mientras interactúas con las flechas
chevronLeft.addEventListener("mouseenter", () =>
  clearInterval(autoSlideInterval)
);
chevronRight.addEventListener("mouseenter", () =>
  clearInterval(autoSlideInterval)
);

// Reinicia el auto-slide después de interactuar
chevronLeft.addEventListener("mouseleave", () => setInterval(autoSlide, 5000));
chevronRight.addEventListener("mouseleave", () => setInterval(autoSlide, 5000));

// Inicialización
updateDots();

const carrouselFotos = new CarrouselFotos();

//////////////////////////////////////////// Preguntas Frecuentes

const preguntas = document.querySelectorAll(".preguntaContainer");

for (const pregunta of preguntas) {
  pregunta.addEventListener("click", () => {
    // Cierra cualquier pregunta que esté actualmente expandida
    for (const otraPregunta of preguntas) {
      if (otraPregunta !== pregunta) {
        // Evita cerrar la que se acaba de hacer clic
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

////////////////////////////////////////////// Consultorios MAP

let map;

function initMap() {
  const location = { lat: -34.64087678885384, lng: -58.56284795125639 };

  // Crear el mapa
  map = new google.maps.Map(document.getElementById("map"), {
    center: location,
    zoom: 16,
    disableDefaultUI: true, 
    gestureHandling: "greedy",
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

  const placeId = "ChIJP0W_HXnHvJURGmfg0nBN2Lk";

  const service = new google.maps.places.PlacesService(map);

  service.getDetails(
    {
      placeId: placeId,
      fields: ["name", "formatted_address", "geometry", "reviews"], 
    },
    (place, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
    
        const marker = new google.maps.Marker({
          position: place.geometry.location,
          map: map,
          title: place.name,
        });

      
        marker.addListener("click", () => {
          const googleMapsURL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            place.name
          )},+${encodeURIComponent(place.formatted_address)}`;
          window.open(googleMapsURL, "_blank");
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `<div><strong>${place.name}</strong><br>${place.formatted_address}</div>`,
        });

        infoWindow.open(map, marker);

        map.setCenter(place.geometry.location);

        if (place.reviews && place.reviews.length > 0) {
          displayReviews(place.reviews); // Mostrar las reseñas
        }
      } else {
        console.error("No se pudo obtener los detalles del lugar: " + status);
      }
    }
  );
}

function displayReviews(reviews) {
  const reviewsContainer = document.getElementById("reviewsContainer");
  reviewsContainer.innerHTML = "";

  const limitedReviews = reviews.slice(0, 10);

  if (limitedReviews && limitedReviews.length > 0) {
    limitedReviews.forEach((review) => {
      const reviewDiv = document.createElement("div");
      reviewDiv.classList.add("review");

      // Avatar del autor o un placeholder si no hay imagen
      const avatar = review.profile_photo_url
        ? `<img src="${review.profile_photo_url}" alt="${review.author_name}">`
        : `<img src="https://via.placeholder.com/50" alt="Avatar">`;

      const stars = createStars(review.rating);

      reviewDiv.innerHTML = `
      <div class="reviewDetailsContainer">
        <a
          href="${review.author_url}"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div class="reviewDetails">
            ${avatar}
            <div class="nombreFechaContainer">
              <p class="nombre">${review.author_name}</p>
              <div class="fechaEstrellaContainer">
                <p class="fecha">
                  ${new Date(review.time * 1000).toLocaleDateString()}
                </p>
                <span class="stars">${stars}</span>
              </div>
            </div>
          </div>
          <p class="reviewText">${review.text}</p>
        </a>
      </div>
      `;

      reviewsContainer.appendChild(reviewDiv);
    });
  } else {
    reviewsContainer.innerHTML =
      "<p class='no-reviews'>No hay reseñas disponibles.</p>";
  }
}

function createStars(rating) {
  const maxStars = 5;
  let stars = "";
  for (let i = 1; i <= maxStars; i++) {
    stars += i <= rating ? "★" : "☆"; // Estrella llena o vacía
  }
  return stars;
}

const chevronLeftPacientes = document.querySelector(".chevronLeftPacientes");
const chevronRightPacientes = document.querySelector(".chevronRightPacientes");
const reviewsContainer = document.getElementById("reviewsContainer");

reviewsContainer.addEventListener("wheel", (event) => {
  if (Math.abs(event.deltaX) > 0) { // Verificar movimiento horizontal
    event.preventDefault(); // Bloquear solo el desplazamiento horizontal
  }
}, { passive: false }); // Necesario para usar preventDefault()

// Variables
let currentScrollPosition = 0;
let scrollStep = getElementWidth() ; // Ancho de un elemento + gap

// Función para obtener el ancho de un elemento
function getElementWidth() {
  const firstElement = reviewsContainer.querySelector(".reviewDetailsContainer");
  return firstElement ? firstElement.offsetWidth : 300; // Default si no hay elementos
}

// Evento para la flecha derecha (avanzar)
chevronRightPacientes.addEventListener("click", () => {
  currentScrollPosition += scrollStep;

  const maxScrollPosition = reviewsContainer.scrollWidth - reviewsContainer.clientWidth;
  if (currentScrollPosition > maxScrollPosition) {
    currentScrollPosition = maxScrollPosition; // Evita sobrepasar el límite derecho
  }

  reviewsContainer.scrollTo({
    left: currentScrollPosition,
    behavior: "smooth",
  });
});

// Evento para la flecha izquierda (retroceder)
chevronLeftPacientes.addEventListener("click", () => {
  currentScrollPosition -= scrollStep;

  if (currentScrollPosition < 0) {
    currentScrollPosition = 0; // Evita sobrepasar el límite izquierdo
  }

  reviewsContainer.scrollTo({
    left: currentScrollPosition,
    behavior: "smooth",
  });
});
