import { Component, OnInit } from '@angular/core';
import { CrudproductosService } from '../Services/crudproductos.service';

@Component({
  selector: 'app-misproductos',
  templateUrl: './misproductos.page.html',
  styleUrls: ['./misproductos.page.scss'],
})
export class MisproductosPage implements OnInit {

  idvendedor: any;
  productosEncontrados: any[] = [];

  constructor(
    private baseproductos: CrudproductosService
  ) { 
    this.idvendedor = localStorage.getItem('userID');
  }

  ngOnInit() {
    this.CargarMisProductos();
  }

  CargarMisProductos(){
    this.productosEncontrados = [];
    this.baseproductos.buscarProductosPorIdDelVendedor(this.idvendedor).subscribe(
      (productos:any) => {
        this.productosEncontrados = productos;
      },
      (error:any) => {
        this.baseproductos.MensajeDeVerificacion("Error al cargar tus productos");
      }
    );
  }

}
