// Inicialización de EmailJS
emailjs.init("s5JCSOQnTpYrxF37l");

// Lista de videos de fondo
const videos = ["video.mp4", "Video2.mp4"];
let actual = 0;
const videoFondo = document.getElementById("videoFondo");

function reproducir(index) {
  videoFondo.src = videos[index];
  videoFondo.play();
}

videoFondo.addEventListener("ended", () => {
  actual = (actual + 1) % videos.length;
  reproducir(actual);
});

window.addEventListener('load', () => {
  reproducir(actual);
  mostrarSeccion('nada');
});

// Mostrar/Ocultar secciones
function mostrarSeccion(id) {
  const secciones = document.querySelectorAll('main > section');
  secciones.forEach(sec => {
    sec.style.display = (sec.id === id) ? 'block' : 'none';
  });
}

// Lightbox
function abrirLightbox(src, tipo = 'imagen') {
  const overlay = document.getElementById('lightboxOverlay');
  const img = document.getElementById('lightboxImage');
  const video = document.getElementById('lightboxVideo');

  if (tipo === 'video') {
    img.style.display = 'none';
    video.style.display = 'block';
    video.src = src;
    video.play();
  } else {
    video.pause();
    video.style.display = 'none';
    video.src = '';
    img.style.display = 'block';
    img.src = src;
  }

  overlay.style.display = 'flex';
}

function cerrarLightbox() {
  const overlay = document.getElementById('lightboxOverlay');
  const img = document.getElementById('lightboxImage');
  const video = document.getElementById('lightboxVideo');

  overlay.style.display = 'none';
  img.src = '';
  video.pause();
  video.src = '';
}

// Galería de Fotos/Videos
function mostrarGaleria(tipo) {
  mostrarSeccion('fotos');
  const galeria = document.getElementById('galeriaFotos');
  galeria.innerHTML = '';

  if (tipo === 'fotos') {
    for (let i = 1; i <= 50; i++) {
      const nombre = (i === 1) ? 'foto.jpg' : `foto${i}.jpg`;
      const url = `FotosyVideos/Fotos/${nombre}`;
      const img = document.createElement('img');
      img.src = url;
      img.alt = nombre;
      img.onerror = () => img.style.display = 'none';
      img.onclick = () => abrirLightbox(url, 'imagen');
      galeria.appendChild(img);
    }
  } else if (tipo === 'videos') {
    for (let i = 1; i <= 5; i++) {
      const nombre = (i === 1) ? 'video.mp4' : `video${i}.mp4`;
      const url = `FotosyVideos/Videos/${nombre}`;
      const video = document.createElement('video');
      video.src = url;
      video.muted = true;
      video.controls = false;
      Object.assign(video.style, {
        maxWidth: '220px',
        maxHeight: '160px',
        borderRadius: '10px',
        objectFit: 'cover',
        cursor: 'pointer'
      });
      video.onmouseover = () => video.play();
      video.onmouseout = () => video.pause();
      video.onclick = () => abrirLightbox(url, 'video');
      video.onerror = () => video.style.display = 'none';
      galeria.appendChild(video);
    }
  }
}

// Consultar estado del pedido
async function consultarReserva() {
  const numero = document.getElementById("numeroReserva").value.trim().toUpperCase();
  const divEstado = document.getElementById("estadoReserva");
  const detalle = document.getElementById("detalleEstado");

  const estados = {
    aprobada: ["✅", "#4CAF50"],
    "en proceso": ["⏳", "#ff9800"],
    finalizado: ["✔️", "#2196F3"],
  };

  try {
    const res = await fetch(`https://script.google.com/macros/s/AKfycbylmUYLosljwIAqDgJh3iCDpeFi7IUk1hsE-tbgPVFmg99SuLUAMv-01zPC37hpM_RR/exec?codigo=${encodeURIComponent(numero)}`);
    const data = await res.json();

    if (data.error) {
      detalle.innerHTML = `❌ ${data.error}`;
      divEstado.style.borderLeftColor = "#f44336";
      divEstado.style.color = "#f44336";
    } else {
      const [icono, color] = estados[data.estado.toLowerCase()] || ["❓", "#666"];
      detalle.innerHTML = `
        <strong>Producto:</strong> ${data.producto}<br>
        <strong>Estado:</strong> <span style="color:${color}; font-weight:bold;">${icono} ${data.estado}</span><br>
        <strong>Fecha estimada:</strong> ${data.fecha}<br>
      `;
      divEstado.style.borderLeftColor = color;
      divEstado.style.color = "#000";
    }

    divEstado.style.display = "block";
  } catch {
    detalle.innerHTML = "❌ Error al consultar la reserva.";
    divEstado.style.borderLeftColor = "#f44336";
    divEstado.style.color = "#f44336";
    divEstado.style.display = "block";
  }
}

