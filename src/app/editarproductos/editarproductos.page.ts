import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { CrudproductosService } from '../Services/crudproductos.service';
import { Geolocation } from '@capacitor/geolocation';
import Producto from 'src/Models/Producto';

@Component({
  selector: 'app-editarproductos',
  templateUrl: './editarproductos.page.html',
  styleUrls: ['./editarproductos.page.scss'],
})
export class EditarproductosPage implements OnInit {

  //Variables
  productoActual: any;
  _idProducto: any;

  latM: any; //= 43.1746;
  lngM: any; //= -2.4125;

  productoEncontrado: Producto = {
    nombre:'',
    descripcionCorta:'',
    descripcionLarga:'', 
    categoria:'',
    precio:0,
    cantidadDisponible:0,
    idVendedor:'',
    fechaCreacion:'',
    imagenes:{},
    video:{},
    uuid:'',
    ciudad:'',
    direccion:'',
    latitude:'',
    longitude:''
  };

  imagenProductoPrincipal: any;
  todaslasimagenes: any = [];

  constructor(
    public rutaActual: ActivatedRoute,
    public route: Router,
    private basededatos: CrudproductosService,
  ) { }

  ngOnInit() {
    this.productoActual = this.rutaActual.snapshot.paramMap.get('nombreProducto');
    this._idProducto = this.rutaActual.snapshot.paramMap.get('idProducto');
    this.CargarLaInformacionDelProducto(this._idProducto);
    this.CurrentPosition();
  }

  CargarLaInformacionDelProducto(producto: any){
    this.basededatos.obtenerProductoPorUuid(producto).subscribe((resp:any) => {
      this.productoEncontrado = resp;
    },(error:any) =>{
      this.basededatos.MensajeDeVerificacion("Error al cargar la Informacion del Producto");
    })
  }

  Actaulizarproducto(){
    this.basededatos.actualizarProducto(this.productoEncontrado.uuid, this.productoEncontrado)
    .then((res:any) =>{
      this.basededatos.MensajeDeVerificacion("Se ha Guardado los datos correctamente.");
    }).catch(() =>{
      this.basededatos.MensajeDeVerificacion("Error al guardar la informacion.");
    })
  }

  async CurrentPosition(){
    let Options = {
      enableHighAccuracy:true,

    }
    const coordinates = await Geolocation.getCurrentPosition(Options);
    this.latM = coordinates.coords.latitude;
    this.lngM = coordinates.coords.longitude;
    this.productoEncontrado.latitude = this.latM
    this.productoEncontrado.longitude = this.lngM
  }

}
