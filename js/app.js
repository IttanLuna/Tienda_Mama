let productos = [];
let categoriaActual = 'Todos';

// Icono por categoría
const iconos = {
  'Perfumes': '🌹',
  'Jabones': '🧼',
  'Shampoo': '🧴',
  'Crema': '🫧',
  'Desodorante': '💨',
  'Cuidado Facial': '✨',
  'Cuidado Corporal': '🪷',
  'Maquillaje': '💄',
  'Accesorios': '🎀',
  'default': '📦'
};

async function cargarProductos() {
  try {
    const respuesta = await fetch('data/productos.json');
    productos = await respuesta.json();
    generarFiltros();
    mostrarProductos(productos);
  } catch (error) {
    console.error('Error al cargar productos:', error);
  }
}

function generarFiltros() {
  const categorias = ['Todos', ...new Set(productos.map(p => p.categoria))];
  const contenedor = document.getElementById('filtros');
  
  contenedor.innerHTML = categorias.map(cat => `
    <button class="filtro-btn ${cat === 'Todos' ? 'activo' : ''}" data-categoria="${cat}">
      ${cat}
    </button>
  `).join('');

  contenedor.querySelectorAll('.filtro-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      contenedor.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('activo'));
      btn.classList.add('activo');
      categoriaActual = btn.dataset.categoria;
      filtrarProductos();
    });
  });
}

function mostrarProductos(lista) {
  const catalogo = document.getElementById('catalogo');
  const noResultados = document.getElementById('noResultados');

  if (lista.length === 0) {
    catalogo.innerHTML = '';
    noResultados.style.display = 'block';
    return;
  }

  noResultados.style.display = 'none';
  catalogo.innerHTML = lista.map(producto => `
    <div class="producto-card">
      ${
        producto.imagen
          ? `<img class="producto-img" src="${producto.imagen}" alt="${producto.nombre}"
              onerror="this.style.display='none'; this.insertAdjacentHTML('afterend', '<div class=&quot;producto-img&quot;>${iconos[producto.categoria] || iconos['default']}</div>');">`
          : `<div class="producto-img">${iconos[producto.categoria] || iconos['default']}</div>`
      }
      <div class="producto-info">
        <h3 class="producto-nombre">${producto.nombre}</h3>
        <p class="producto-categoria">${producto.categoria}</p>
        <p class="producto-precio">Bs. ${producto.precio.toFixed(2)}</p>
      </div>
    </div>
  `).join('');
}

function filtrarProductos() {
  const texto = document.getElementById('searchInput').value.toLowerCase();
  
  let resultado = productos.filter(producto => {
    const coincideNombre = producto.nombre.toLowerCase().includes(texto);
    const coincideCategoria = categoriaActual === 'Todos' || producto.categoria === categoriaActual;
    return coincideNombre && coincideCategoria;
  });

  mostrarProductos(resultado);
}

// Eventos
document.getElementById('searchInput').addEventListener('input', filtrarProductos);

// Iniciar
cargarProductos();
