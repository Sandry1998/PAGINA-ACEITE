// Carrito de compras simple para la tienda de aceites
// Guarda los productos en localStorage y muestra el resumen en un modal

document.addEventListener('DOMContentLoaded', function() {
    // Añadir al carrito
    document.querySelectorAll('.btn-comprar').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            const card = e.target.closest('.producto-card');
            if (!card) return;
            const nombre = card.querySelector('h3').textContent;
            const precio = card.querySelector('.precio') ? card.querySelector('.precio').textContent : '';
            const select = card.querySelector('select');
            const cantidad = select ? select.value : 1;
            const img = card.querySelector('img').getAttribute('src');
            let carrito = JSON.parse(localStorage.getItem('carritoAceite')) || [];
            // Si ya existe, suma cantidad
            const idx = carrito.findIndex(p => p.nombre === nombre);
            if (idx >= 0) {
                carrito[idx].cantidad = parseInt(carrito[idx].cantidad) + parseInt(cantidad);
            } else {
                carrito.push({ nombre, precio, cantidad, img });
            }
            localStorage.setItem('carritoAceite', JSON.stringify(carrito));
            mostrarCarrito();
        });
    });

    // Mostrar carrito al hacer click en el icono
    const icono = document.getElementById('icono-carrito');
    if (icono) {
        icono.addEventListener('click', mostrarCarrito);
    }
});

function mostrarCarrito() {
    let carrito = JSON.parse(localStorage.getItem('carritoAceite')) || [];
    let html = '<h2>Carrito de compras</h2>';
    if (carrito.length === 0) {
        html += '<p style="text-align:center;color:#7a5c1e;">El carrito está vacío.</p>';
    } else {
        html += '<ul style="list-style:none;padding:0;">';
        carrito.forEach(p => {
            html += `<li><img src="${p.img}"><span>${p.nombre} <b>(${p.cantidad})</b></span> <span class='precio-item'>${p.precio}</span></li>`;
        });
        html += '</ul>';
        html += '<button onclick="vaciarCarrito()">Vaciar carrito</button>';
    }
    let modal = document.getElementById('modal-carrito');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal-carrito';
        document.body.appendChild(modal);
        modal.addEventListener('click', function(e) {
            if (e.target === modal) modal.remove();
        });
    }
    modal.innerHTML = `<div id="carrito-content">${html}<button onclick=\"document.getElementById('modal-carrito').remove()\">Cerrar</button></div>`;
    modal.style.display = 'flex';
}

function vaciarCarrito() {
    localStorage.removeItem('carritoAceite');
    mostrarCarrito();
}

// Muestra el modal del carrito y gestiona los productos seleccionados usando localStorage
function renderizarCarrito() {
    const carritoLista = document.getElementById('carrito-lista');
    const contador = document.getElementById('contador-carrito');
    const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
    let totalCantidad = 0;
    let totalPrecio = 0;
    if (!carritoLista) return;
    if (carrito.length === 0) {
        carritoLista.innerHTML = '<p style="color:#bfa14a;text-align:center;">No hay productos en el carrito.</p>';
        if (contador) {
            contador.textContent = '';
            contador.style.display = 'none';
        }
        return;
    }
    carritoLista.innerHTML = carrito.map(item => {
        const precio = item.precio ? Number(item.precio) : 0;
        totalCantidad += Number(item.cantidad);
        totalPrecio += precio * Number(item.cantidad);
        return `<div style='margin-bottom:10px;'><b>${item.nombre}</b> x${item.cantidad} <span style='color:#bfa14a;'>${item.tipo ? item.tipo : ''}</span> <span style='float:right;'>${precio.toFixed(2)}€</span></div>`;
    }).join('');
    carritoLista.innerHTML += `<div style='border-top:1px solid #bfa14a33;margin-top:12px;padding-top:10px;text-align:right;font-weight:700;color:#bfa14a;'>Total: ${totalPrecio.toFixed(2)} €</div>`;
    if (contador) {
        contador.textContent = totalCantidad > 0 ? totalCantidad : '';
        contador.style.display = totalCantidad > 0 ? 'inline-block' : 'none';
    }
}

function inicializarCarrito() {
    const iconoCarrito = document.getElementById('icono-carrito');
    const modalCarrito = document.getElementById('modal-carrito');
    const cerrarCarrito = document.getElementById('cerrar-carrito');
    const vaciarCarrito = document.getElementById('vaciar-carrito');
    if (!iconoCarrito || !modalCarrito) return;

    iconoCarrito.addEventListener('click', e => {
        e.preventDefault();
        renderizarCarrito();
        modalCarrito.style.display = 'flex';
    });
    if (cerrarCarrito) {
        cerrarCarrito.addEventListener('click', () => {
            modalCarrito.style.display = 'none';
        });
    }
    if (vaciarCarrito) {
        vaciarCarrito.addEventListener('click', () => {
            localStorage.removeItem('carrito');
            renderizarCarrito();
        });
    }
    // Cerrar modal al hacer clic fuera
    modalCarrito.addEventListener('click', e => {
        if (e.target === modalCarrito) modalCarrito.style.display = 'none';
    });
    // Actualizar contador al cargar
    renderizarCarrito();
}

// Escuchar cambios en localStorage desde otras pestañas o páginas
window.addEventListener('storage', function(e) {
    if (e.key === 'carrito') renderizarCarrito();
});

document.addEventListener('DOMContentLoaded', inicializarCarrito);
