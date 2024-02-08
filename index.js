let carrito = []

const contenedorEventos = document.querySelector("#eventos-disponibles")
const botonAgregar = document.querySelector("#button")
const carritoContenedor = document.querySelector("#carrito-contenedor")

function mostrarEventos() {
    eventos.forEach(evento => {
        contenedorEventos.innerHTML += `
        <option>"${evento.nombre}" - Adultos: $${evento.precioAdulto} - Menores: $${evento.precioMenor}</option>
    `    })
    botonAgregar.addEventListener("click", () => {
        const cantidadAdulto = document.querySelector("#cantidad-adultos").valueAsNumber || 0
        const cantidadMenor = document.querySelector("#cantidad-menores").valueAsNumber || 0
        const eventoSeleccionado = eventos[contenedorEventos.selectedIndex -1]
        agregarAlCarrito(eventoSeleccionado, cantidadAdulto, cantidadMenor)
    })
}
mostrarEventos()

function agregarAlCarrito(evento, cantidadAdulto, cantidadMenor) {
    
    if (eventoYaEnCarrito(evento.id)) {
        carrito.forEach(item => {
            if (item.eventoId === evento.id) {
                item.cantidadAdulto += cantidadAdulto
                item.cantidadMenor += cantidadMenor
            }
        })
    } else {
        const item = {
            eventoId: evento.id,
            nombre: evento.nombre,
            precioAdulto: evento.precioAdulto,
            precioMenor: evento.precioMenor,
            cantidadAdulto,
            cantidadMenor
        }

        carrito.push(item)
    }

    localStorage.setItem('carrito', JSON.stringify(carrito))
    
    verCarrito()
}


function verCarrito() {
    carritoContenedor.innerHTML = ''
    let sumaTotal = 0
    carrito.forEach(item => {
        const itemsDiv = document.createElement('div')
        itemsDiv.innerHTML = `
        <p>${item.nombre}</p>
        <p>Adultos: ${item.cantidadAdulto}</p>
        <p>Menores: ${item.cantidadMenor}</p>
        <p>Subtotal: $${calcularTotal(item)}</p>
        <button class="eliminar-item" data-evento-id="${item.eventoId}">Eliminar</button>
        `
        carritoContenedor.appendChild(itemsDiv)
        sumaTotal += calcularTotal(item)
    })
    const totalDiv = document.createElement("div")
    totalDiv.innerHTML = `
    <p> TOTAL: $${sumaTotal}</p>
    `
    carritoContenedor.appendChild(totalDiv)

    document.querySelectorAll(".eliminar-item").forEach(boton => {
        boton.addEventListener("click", () => {
            const eventoId = boton.getAttribute("data-evento-id")
            eliminarDelCarrito(eventoId)
        })
    })
    const btnComprar = document.createElement("button")
    btnComprar.textContent = "Comprar"
    btnComprar.classList.add("boton")
    btnComprar.addEventListener("click", (comprarCarrito))
    carritoContenedor.appendChild(btnComprar)
}

function eliminarDelCarrito(eventoId) {
    carrito =carrito.filter(item => item.eventoId !== eventoId)

    localStorage.setItem("carrito", JSON.stringify(carrito))

    verCarrito()
}

function calcularTotal(item) {
    return (item.cantidadAdulto * (item.precioAdulto || 0)) + (item.cantidadMenor * (item.precioMenor || 0))    
}
function carritoCompraTotal() {
    let sumaTotal = 0
    carrito.forEach(item => {
        total += calcularTotal(item)
    })
    return sumaTotal
}
function eventoYaEnCarrito(eventoId) {
    return carrito.some(item => item.eventoId === eventoId)
}

const carritoGuardado = localStorage.getItem('carrito')

if (carritoGuardado) {
    carrito = JSON.parse(carritoGuardado)
} else {
    localStorage.setItem('carrito', JSON.stringify(carrito))
}

function comprarCarrito() {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "btn btn-success",
          cancelButton: "btn btn-danger"
        },
        buttonsStyling: false
      });
      swalWithBootstrapButtons.fire({
        title: "¿Desea realizar la compra?",
        showCancelButton: true,
        confirmButtonText: "Comprar",
        cancelButtonText: "Volver",
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          swalWithBootstrapButtons.fire({
            title: "¡Muchas gracias!",
            text: "Compra realizada con éxito",
            icon: "success"
          });
        carrito = []
        localStorage.removeItem("carrito")
        } else if (
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire({
            title: "Puede modificar su compra"
          });
        }
      });
    
    verCarrito()

}

verCarrito()

