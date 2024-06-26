import { Component, OnInit } from '@angular/core';
import { CrudproductosService } from '../Services/crudproductos.service';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
})
export class HistorialPage implements OnInit {

  productosEnHistorial: any = [];
  idvendedor: any;

  constructor(
    private basedatos: CrudproductosService
  ) { }

  ngOnInit() {
    this.idvendedor = localStorage.getItem('userID');
    this.cargarProductosDelCarrito();
  }

  async cargarProductosDelCarrito(){
    this.productosEnHistorial = [];
    await this.basedatos.buscarProductosEnHistorialDeCompras(this.idvendedor).subscribe(
      (productos:any) => {
        this.productosEnHistorial = productos;
      },
      (error:any) => {
        this.basedatos.MensajeDeVerificacion("Error al cargar los productos");
      }
    );
  }

}
