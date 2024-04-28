import { Component, OnInit, NgZone,AfterViewInit, ViewChild, ElementRef   } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
(mapboxgl as any).workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;
import { environment } from 'src/environments/environment';
import { Geolocation } from '@capacitor/geolocation';
import { LocalizaProductoService } from '../Services/localiza-producto.service';
import { CrudproductosService } from '../Services/crudproductos.service';

import { GoogleMap, Marker } from '@capacitor/google-maps';


@Component({
  selector: 'app-mapaprincipal',
  templateUrl: './mapaprincipal.page.html',
  styleUrls: ['./mapaprincipal.page.scss'],
})
export class MapaprincipalPage implements OnInit, AfterViewInit {

  //Variables para el mapa
  mapbox = (mapboxgl as typeof mapboxgl);
  map: mapboxgl.Map;
  style = `mapbox://styles/mapbox/streets-v11`;
  // Coordenadas de la localización donde queremos centrar el mapa
  latM: any; //= 43.1746;
  lngM: any; //= -2.4125;
  zoom = 5;

  //map: any;
  public lat: any;
  public lon: any;
  marcadores: any;
  usersLocations: any[] = [];
  todosLosProductos: any[] = [];
  sinProductos: boolean = false;
  mapContainer:any;
  posicionDeProductos: any = [
    {
      latitud:'',
      longitud:''
    }
  ]

  apiKey:any = environment.gmaps;
  mapRef:any;
  markers: any[] = [];
  gMap: any;
  MisMarcadores:any;



  constructor(
    private ngZone: NgZone,
    private userLocation: LocalizaProductoService,
    private baseproductos: CrudproductosService,
 
  ) {
    this.mapbox.accessToken = environment.mapToken;
   }

  ngOnInit() {
    this.EnviarPosicion();
    this.MostrarTodosLosProductosDisponibles();
    //this.AgregarMarcadores();
  }

  ngAfterViewInit(){
    this.mapRef = document.getElementById('map');
    //this.createGoogleMaps(33.6, -117.9);
  }



  async CurrentPosition(){
    let Options = {
      enableHighAccuracy:true,
    }
    
    const coordinates = await Geolocation.getCurrentPosition(Options);
    this.ngZone.run(() => {
      this.latM = coordinates.coords.latitude;
      this.lngM = coordinates.coords.longitude;
    });
  
    this.createGoogleMaps(this.latM, this.lngM);
  }

  //ENVIAR POSICION
  EnviarPosicion(){
    setInterval(() => {     
      this.userLocation.sendLocation().then(() =>{
        console.log("Se envio la posicion del Usuario");
      },(err) =>{
        console.log("No se pudo enviar la posicion: ",err);
      })
    }, 1 * 60 * 1000); // 30 minutos * 60 segundos * 1000 milisegundos
  }


  public MostrarTodosLosProductosDisponibles(){
    this.todosLosProductos = [];
    this.baseproductos.obtenerTodosLosProductos().subscribe(
      (productos:any) => {

        if(productos.length == 0){
          this.sinProductos = true;
          this.CurrentPosition();
          return;
        }else{
          this.todosLosProductos = productos;
          //console.log("Productos: ",this.todosLosProductos);
          const coordenadas = this.todosLosProductos.map((posicion:any) => ({
            latitude: posicion.latitude,
            longitude: posicion.longitude,
            title: posicion.nombre
          }));

          this.MisMarcadores = coordenadas;
          //this.AgregarMarcadores(this.MisMarcadores.title,this.MisMarcadores.latitude,this.MisMarcadores.longitude);

          console.log("Cooodenadas: ",this.MisMarcadores);
          this.CurrentPosition();
          this.sinProductos = false;
          //this.AgregarMarcadores();
        }
      },
      (error:any) => {
        //this.baseproductos.MensajeDeVerificacion("Error al cargar los productos");
      }
    );
  }

  createGoogleMaps(lat:any, lon: any){
    this.gMap = GoogleMap.create({
      id: 'my-map', // Unique identifier for this map instance
      element: this.mapRef, // reference to the capacitor-google-map element
      apiKey: this.apiKey, // Your Google Maps API Key
      config: {
        center: {
          // The initial position to be rendered by the map
          lat: lat,
          lng: lon,
        },
        zoom: 13, // The initial zoom level to be rendered by the map
      },
    });

    //this.MisMarcadores.forEach((val:any) =>{
      this.addMarker(lat, lon);
    //})
    
    //this.MisMarcadores.map((val:any) =>{
      //console.log("VALORES: ",val.latitude);
      //this.AgregarMarcadores(val.latitude, val.coordinate.longitude);
    //})
  }
  
  

  addMarker(latitude:any, longitude:any){
    this.gMap.addMarker({
      coordinate:{
        lat:latitude,
        lng:longitude
      }
    })
    //let marker = new google.maps.marker.AdvancedMarkerView({
      //map: map,
      //animation: google.maps.Animation.DROP,
      //position: {
        //lat:latitude,
        //lng: longitude
      //}
    //});

  }




}
