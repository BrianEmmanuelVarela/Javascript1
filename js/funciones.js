// FUNCION PARA GENERAR INTERFAZ DE PRODUCTOS
function productoUI(productos,id){
// EL ARRAY DE PRODUCTO GLOBALES
$(id).empty();
for (const producto of productos) {
$(id).append(` <div class="card card border-bottom "style="width: 15rem;">
<img src="${producto.img}"class="card-img-top rounded shadow p-3 mb-5 bg-white rounded "alt="..." >
<div class="card-body  ">
  <h5 class="card-title  "><strong>${producto.modelo}</strong></h5>
  <h4> ${producto.color}</h4>
      <span class="badge badge-warning"><p class="card-text">$${producto.precio}</p>  </span>
  <h6>${producto.categorias}</h6>
  <h7>${producto.marca}</h7> <br><br>
  <a href="#" id="${producto.id}" class="btn btn-dark btn-compra"  >Agregar al carrito</a>
</div>
</div>
 
 `);
 
}
$('.btn-compra').on("click", comprarProducto);
}

// FUNCION BOTON

function comprarProducto(e){
    // refresco al presionar
    e.preventDefault();
    
    // obtener id del boton presionado
    const productoID = e.target.id;
    // obtener objeto del prpducto correspondiente al ID
    const seleccionado = carrito.find(p => p.id == productoID );
    if(seleccionado == undefined){
      carrito.push(productos.find(p => p.id == productoID));
    }else{
      //SI SE ENCONTRO AGREGAR UN CANTIDAD
      seleccionado.agregarCantidad(1);
    }
  

    // GUARDAR EN STORAGE
    localStorage.setItem("CARRITO", JSON.stringify(carrito));

    // GENERAR SALIDA DEL PRODUCTO
    carritoUI(carrito);
}
//   FUNCION PARA REDENRIZAR LA INTERFAZ DEL CARRITO
function carritoUI(productos){
    
$("#cantidadCompras").html(productos.length);
$("#carritoCompras").empty();
for (const producto of productos) {
 $(`#carritoCompras`).append(registroCarrito(producto)); 
  }  
// $("#carritoCompras").append(`<option>${producto.modelo} ${producto.color}  $${producto.precio}</option>`)   }
//agregamos total
$('#carritoCompras').append(`<p id="totalCarrito" class="text-light"> $ TOTAL ${totalCarrito(productos)}</p>`);
// Agregar boton confirmar
$('#carritoCompras').append('<div id="divConfirmar" class="text-center">  <a href="#" id="btnConfirmar" class="scroll-top" title="Ir arriba"><button class="btn-dark rounded">¡COMPRAR!</button></a></div>')
//   ASOCIACION EVENTOS
$(`.btn-delete`).on(`click`,eliminarCarrito);
$(`.btn-add`).click(addCantidad);
$(`.btn-sub`).click(subCantidad);
$('#btnConfirmar').click(confirmarCompra);
}

{/* <button id="btnConfirmar" class="btn btn-dark">CONFIRMAR</button> */}

