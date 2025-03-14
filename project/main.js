let products = [];
let currentId = 1;

function handleSubmit(event) {
    event.preventDefault();
    
    const formData = {
        id_producto: currentId,
        codigo_barras: document.getElementById('codigo_barras').value,
        nombre: document.getElementById('nombre').value,
        descripcion: document.getElementById('descripcion').value,
        precio_compra: parseFloat(document.getElementById('precio_compra').value),
        precio_venta: parseFloat(document.getElementById('precio_venta').value),
        stock: parseInt(document.getElementById('stock').value),
        stock_minimo: parseInt(document.getElementById('stock_minimo').value),
        unidad_de_medida: document.getElementById('unidad_de_medida').value,
        imagen: document.getElementById('imagen').value,
        estado: document.getElementById('estado').value
    };

    products.push(formData);
    currentId++;
    
    updateTable();
    event.target.reset();

    // Add success feedback
    const submitBtn = document.querySelector('.submit-btn');
    const originalContent = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="ms-Icon ms-Icon--CheckMark" aria-hidden="true"></i> Product Registered!';
    submitBtn.style.backgroundColor = 'var(--success-color)';
    
    setTimeout(() => {
        submitBtn.innerHTML = originalContent;
        submitBtn.style.backgroundColor = '';
    }, 2000);
}

function updateTable() {
    const tbody = document.querySelector('#productsTable tbody');
    tbody.innerHTML = '';
    
    products.forEach(product => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${product.id_producto}</td>
            <td>${product.codigo_barras}</td>
            <td>${product.nombre}</td>
            <td>$${product.precio_compra.toFixed(2)}</td>
            <td>$${product.precio_venta.toFixed(2)}</td>
            <td>${product.stock}</td>
            <td>
                <span class="status-badge status-${product.estado}">
                    ${product.estado}
                </span>
            </td>
            <td>
                <button class="action-btn edit-btn" onclick="editProduct(${product.id_producto})">
                    Edit
                </button>
                <button class="action-btn delete-btn" onclick="deleteProduct(${product.id_producto})">
                    Delete
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(product => product.id_producto !== id);
        updateTable();
    }
}

function editProduct(id) {
    const product = products.find(p => p.id_producto === id);
    if (!product) return;

    document.getElementById('codigo_barras').value = product.codigo_barras;
    document.getElementById('nombre').value = product.nombre;
    document.getElementById('descripcion').value = product.descripcion;
    document.getElementById('precio_compra').value = product.precio_compra;
    document.getElementById('precio_venta').value = product.precio_venta;
    document.getElementById('stock').value = product.stock;
    document.getElementById('stock_minimo').value = product.stock_minimo;
    document.getElementById('unidad_de_medida').value = product.unidad_de_medida;
    document.getElementById('imagen').value = product.imagen;
    document.getElementById('estado').value = product.estado;

    products = products.filter(p => p.id_producto !== id);
    updateTable();
}