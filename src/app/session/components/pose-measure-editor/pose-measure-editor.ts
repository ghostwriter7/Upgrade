import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
function calculateAngle(a: DOMPoint, b: DOMPoint, c: DOMPoint): number {
  const ab = {
    x: a.x - b.x,
    y: a.y - b.y,
  };

  const cb = {
    x: c.x - b.x,
    y: c.y - b.y,
  };

  const dot = ab.x * cb.x + ab.y * cb.y;

  const magAB = Math.hypot(ab.x, ab.y);
  const magCB = Math.hypot(cb.x, cb.y);

  const angle = Math.acos(dot / (magAB * magCB));

  return (angle * 180) / Math.PI;
}

@Component({
  selector: 'app-pose-measure-editor',
  imports: [],
  templateUrl: './pose-measure-editor.html',
  styleUrl: './pose-measure-editor.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PoseMeasureEditor  {
  public data = input.required<{ image: Blob; width: number; height: number }>();

  private readonly svgEl = viewChild.required<ElementRef<SVGSVGElement>>('svg');
  protected readonly points = signal<DOMPoint[]>([]);
  protected readonly lines = computed(() => {
    const points = this.points();
    if (points.length < 2) return [];

    const [startPoint, midPoint, endPoint] = points;

    if (!endPoint) return [[startPoint, midPoint]];

    return [
      [startPoint, midPoint],
      [midPoint, endPoint],
    ];
  });
  protected readonly href = computed(() => URL.createObjectURL(this.data().image))

  protected readonly angle = computed(() => {
    const points = this.points();

    if (points.length === 3) {
      return calculateAngle(points[0], points[1], points[2]);
    }

    return null;
  });

  protected handleClick(event: PointerEvent): void {
    const svg = this.svgEl().nativeElement;

    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;

    const transformed = point.matrixTransform(svg.getScreenCTM()?.inverse());
    this.points.update((points) => [...points, transformed]);
  }
}
