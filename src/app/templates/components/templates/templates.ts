import { Component, inject, OnInit } from '@angular/core';
import { TemplatesList } from '../templates-list/templates-list';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-templates',
  imports: [TemplatesList, MatButton],
  templateUrl: './templates.html',
  styleUrl: './templates.css',
  host: {
    class: 'page',
  },
})
export default class Templates {



}
