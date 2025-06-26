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
