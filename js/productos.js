class Producto {
  constructor( id, modelo, color, precio , img ,categorias ,cantidad,marca) {
    this.id =  parseInt (id) ;
  this.modelo = modelo.toUpperCase();
  this.color = color;
  this.precio = parseFloat(precio);
  this.img = img; 
  this.categorias = categorias;
  this.cantidad = parseInt(cantidad) ;
  this.marca = marca;

 } 
 agregarCantidad(valor){
   this.cantidad += valor;
 }
 subtotal(){
   return this.cantidad * this.precio;
 }
}
