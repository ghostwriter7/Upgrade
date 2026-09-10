import { Component } from '@angular/core';

@Component({
  selector: 'app-lozenge',
  templateUrl: './lozenge.html',
  styleUrl: './lozenge.css',
  host: {
    style: 'display: contents;',
  },
})
export class Lozenge {}