function registroCarrito(producto){
    return `<p class="border border-light rounded text-light">
               ${producto.modelo}
                  
                <span class="badge badge-warning" >  $ ${producto.precio}</span>
                
                <span class="badge badge-dark"> ${producto.cantidad}</span>
                
                <span class="badge badge-light"> $ ${producto.subtotal()}</span>
                <img src="${producto.img}" alt="">
                <a id="${producto.id}" class=" btn btn-dark my-0 my-sm-0  btn-add">+</a>
                
               <a id="${producto.id}" class="btn btn-dark my-0 my-sm-0 btn-sub">-</a> 
                <a  id="${producto.id}" class="btn btn-danger my-0 my-sm-0 btn-delete"  >x</a>
                </p>
    
   `
}
// ${producto.color}
// FUNCION ELIMINAR CARRRITO
function eliminarCarrito(e){
    console.log(e.target.id);
    // eliminar con filter
    // carrito = carrito.filter(producto => producto.id != e.target.id)
    let posicion = carrito.findIndex(p => p.id == e.target.id);
    carrito.splice(posicion, 1);
    // actualizar interfaz
carritoUI(carrito);
// GUARDAR EN STORAGE
localStorage.setItem("CARRITO", JSON.stringify(carrito));
}
//MANEJADOR PARA AGREGAR cantidad 
function addCantidad(){
    let producto = carrito.find(p => p.id == this.id);
    producto.agregarCantidad(1);
    $(this).parent().children()[1].innerHTML = producto.cantidad;
    $(this).parent().children()[2].innerHTML = producto.subtotal();
    // modificar
    $("#totalCarrito").html(`TOTAL ${totalCarrito(carrito)}`);
    //GUARDAR EN STORAGE
    localStorage.setItem("CARRITO",JSON.stringify(carrito));
  }
  //MANEJADOR PARA RESTAR CANTIDAD
  function subCantidad(){
    let producto = carrito.find(p => p.id == this.id);
    if(producto.cantidad > 1){
      producto.agregarCantidad(-1);
      //$(this).parent().children()[1].innerHTML = producto.cantidad;
      let registroUI = $(this).parent().children();
      registroUI[1].innerHTML = producto.cantidad;
      registroUI[2].innerHTML = producto.subtotal();
      // modificar total
      $("#totalCarrito").html(`TOTAL ${totalCarrito(carrito)}`);
      //GUARDAR EN STORAGE
      localStorage.setItem("CARRITO",JSON.stringify(carrito));
    }
  }
  //Filtros Categorias  y Marca(Generar filtro)
  function filtroA(lista,selector){
    $(selector).empty();
    // Recorre lista
    lista.forEach(ele => {
$(selector).append(`<option value='${ele}'>${ele}</option>`);
 })
$(selector).prepend("<option value='TODOS'>Todos los productos</option>");
  }


//FUNCION PARA OBTENER EL PRECIO TOTAL DEL CARRITO
function totalCarrito(carrito){
  console.log(carrito);
  let total = 0;
  carrito.forEach(p => total += p.subtotal());
  return total.toFixed(2);
}
//FUNCION PARA ENVIAR AL BACKEND LA ORDEN DE PROCESAMIENTO DE COMPRA
function confirmarCompra(){
  //OCULTAR EL BOTON
  $('#btnConfirmar').hide();
  //AÑADIR SPINNER
  $('#divConfirmar').append(`<div class="spinner-border text-success" role="status">
                              <span class="sr-only">Loading...</span>
                            </div>`);
  console.log("ENVIAR AL BACKEND");
  //REALIZAMOS LA PETICION POST
  //const URLPOST = '/compra.php';
  const URLPOST = 'https://jsonplaceholder.typicode.com/posts';
  //INFORMACION A ENVIAR
  const DATA   = {productos: JSON.stringify(carrito), total: totalCarrito(carrito)}
  //PETICION POST CON AJAX
  $.post(URLPOST, DATA,function(respuesta,estado){
      //console.log(respuesta);
      //console.log(estado);
      if(estado == 'success'){
        //MOSTRAMOS NOTIFICACION DE CONFIRMACIÓN (CON ANIMACIONES)
        $("#notificaciones").html(`<div class=" text-light bg-dark alert alert-sucess alert-dismissible fade show" role="alert">
                    <strong>COMPRA CONFIRMADA!</strong> Comprobante Nº ${respuesta.id}.
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                    </div>`).fadeIn().delay(2000).fadeOut('');
        //VACIAR CARRITO;
        carrito.splice(0, carrito.length);
        //SOBREESCRIBIR ALMACENADO EN STORAGE
        localStorage.setItem("CARRITO",'[]');
        //VACIAR CONTENIDO DEL MENU
        $('#carritoCompras').empty();
        //VOLVER INDICADOR A 0
        $('#cantidadCompras').html(0);
      }
  });
}