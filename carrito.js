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
        html += '<p>El carrito está vacío.</p>';
    } else {
        html += '<ul style="list-style:none;padding:0;">';
        carrito.forEach(p => {
            html += `<li style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
                <img src="${p.img}" style="width:40px;height:40px;object-fit:contain;border-radius:6px;">
                <span>${p.nombre} (${p.cantidad})</span> <span style="margin-left:auto;">${p.precio}</span>
            </li>`;
        });
        html += '</ul>';
        html += '<button onclick="vaciarCarrito()" style="background:#bfa14a;color:#fff;border:none;border-radius:6px;padding:8px 16px;cursor:pointer;">Vaciar carrito</button>';
    }
    let modal = document.getElementById('modal-carrito');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal-carrito';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100vw';
        modal.style.height = '100vh';
        modal.style.background = 'rgba(0,0,0,0.3)';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        modal.style.zIndex = '9999';
        modal.innerHTML = `<div id="carrito-content" style="background:#fffbe6;padding:30px 24px;border-radius:16px;min-width:320px;max-width:90vw;max-height:80vh;overflow:auto;position:relative;"></div>`;
        document.body.appendChild(modal);
        modal.addEventListener('click', function(e) {
            if (e.target === modal) modal.remove();
        });
    }
    document.getElementById('carrito-content').innerHTML = html + '<button onclick="document.getElementById(\'modal-carrito\').remove()" style="margin-top:16px;background:#7a5c1e;color:#fff;border:none;border-radius:6px;padding:8px 16px;cursor:pointer;">Cerrar</button>';
    modal.style.display = 'flex';
}

function vaciarCarrito() {
    localStorage.removeItem('carritoAceite');
    mostrarCarrito();
}
