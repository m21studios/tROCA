import { Component, OnInit } from '@angular/core';
import { CrudproductosService } from '../Services/crudproductos.service';

@Component({
  selector: 'app-mensajes',
  templateUrl: './mensajes.page.html',
  styleUrls: ['./mensajes.page.scss'],
})
export class MensajesPage implements OnInit {
  user: any;
  Usuarios: any = []
  constructor(
    public usuarios: CrudproductosService
  ) { }

  ngOnInit() {
    this.user = localStorage.getItem('userID');
    this.cargarListaDeUsuariosConMensajes();
  }

  cargarListaDeUsuariosConMensajes(){
    this.usuarios.obtenerTodosLosUsariosChat(this.user).subscribe(
      (misusuarios:any) => {
        this.Usuarios = misusuarios;
      },
      (error:any) => {
        this.usuarios.MensajeDeVerificacion("Error al cargar los productos");
      }
    );
  }

}
