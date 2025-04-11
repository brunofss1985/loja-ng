// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-map',
//   templateUrl: './map.component.html',
//   styleUrls: ['./map.component.scss']
// })
// export class MapComponent {
//   zoom = 12;
//   center: google.maps.LatLngLiteral = { lat: -22.945916, lng: -43.384208 }; // , 
//   markerPositions: google.maps.LatLngLiteral[] = [];

//   mapClick(event: google.maps.MapMouseEvent) {
//     if (event.latLng) {
//       const lat = event.latLng.lat();
//       const lng = event.latLng.lng();
//       console.log('Clicado em:', lat, lng);

//       this.markerPositions.push({ lat, lng });
//     } else {
//       console.warn('latLng está nulo');
//     }
//   }
// }
