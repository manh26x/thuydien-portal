import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'aw-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent {

  constructor() { }
  zoom = 12;

  // initial center position for the map
  lat = 20.979289285672163;
  lng = 105.78812128623159;

  markers: marker[] = [
    {
      lat: 20.977476085396646,
      lng: 105.78593260375838,
      label: 'A',
      draggable: true
    },
    {
      lat: 51.373858,
      lng: 7.215982,
      label: 'B',
      draggable: false
    },
    {
      lat: 51.723858,
      lng: 7.895982,
      label: 'C',
      draggable: true
    }
  ];

  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`);
  }

  mapClicked(evt: MouseEvent) {
    this.markers.push({
      lat: evt.x,
      lng: evt.y,
      draggable: true
    });
  }

  markerDragEnd(m: marker, $event: MouseEvent) {
    console.log('dragEnd', m, $event);
  }
}

// just an interface for type safety.
// tslint:disable-next-line:class-name
interface marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}
