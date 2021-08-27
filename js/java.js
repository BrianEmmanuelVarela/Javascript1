// READY
$(document).ready(function(){
   

// OBTENER INFORMACION EN EL STORAGE
if("CARRITO" in localStorage){
    const datoGuardados = JSON.parse (localStorage.getItem("CARRITO"));
    for (const literal of datoGuardados) {
        carrito.push( new Producto (literal.id, literal.modelo,literal.color,literal.precio ,literal.img,literal.categorias,literal.cantidad));
        
    }
    console.log(carrito);
    carritoUI(carrito);
 }
 $(".dropdown-menu").click(function(e) {
     e.stopPropagation();
// peticion

    console.log(productos);
   

 });
 productoUI(productos, "#productoC"); 
    $.get("data/producto.json",function(datos, estado){
        console.log(datos);
        console.log(estado);
        if(estado == 'success'){
            for (const literal of datos) {
                productos.push(new Producto(literal.id, literal.modelo,literal.color ,literal.precio , literal.img, literal.categorias,literal.cantidad, literal.marca));
            }
        }

    console.log(productos);
    productoUI(productos,"#productoC");
})

});

//FUNCION QUE SE EJECUTA CUANDO SE CARGA TODA LAS IMAGENES DE LA APLICACION
window.addEventListener('load',()=>{
    //ELIMINAR ELEMENTO DEL DOM
    $('#indicadorCarga').remove();

// Animacion de img,iframe,videos

$("#productoC").fadeOut("fast");
$("#productoC").fadeIn("slow");

$("#anima1").fadeOut("fast");
$("#anima1").fadeIn("slow");

$("#anima2").fadeOut("fast");
$("#anima2").fadeIn("slow");
})

$('a').click(function(e){
    e.preventDefault();
    $('html,body').animate({
        scrollTop: $(".particles-js").offset().top
        } ,100);
      
  });
// Genera FiltroA
filtroA(categorias,"#filtroA");
// EVENTO
$("#filtroA").change(function (e){
const value = this.value;
   $("#productoC").fadeOut(600,function(){

        
    if(value == "TODOS"){
    productoUI(productos, "#productoC");    
    } else{
         const filtrados1 = productos.filter( p => p.categorias == value);
         productoUI(filtrados1, "#productoC");
        }
        $('#productoC').fadeIn();
   
   
    });

});
    //DEFINIR EVENTOS SOBRE EL INPUT DE BUSCADA -> USA keyup cuando la tecla se suelta
$("#busquedaProducto").keyup(function (e) { 
    const criterio = this.value.toUpperCase();
    console.log(criterio);
    if(criterio != ""){
                                                        //el resulado de esto es verdadero
        const encontrados = productos.filter(p =>       p.modelo.includes(criterio.toUpperCase()) 
                                                    || p.categorias.includes(criterio.toUpperCase()));
        productoUI(encontrados, "#productoC");
    }
});

//DEFINIR EVENTOS SOMBRE EL INPUT DE FILTRO DE PRECIO
$(".inputPrecio").change(function (e) { 
    const min = $("#minProducto").val();
    const max = $("#maxProducto").val();
    if((min > 0) && (max > 0)){
                                                 //el resulado de esto es verdadero
        const encontrados = productos.filter(p => p.precio >= min && p.precio <= max);
        productoUI(encontrados, "#productoC");
    }
});
