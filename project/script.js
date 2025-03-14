

const API_URL = "http://192.168.20.24:3600/productos";


// Función para cargar productos en la tabla
function CargarProductos() {
    fetch(API_URL)
    .then(response => response.json())
    .then(data => {
        const tbody = document.getElementById("tablaproductos");
        tbody.innerHTML = "";
        data.forEach(producto => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${producto.codigo_barras}</td>
                <td>${producto.nombre}</td>
                <td>${producto.precio_compra}</td>
                <td>${producto.precio_venta}</td>
                <td>${producto.stock}</td>
                <td>${producto.estado}</td>
                <td>
                    <button onclick="actualizarProducto(${producto.id_producto})">Editar</button>
                    <button onclick="eliminarProducto(${producto.id_producto})">Eliminar</button>
                </td>
            `;
            console.log(producto.id_producto);
            tbody.appendChild(fila);
        });
    })
    .catch(error => console.error("Error cargando productos:", error));
}



document.getElementById("formulario").addEventListener("submit", function(event) {
    event.preventDefault();
    
    // Todos los IDs coinciden con el HTML
    const codigo_barras = document.getElementById("codigo_barras").value;
    const nombre = document.getElementById("nombre").value;
    const descripcion = document.getElementById("descripcion").value;
    const precio_compra = parseFloat(document.getElementById("precio_compra").value);
    const precio_venta = parseFloat(document.getElementById("precio_venta").value);
    const stock = parseInt(document.getElementById("stock").value);
    const stock_minimo = parseInt(document.getElementById("stock_minimo").value);
    const unidad_de_medida = document.getElementById("unidad_de_medida").value;
    const imagen = document.getElementById("imagen").value;
    const estado = document.getElementById("estado").value;
   
    fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            codigo_barras, // Nombre correcto
            nombre,
            descripcion,
            precio_compra,
            precio_venta,
            stock,
            stock_minimo,
            unidad_de_medida,
            imagen,
            estado
        })
    })
    .then(response => {
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        return response.json();
    })
    .then(() => {
        Swal.fire({
            title: "¡Producto registrado!",
            text: "El producto se ha registrado correctamente.",
            icon: "success",
            background: "#FFF",
            color: "#10b981",
            confirmButtonColor: "#10b981",
            confirmButtonText: "¡Entendido!"
        });
        document.getElementById("formulario").reset();
        
        CargarProductos();
    })
    .catch(error => {
        console.error("Error:", error);
        Swal.fire({
            title: "¡Error!",
            text: "Error al registrar el producto",
            icon: "error",
            background: "#1e1e1e",
            color: "white",
            confirmButtonColor: "#ff0000",
            confirmButtonText: "Cerrar"
        });
    });
});


// Función para eliminar un empleado
function eliminarProducto(id) {
    // 1. Agregar confirmación
    Swal.fire({
        title: "¿Eliminar producto?",
        text: "¡Esta acción no se puede deshacer!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
        background: "#1e1e1e",
        color: "white"
    }).then((result) => {
        if (result.isConfirmed) {
            // 2. Mover toda la lógica dentro de la confirmación
            fetch(`${API_URL}/${id}`, { method: "DELETE" })
            .then(response => {
                if (!response.ok) throw new Error("Error al eliminar");
                return response.json();
            })
            .then(() => {
                CargarProductos(); // Actualizar tabla
                // 3. Mostrar alerta después de eliminar
                Swal.fire({
                    title: "¡Eliminado!",
                    text: "El producto ha sido eliminado.",
                    icon: "success",
                    background: "#1e1e1e",
                    color: "white",
                    confirmButtonColor: "red",
                    confirmButtonText: "¡Entendido!"
                });
            })
            .catch(error => {
                console.error("Error:", error);
                Swal.fire({
                    title: "¡Error!",
                    text: "No se pudo eliminar el producto",
                    icon: "error",
                    background: "#1e1e1e",
                    color: "white"
                });
            });
        }
    });
}



//llamarla

// Cargar productos al iniciar
document.addEventListener("DOMContentLoaded", CargarProductos);