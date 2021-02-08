///////////////////////////////////////////////////////////////////////////////////
/* --------------------------  Selectors   --------------------------------------*/
//////////////////////////////////////////////////////////////////////////////////
const carrito = document.querySelector("#carrito");
const contenedorCarrito = document.querySelector("#lista-carrito tbody");
const listaProductos = document.querySelector("#lista-productos");
const vaciarCarrito = document.querySelector("#vaciar-carrito");

let articulosCarrito = [];

let dataProductos;

////////////////////////////////////////////////////////////////////////////////////
/* ---------------------------- Listeners ----------------------------------------*/
////////////////////////////////////////////////////////////////////////////////////
document.addEventListener("DOMContentLoaded", () => {
	articulosCarrito = JSON.parse(localStorage.getItem("carrito")) || [];
	insertarCarritoHTML();

/*--------------   Llamada a BD local con Fetch - Async Function   ---------------*/
	cargarBd();

});

listaProductos.addEventListener("click", agregarProducto);

$("#carrito").click(carrito, quitarProducto);

$("#vaciar-carrito").click(vaciarCarrito, borrarCarrito);

$("#formulario").on("submit", filtrarProductos);

$("#pagar").click("pagar", pagoTarjeta);

$(".nosotroStory").fadeIn(6000, animacionFade);


/////////////////////////////////////////////////////////////////////////////////////////
/* ---------------------------------   Funciones   ------------------------------------*/
/////////////////////////////////////////////////////////////////////////////////////////

/* -------------- llamada a BD local con Fetch - async Function  ----------------------*/
async function consultarBd() {
	const resultado = await fetch("/js/productos.json");
	let datos = await resultado.json();
	dataProductos = datos;
}

function cargarBd() {
	consultarBd();
}

function animacionFade() {
	$(".nosotroStory").hide(6000, animacionFade2);
	function animacionFade2() {
		$(".nosotroStory").slideDown(6000);
	}
}

function pagoTarjeta() {
	console.log("se realizara el pago con tarjeta Visa");
}

function cargarListaProductos(productos) {
	productos.forEach((producto, index) => {
		const { nombre, imagen, precio, id, tipo, description } = producto;

		const divCard = document.createElement("div");
		divCard.classList.add("col-12", "col-md-3", "py-4");
		divCard.innerHTML = `
			<div class="card col-12 col-md-3 py-4" style="width: 16rem;">
                <img src="${imagen}" class="card-img-top" alt="Birra image">
                <div class="card-body">
                <h4 class="card-title text-justify text-center blanco">${nombre}</h4>
                <h6 class="card-subtitle mb-2 text-muted text-center">${tipo}</h6>
                <p class="card-text text-justify blanco">
                ${description}</p>
                <p class="precio blanco"> $ <span>${precio}</span></p>
                <a href="#" class="btn btn-outline-light agregar-carrito" data-id="${id}">Agregar  <i class="fas fa-shopping-basket"></i></a>
                </div>
            </div>
		`;
		if (index % 4 === 0) {
			const row = document.createElement("div");
			row.classList.add("row");

			listaProductos.appendChild(row);
			row.appendChild(divCard);
		} else {
			const row = document.querySelector("#lista-productos .row:last-child");
			row.appendChild(divCard);
		}
	});
}

function filtrarProductos(e) {
	e.preventDefault();

	const busqueda = $("#buscador").val();

	const resultado = dataProductos.filter((producto) =>
		producto.nombre.toLocaleLowerCase().includes(busqueda.toLocaleLowerCase())
	);

	limpiarProductos();
	cargarListaProductos(resultado);
}

function agregarProducto(e) {
	e.preventDefault();

	if (e.target.classList.contains("agregar-carrito")) {
		const productoSeleccionado = e.target.parentElement.parentElement;
		obtenerDatos(productoSeleccionado);
	}
}

function borrarCarrito() {
	limpiarCarrito();
	articulosCarrito = [];
	guardarStorage();
}

function quitarProducto(e) {
	e.preventDefault();

	if (e.target.classList.contains(`borrar-producto`)) {
		Swal.fire({
			position: "top-center",
			icon: "error",
			title: "El producto fue quitado",
			showConfirmButton: false,
			timer: 1700,
		});
		const productoId = e.target.getAttribute("data-id");
		articulosCarrito = articulosCarrito.filter((producto) => producto.id != productoId);
		insertarCarritoHTML();
		guardarStorage();
	}
}

function obtenerDatos(producto) {
	const productoAgregado = {
		nombre: producto.querySelector("h4").textContent,
		precio: producto.querySelector(".precio span").textContent,
		id: producto.querySelector("a").getAttribute("data-id"),
		cantidad: 1,
	};
	function comprobar() {
		Swal.fire({
			position: "top-center",
			icon: "success",
			title: "El producto fue agregado al carrito",
			showConfirmButton: false,
			timer: 1500,
		});
		const existe = articulosCarrito.some((producto) => producto.id == productoAgregado.id);
		if (existe) {
			/* Producto ya existente */
			const productos = articulosCarrito.map((producto) => {
				if (producto.id === productoAgregado.id) {
					producto.cantidad++;
					return producto;
				} else{
					return producto;
				}
			});
			articulosCarrito = [...productos];
		} else {
			/* Agrego el producto al carrito */
			articulosCarrito.push(productoAgregado);
		}
	}
	comprobar();
	insertarCarritoHTML();
	guardarStorage();
}

function guardarStorage() {
	localStorage.setItem("carrito", JSON.stringify(articulosCarrito));
}

function insertarCarritoHTML() {
	/* Borra el contenido del carrito */
	limpiarCarrito();

	/* Inserta los productos del carrito en el HTML */
	articulosCarrito.forEach((producto) => {
		
		const { nombre, precio, cantidad, id } = producto;

		const row = document.createElement("tr");
		row.innerHTML = `
			<td>
				${nombre}
			</td>
			<td>
				${precio}
			</td>
			<td>
				${cantidad}
			</td>
			<td>
				<a href="#" class="" > <i class="far fa-trash-alt borrar-producto rojo" data-id="${id}"></i> </a>
			</td>
		`;

		contenedorCarrito.appendChild(row);
	});
}

function limpiarCarrito() {
	while (contenedorCarrito.firstChild) {
		contenedorCarrito.removeChild(contenedorCarrito.firstChild);
	}
}

function limpiarProductos() {
	while (listaProductos.firstChild) {
		listaProductos.removeChild(listaProductos.firstChild);
	}
}
/* ----------- Cuenta Regresiva Sorteo  ------------------------*/
$('.contador').countdown('2021/02/20 10:00:00', function(event){
    $('#dias').html(event.strftime('%D'));
    $('#horas').html(event.strftime('%H'));
    $('#minutos').html(event.strftime('%M'));
    $('#segundos').html(event.strftime('%S'));
});