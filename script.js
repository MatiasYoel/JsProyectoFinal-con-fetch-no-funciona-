fetch("./maquinas.json")
    .then(resp=>resp.json())
    .then(datos=>{
        miPrograma(datos)
    })

function miPrograma(maquinas) {
    let carrito=[]

const contenedor = document.querySelector('#contenedor')
const carritoContenedor = document.querySelector('#carritoContenedor')
const vaciarCarrito = document.querySelector('#vaciarCarrito')
const precioTotal = document.querySelector('#precioTotal')

document.addEventListener('DOMContentLoaded', () =>{
    carrito= JSON.parse(localStorage.getItem('carrito')) || []
    productoEnCarrito()
})

maquinas.forEach((producto) =>{
    const {id, nombre, precio, descripcion, stock, img} = producto
    contenedor.innerHTML += `
    <div class="card contenido-card row text-center img-fluid articulo" style="width: 18rem;">
        <img src=${img} class="card-img-top mt-5 " alt="...">
        <div class="card-body col-12 parrafo ">
            <h5 class="card-title title-cards">${nombre}</h5>
            <p class="card-text">Precio: $${precio}</p>
            <button onclick="agregarProducto${id}" class="btn btn-primary">Agregar al Carrito</button>
        </div>
    </div>
    `   
}
)
agregarProducto(id)
vaciarCarrito.addEventListener('click', () => {
    carrito.length = []
    productoEnCarrito()
})


document.addEventListener("keyup", e=>{

    if (e.target.matches("#buscador")){
        if (e.key ==="Escape")e.target.value = ""
        document.querySelectorAll(".articulo").forEach(buscado =>{
            buscado.textContent.toLowerCase().includes(e.target.value.toLowerCase())
            ?buscado.classList.remove("filtro"):buscado.classList.add("filtro")
        })
    }
})

function agregarProducto(id) {
    let controlStock = maquinas.find(el => el.id === id)
    const productoExistente= carrito.some(producto => producto.id === id)
    if (controlStock.stock>0 ) {
        if (productoExistente) {
            const producto = carrito.map(producto =>{
                if (producto.id === id) {
                    producto.cantidad++ 
                }
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Producto Agregado al Carrito',
                    showConfirmButton: false,
                    timer: 1500
                    })
            }
            )
            
        }else{
            const item = maquinas.find((producto) => producto.id === id)
            carrito.push(item)        
            Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Producto Agregado al Carrito',
        showConfirmButton: false,
        timer: 1500
        })
    
        }
    }else{
        Swal.fire({
            icon: 'error',
            title: 'Producto sin Stock',
            text: '¡Reingresara Pronto!',
        })
    }
    
    productoEnCarrito()
}

const productoEnCarrito = () => {
    const modalBody = document.querySelector('.modal .modal-body')

    modalBody.innerHTML = ''
    carrito.forEach((producto) =>{
        const {id, nombre, precio, descripcion, stock, img,cantidad } = producto
        modalBody.innerHTML += `
        <div class="modal-contenedor producto">
            <div>
                <img class="img-fluid img-carrito" src="${img}"
            </div>
            <p>Producto: ${nombre}</p>
            <p>Precio: $${precio}</p>
            <p>Cantidad: ${cantidad}</p>
            <button onclick="eliminarProducto(${id})" class="btn btn-danger">Eliminar Producto</button>
        </div>
        `
    }
    )
    if (carrito.length === 0){
        modalBody.innerHTML = `
        <p class="text-center text-primary parrafo">¡Tu carrito esta vacio!</p>
        `
    }
    carritoContenedor.textContent = carrito.length
    precioTotal.innerText = carrito.reduce((acc, producto) => acc + producto.cantidad * producto.precio, 0)
    almacenarStorage()
}

function eliminarProducto(id){
    const insumoId = id
    carrito = carrito.filter((insumo) => insumo.id !== insumoId)
    productoEnCarrito()
}

function almacenarStorage(){
    localStorage.setItem("carrito", JSON.stringify(carrito))
}
}
