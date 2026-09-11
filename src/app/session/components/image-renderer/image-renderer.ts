import { Component, computed, ElementRef, input, viewChild } from '@angular/core';
import { Point } from '@domain/model/measurement.model';
import { Line } from '@domain/model/line.model';

@Component({
  selector: 'app-image-renderer',
  templateUrl: './image-renderer.html',
  styleUrl: './image-renderer.css',
  host: {
    style: 'display: contents;',
  },
})
export class ImageRenderer {
  public image = input.required<string, Blob | string>({
    transform: (image: Blob | string) =>
      typeof image === 'string' ? image : URL.createObjectURL(image),
  });
  public width = input.required<number>();
  public height = input.required<number>();
  public points = input<Point[]>([]);
  public lines = input<Line[]>([]);
  public readonly svgEl = viewChild.required<ElementRef<SVGSVGElement>>('svg');

  protected readonly viewBox = computed(() => `0 0 ${this.width()} ${this.height()}`);
}
