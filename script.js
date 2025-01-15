////////////////////////////////// INTRO

const intro = document.querySelector(".intro");
const logoIntro = document.querySelector(".logoIntro");

function animacionInicial() {
  const isMobile = window.innerWidth < 737;
  if (isMobile) {
    setTimeout(() => {
      logoIntro.classList.add("logoIntroAnimation");
      setTimeout(() => {
        intro.style.transform = "translateY(-100%)";
        setTimeout(() => {
          intro.style.opacity = "0";
        }, 1500);
      }, 1500);
      console.log("funca");
    }, 10);
  } else {
    setTimeout(() => {
      logoIntro.classList.add("logoIntroAnimation");
      setTimeout(() => {
        logoIntro.style.transform = "translateX(-170%)";
        setTimeout(() => {
          intro.style.transform = "translateY(-85%)";
          setTimeout(() => {
            intro.style.opacity = "0";
            intro.style.zIndex = "0";
          }, 1000);
        }, 1000);
      }, 1000);
      console.log("funca");
    }, 1000);
  }
}

animacionInicial();

////////////////////////////////// NAV

const toggleMenuH = document.querySelector(".toggleMenuH");
const ul = document.querySelector("ul");
const main = document.getElementById("main");

toggleMenuH.addEventListener("click", () => {
  ul.classList.toggle("move");
  main.classList.toggle("blureado");
});

///////////////////////////////// Clase para manejar los servicios
function correccionError() {
  setTimeout(() => {
    const aUna = document.querySelector(".aUna");  // Cambio para seleccionar la clase
    if (aUna) { // Asegura que el elemento exista
      aUna.style.opacity = "1";
    }
  }, 1000);
}
correccionError();


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

const servicios = new Servicios();

function cargarServiciosCategoria(listaServicios, selector) {
  const contenedor = document.querySelector(selector);

  if (!contenedor) {
    console.error(`No se encontró el contenedor con el selector: ${selector}`);
    return;
  }

  contenedor.innerHTML = "";

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

class CarrouselFotos {
  constructor() {
    this.fotos = [];
    this.cargarRegistros().then(() => {
      this.cargarFotos();
    });
  }

  async cargarRegistros() {
    try {
      const resultado = await fetch("./JSON/fotosConsultorios.JSON");
      this.fotos = await resultado.json();
    } catch (error) {
      console.error("Error cargando las fotos:", error);
    }
  }

  cargarFotos() {
    const consultorioCarrousel = document.querySelector(
      ".consultorioCarrousel"
    );
    consultorioCarrousel.innerHTML = "";

    for (const foto of this.fotos) {
      consultorioCarrousel.innerHTML += `<img src="${foto.img}" alt="">`;
    }
  }
}

function calcularAncho() {
  return document.querySelector(".consultorioCarrouselContainer").offsetWidth;
}

const chevronLeft = document.querySelector(".fa-chevron-left");
const chevronRight = document.querySelector(".fa-chevron-right");
const carrousel = document.querySelector(".consultorioCarrousel");
const dots = document.querySelectorAll(".dot");

let currentIndex = 0;

function updateCarrouselPosition() {
  const containerWidth = calcularAncho();
  const newTranslateX = -currentIndex * containerWidth;
  carrousel.style.transform = `translateX(${newTranslateX}px)`;
  updateDots();
}

function updateDots() {
  dots.forEach((dot, index) => {
    if (index === currentIndex) {
      dot.classList.add("active");
    } else {
      dot.classList.remove("active");
    }
  });
}

chevronLeft.addEventListener("click", function () {
  if (currentIndex > 0) {
    currentIndex--;
  } else {
    currentIndex = carrousel.children.length - 1;
  }
  updateCarrouselPosition();
});

chevronRight.addEventListener("click", function () {
  if (currentIndex < carrousel.children.length - 1) {
    currentIndex++;
  } else {
    currentIndex = 0;
  }
  updateCarrouselPosition();
});

function autoSlide() {
  currentIndex = (currentIndex + 1) % carrousel.children.length;
  updateCarrouselPosition();
}

let autoSlideInterval = setInterval(autoSlide, 5000);

window.addEventListener("resize", () => {
  updateCarrouselPosition(); // Recalcular en caso de resize
});

new CarrouselFotos();
updateDots();

//////////////////////////////////////////// Preguntas Frecuentes

const preguntas = document.querySelectorAll(".preguntaContainer");

for (const pregunta of preguntas) {
  pregunta.addEventListener("click", () => {
    for (const otraPregunta of preguntas) {
      if (otraPregunta !== pregunta) {
        otraPregunta.classList.remove("expandida");
        const otraFlecha = otraPregunta.querySelector(".flechaPregunta");
        if (otraFlecha) {
          otraFlecha.classList.remove("rotada");
        }
      }
    }

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
      fields: [
        "name",
        "formatted_address",
        "geometry",
        "reviews",
        "user_ratings_total",
      ],
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
          displayReviews(place.reviews);
          displayCompanyInfo(
            place.name,
            place.reviews,
            place.user_ratings_total
          ); // Modificación: pasar `user_ratings_total`
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
    stars += i <= rating ? "★" : "☆";
  }
  return stars;
}

function displayCompanyInfo(companyName, reviews, userRatingsTotal) {
  const pacientesReviewsContainer = document.querySelector(".pacientesReviews");

  const averageRating = calculateAverageRating(reviews);

  const stars = createStars(averageRating);

  pacientesReviewsContainer.innerHTML = `

      <p class="companyName">${companyName}</p>
      <div class="rating">
        <span class="stars">${stars}</span>${averageRating}
        <p class="userRatingsTotal">(${userRatingsTotal})</p>
      </div>
    
    `;
}

function calculateAverageRating(reviews) {
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  return (totalRating / reviews.length).toFixed(1);
}

const chevronLeftPacientes = document.querySelector(".chevronLeftPacientes");
const chevronRightPacientes = document.querySelector(".chevronRightPacientes");
const reviewsContainer = document.getElementById("reviewsContainer");

reviewsContainer.addEventListener(
  "wheel",
  (event) => {
    if (Math.abs(event.deltaX) > 0) {
      // Verificar movimiento horizontal
      event.preventDefault(); // Bloquear solo el desplazamiento horizontal
    }
  },
  { passive: false }
);

