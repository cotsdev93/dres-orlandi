///////////////////////////////////////// animacion

import * as THREE from 'three';

// Escena, cámara y renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.9, 5000);

// Configurar el renderer con fondo transparente
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true // Habilita el fondo transparente
});
// renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0); // Fondo transparente
document.getElementById('container').appendChild(renderer.domElement);

// Crear la geometría amorfa (usando SphereGeometry con más segmentos para suavidad)
const geometry = new THREE.SphereGeometry(1, 20, 40);

// Crear el material de la pelota (color rosa suave)
const material = new THREE.MeshPhongMaterial({
    color: 0xff69b4, // Rosa
    shininess: 50,
    flatShading: true, // Para que sea suave
});

// Crear la pelota y añadirla a la escena
const ball = new THREE.Mesh(geometry, material);
scene.add(ball);

// Añadir luces para iluminar la escena
const light = new THREE.DirectionalLight(0xffffff, 3);
light.position.set(1, 1, 1).normalize();
scene.add(light);

const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

// Posicionar la cámara
camera.position.z = 5;

// Función de animación para hacer flotar la pelota
function animate() {
    requestAnimationFrame(animate);

    // Hacer flotar la pelota (movimiento suave hacia arriba y abajo)
    ball.position.y = Math.sin(Date.now() * 0.001) * 0.5; // Ajusta la velocidad y amplitud

    // Rotar la pelota
    ball.rotation.x += 0.01;
    ball.rotation.y += 0.01;

    // Renderizar la escena
    renderer.render(scene, camera);
}

// Iniciar la animación
animate();

// Ajustar el tamaño del renderer si la ventana cambia de tamaño
// window.addEventListener('resize', () => {
//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();
//     renderer.setSize(window.innerWidth, window.innerHeight);
// });

import './scss/styles.scss'