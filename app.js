//Variable que mantiene el estado visible del carrito
var carritoVisible = false;

//Espermos que todos los elementos de la pàgina cargen para ejecutar el script
if (document.readyState == 'loading') {
  document.addEventListener('DOMContentLoaded', ready)
} else {
  ready();
}

function ready() {

  //Agregremos funcionalidad a los botones eliminar del carrito
  var botonesEliminarItem = document.getElementsByClassName('btn-eliminar');
  for (var i = 0; i < botonesEliminarItem.length; i++) {
    var button = botonesEliminarItem[i];
    button.addEventListener('click', eliminarItemCarrito);
  }

  //Agrego funcionalidad al boton sumar cantidad
  var botonesSumarCantidad = document.getElementsByClassName('sumar-cantidad');
  for (var i = 0; i < botonesSumarCantidad.length; i++) {
    var button = botonesSumarCantidad[i];
    button.addEventListener('click', sumarCantidad);
  }

  //Agrego funcionalidad al buton restar cantidad
  var botonesRestarCantidad = document.getElementsByClassName('restar-cantidad');
  for (var i = 0; i < botonesRestarCantidad.length; i++) {
    var button = botonesRestarCantidad[i];
    button.addEventListener('click', restarCantidad);
  }

  //Agregamos funcionalidad al boton Agregar al carrito
  var botonesAgregarAlCarrito = document.getElementsByClassName('boton-item');
  for (var i = 0; i < botonesAgregarAlCarrito.length; i++) {
    var button = botonesAgregarAlCarrito[i];
    button.addEventListener('click', agregarAlCarritoClicked);
  }

  //Agregamos funcionalidad al botón comprar
  document.getElementsByClassName('btn-pagar')[0].addEventListener('click', pagarClicked)
}
//Eliminamos todos los elementos del carrito y lo ocultamos
function pagarClicked() {
  alert("Gracias por la compra");
  //Elimino todos los elmentos del carrito
  var carritoItems = document.getElementsByClassName('carrito-items')[0];
  while (carritoItems.hasChildNodes()) {
    carritoItems.removeChild(carritoItems.firstChild)
  }
  actualizarTotalCarrito();
  ocultarCarrito();
}
//Funciòn que controla el boton clickeado de agregar al carrito
function agregarAlCarritoClicked(event) {
  var button = event.target;
  var item = button.parentElement;
  var titulo = item.getElementsByClassName('titulo-item')[0].innerText;

  // Tomamos los precios del dataset (asegúrate que en HTML data-kilo y data-libra sean números sin puntos: data-kilo="7000")
  var precioItem = item.getElementsByClassName('precio-item')[0];
  var precioKg = precioItem.dataset.kilo;
  var precioLb = precioItem.dataset.libra;

  var imagenSrc = item.getElementsByClassName('img-item')[0].src;

  agregarItemAlCarrito(titulo, precioKg, precioLb, imagenSrc);
  hacerVisibleCarrito();
}

//Funcion que hace visible el carrito
function hacerVisibleCarrito() {
  carritoVisible = true;
  var carrito = document.getElementsByClassName('carrito')[0];
  carrito.style.marginRight = '0';
  carrito.style.opacity = '1';

  var items = document.getElementsByClassName('contenedor-items')[0];
  items.style.width = '60%';
}