// Enviar formulario de pedido
async function enviarPedido() {
  const form = document.getElementById("formPedido");
  const mensajeExito = document.getElementById("mensajeExito");

  try {
    const response = await emailjs.sendForm("service_8eep58e", "template_pmwbqfs", form);
    if (response.status === 200) {
      form.reset();
      mensajeExito.style.display = "block";
      setTimeout(() => mensajeExito.style.display = "none", 5000);
    }
  } catch (error) {
    alert("❌ Error al enviar el pedido.");
    console.error("EmailJS error:", error);
  }
}

// Mostrar productos según categoría
function mostrarSubPedido(tipo) {
  const secciones = document.querySelectorAll('main > section');
  secciones.forEach(sec => sec.style.display = 'none');

  const formPedido = document.getElementById('formPedido');
  const subSeccionModelos = document.getElementById('subSeccionModelos');
  const ejemplosPedido = document.getElementById('ejemplosPedido');
  ejemplosPedido.innerHTML = '';

  if (tipo === 'personalizados') {
    document.getElementById('pedido').style.display = 'block';
    formPedido.style.display = 'block';
    subSeccionModelos.style.display = 'none';
    return;
  }

  document.getElementById('pedido').style.display = 'block';
  subSeccionModelos.style.display = 'block';
  formPedido.style.display = 'none';

  let ejemplos = [];
  if (tipo === 'modelos') {
    ejemplos = [
      { titulo: "Cráneo humano", desc: "Modelo anatómico a escala real del cráneo humano.", precio: "$7.500" },
      { titulo: "Columna vertebral", desc: "Representación detallada de vértebras y discos.", precio: "$12.000" },
      { titulo: "Pelvis", desc: "Incluye detalles de cavidades óseas y articulaciones.", precio: "$9.800" }
    ];
  } else if (tipo === 'simuladores') {
    ejemplos = [
      { titulo: "Simulador de punción lumbar", desc: "Diseñado para práctica médica.", precio: "$18.000" },
      { titulo: "Simulador de brazo venoso", desc: "Para entrenamiento en extracción de sangre.", precio: "$22.000" }
    ];
  }

  ejemplos.forEach(item => {
    const card = document.createElement('div');
    card.classList.add('card-producto');
    card.innerHTML = `
      <button class="boton-agregar">+</button>
      <div class="imagen-placeholder">Imagen</div>
      <div class="contenido-card">
        <h4>${item.titulo}</h4>
        <p>${item.desc}</p>
        <p class="precio">${item.precio}</p>
      </div>
    `;
    card.querySelector('.boton-agregar').onclick = () => agregarAlCarrito(item.titulo, item.precio);
    ejemplosPedido.appendChild(card);
  });
}

// Carrito de compras
let carrito = [];

// Convierte "$7.500" en 7500
function precioANumero(precioStr) {
  return Number(precioStr.replace(/[^0-9]/g, ''));
}

// Convierte 7500 en "$7.500"
function formatoPrecio(num) {
  return '$' + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Agrega un producto
function agregarAlCarrito(titulo, precio) {
  const index = carrito.findIndex(item => item.titulo === titulo);
  if (index !== -1) {
    carrito[index].cantidad++;
  } else {
    carrito.push({ titulo, precio, cantidad: 1 });
  }
  alert(`Se agregó "${titulo}" al carrito`);
  renderizarCarrito();
}

// Vaciar carrito con confirmación
function vaciarCarrito() {
  if (confirm("¿Querés vaciar el carrito?")) {
    carrito = [];
    renderizarCarrito();
  }
}

// Renderiza el carrito
function renderizarCarrito() {
  const lista = document.getElementById("listaCarrito");
  const total = document.getElementById("totalCarrito");
  const contador = document.getElementById("contador-carrito");
  lista.innerHTML = '';
  let suma = 0;
  let totalItems = 0;

  carrito.forEach((item, i) => {
    const subtotal = precioANumero(item.precio) * item.cantidad;
    suma += subtotal;
    totalItems += item.cantidad;

    const div = document.createElement('div');
    div.className = 'item-carrito';
    div.innerHTML = `
      <strong>${item.titulo}</strong> - ${item.precio} x 
      <input type="number" min="1" value="${item.cantidad}" data-index="${i}" style="width: 60px;" />
      = <span>${formatoPrecio(subtotal)}</span>
      <button data-index="${i}" class="btn-eliminar">❌</button>
    `;
    lista.appendChild(div);
  });

  total.textContent = formatoPrecio(suma);

  // Mostrar u ocultar contador
  if (totalItems > 0) {
    contador.textContent = totalItems;
    contador.style.display = 'inline';
  } else {
    contador.style.display = 'none';
  }

  // Inputs para cambiar cantidad
  lista.querySelectorAll('input[type=number]').forEach(input => {
    input.addEventListener('change', (e) => {
      const index = parseInt(e.target.getAttribute('data-index'));
      let val = parseInt(e.target.value);
      if (val < 1) val = 1;
      carrito[index].cantidad = val;
      renderizarCarrito();
    });
  });

  // Botones eliminar
  lista.querySelectorAll('.btn-eliminar').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = parseInt(e.target.getAttribute('data-index'));
      carrito.splice(index, 1);
      renderizarCarrito();
    });
  });
}
