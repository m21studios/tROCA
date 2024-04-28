import { Component, OnInit } from '@angular/core';
import { CrudproductosService } from '../Services/crudproductos.service';

@Component({
  selector: 'app-carritodecompras',
  templateUrl: './carritodecompras.page.html',
  styleUrls: ['./carritodecompras.page.scss'],
})
export class CarritodecomprasPage implements OnInit {

  productosEnCarrito: any = [];
  idUsuario: any;
  precioTotal: any;

  constructor(
    private basedatos: CrudproductosService
  ) { }

  ngOnInit() {
    this.idUsuario = localStorage.getItem('userID');
    this.cargarProductosDelCarrito();
  }

  async cargarProductosDelCarrito(){
    this.productosEnCarrito = [];

    await this.basedatos.buscarProductosEnCarritoDeCompras(this.idUsuario).subscribe(
      (productos:any) => {
      
        this.productosEnCarrito = productos;
        //console.log("PRODUCTOS ENCONTRADOS VENDEDOR>>>>> ",this.productosEnCarrito);

        //obtengo los precios de cada item
        const obtenerPrecios = this.productosEnCarrito.map((productos:any) => productos.precio);
        //sumo los precios de cada item y obtengo el total
        this.precioTotal = obtenerPrecios.reduce((total:any, precio:any) => total + precio, 0);
        
      },
      (error:any) => {
        this.basedatos.MensajeDeVerificacion("Error al cargar los productos del Carrito");
      }
    );
  }

}