//Funciòn que agrega un item al carrito
function agregarItemAlCarrito(titulo, precioKg, precioLb, imagenSrc) {
  var item = document.createElement('div');
  item.classList.add('item'); // CORREGIDO (antes era una asignación incorrecta)
  var itemsCarrito = document.getElementsByClassName('carrito-items')[0];

  //controlamos que el item que intenta ingresar no se encuentre en el carrito
  var nombresItemsCarrito = itemsCarrito.getElementsByClassName('carrito-item-titulo');
  for (var i = 0; i < nombresItemsCarrito.length; i++) {
    if (nombresItemsCarrito[i].innerText == titulo) {
      alert("El item ya se encuentra en el carrito");
      return;
    }
  }

  // Sanitizar título para usar en el atributo name (evita espacios y caracteres raros)
  var safeTitle = titulo.replace(/[^a-z0-9\-_]/gi, '-');

  var itemCarritoContenido = `
        <div class="carrito-item">
            <img src="${imagenSrc}" width="80px" alt="">
            <div class="carrito-item-detalles">
                <span class="carrito-item-titulo">${titulo}</span>
                <div class="selector-cantidad">
                    <i class="fa-solid fa-minus restar-cantidad"></i>
                    <input type="text" value="1" class="carrito-item-cantidad" disabled>
                    <i class="fa-solid fa-plus sumar-cantidad"></i>
                </div>
                <div class="selector-unidad">
                    <label>
                        <input type="radio" name="unidad-${safeTitle}" value="kg" checked> Kg
                    </label>
                    <label>
                        <input type="radio" name="unidad-${safeTitle}" value="lb"> Lb
                    </label>
                </div>
                <span class="carrito-item-precio" 
                      data-kilo="${precioKg}" 
                      data-libra="${precioLb}">
                      $${parseFloat(precioKg).toLocaleString("es")}/Kg
                </span>
            </div>
            <button class="btn-eliminar">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `;
  item.innerHTML = itemCarritoContenido;
  itemsCarrito.append(item);

  //Agregamos la funcionalidad eliminar al nuevo item
  item.getElementsByClassName('btn-eliminar')[0].addEventListener('click', eliminarItemCarrito);

  //Agregmos al funcionalidad restar cantidad del nuevo item
  var botonRestarCantidad = item.getElementsByClassName('restar-cantidad')[0];
  botonRestarCantidad.addEventListener('click', restarCantidad);

  //Agregamos la funcionalidad sumar cantidad del nuevo item
  var botonSumarCantidad = item.getElementsByClassName('sumar-cantidad')[0];
  botonSumarCantidad.addEventListener('click', sumarCantidad);

  // **Usamos concatenación en vez de template literal aquí** para evitar el error TS/VSCode
  var radiosUnidad = item.querySelectorAll('input[name="unidad-' + safeTitle + '"]');
  radiosUnidad.forEach(radio => {
    radio.addEventListener('change', actualizarTotalCarrito);
  });

  //Actualizamos total
  actualizarTotalCarrito();
}
//Aumento en uno la cantidad del elemento seleccionado
function sumarCantidad(event) {
  var buttonClicked = event.target;
  var selector = buttonClicked.parentElement;
  var cantidadActual = selector.getElementsByClassName('carrito-item-cantidad')[0].value;
  cantidadActual++;
  selector.getElementsByClassName('carrito-item-cantidad')[0].value = cantidadActual;
  actualizarTotalCarrito();
}
//Resto en uno la cantidad del elemento seleccionado
function restarCantidad(event) {
  var buttonClicked = event.target;
  var selector = buttonClicked.parentElement;
  var cantidadActual = selector.getElementsByClassName('carrito-item-cantidad')[0].value;
  cantidadActual--;
  if (cantidadActual >= 1) {
    selector.getElementsByClassName('carrito-item-cantidad')[0].value = cantidadActual;
    actualizarTotalCarrito();
  }
}

//Elimino el item seleccionado del carrito
function eliminarItemCarrito(event) {
  var buttonClicked = event.target;
  buttonClicked.parentElement.parentElement.remove();
  //Actualizamos el total del carrito
  actualizarTotalCarrito();
  ocultarCarrito();
}
//Funciòn que controla si hay elementos en el carrito. Si no hay oculto el carrito.
function ocultarCarrito() {
  var carritoItems = document.getElementsByClassName('carrito-items')[0];
  if (carritoItems.childElementCount == 0) {
    var carrito = document.getElementsByClassName('carrito')[0];
    carrito.style.marginRight = '-100%';
    carrito.style.opacity = '0';
    carritoVisible = false;

    var items = document.getElementsByClassName('contenedor-items')[0];
    items.style.width = '100%';
  }
}
//Actualizamos el total de Carrito
function actualizarTotalCarrito() {
  var carritoContenedor = document.getElementsByClassName('carrito')[0];
  var carritoItems = carritoContenedor.getElementsByClassName('carrito-item');
  var total = 0;

  for (var i = 0; i < carritoItems.length; i++) {
    var item = carritoItems[i];
    var precioElemento = item.getElementsByClassName('carrito-item-precio')[0];
    var precioKg = parseFloat(precioElemento.dataset.kilo);
    var precioLb = parseFloat(precioElemento.dataset.libra);

    var cantidadItem = item.getElementsByClassName('carrito-item-cantidad')[0].value;

    // Detectar unidad seleccionada (buscamos dentro del mismo item)
    var selectedRadio = item.querySelector('input[type="radio"]:checked');
    var unidadSeleccionada = selectedRadio ? selectedRadio.value : "kg";
    var precioUnidad = unidadSeleccionada === "kg" ? precioKg : precioLb;

    total += precioUnidad * cantidadItem;

    //Actualizar visualización del precio unitario
    precioElemento.innerText = `$${precioUnidad.toLocaleString("es")}/${unidadSeleccionada}`;
  }

  total = Math.round(total * 100) / 100;
  document.getElementsByClassName('carrito-precio-total')[0].innerText =
    '$' + total.toLocaleString("es") + ",00";
}

let menuToggle = document.querySelector('.menuToggle');
let header = document.querySelector('header');

menuToggle.onclick = function () {
  header.classList.toggle('active');
}

document.querySelectorAll("header ul li a").forEach((link) => {
  const submenu = link.nextElementSibling;
  if (submenu && submenu.tagName === "UL") {
    link.addEventListener("click", (e) => {
      // si está cerrado, abrir menú y bloquear navegación
      if (!link.parentElement.classList.contains("open")) {
        e.preventDefault(); // evita que abra la página
        link.parentElement.classList.add("open");
      } 
      // si ya está abierto, entonces sí deja navegar
      else {
        link.parentElement.classList.remove("open");
      }
    });
  }
});