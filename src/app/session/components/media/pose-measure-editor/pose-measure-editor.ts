import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { MatMiniFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Point } from '@domain/model/measurement.model';
import { Lozenge } from '@ui/lozenge/lozenge';
import { ImageRenderer } from '@session/components/image-renderer/image-renderer';
import { Line } from '@domain/model/line.model';

function calculateAngle(a: Point, b: Point, c: Point): number {
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

  return Math.round((angle * 180) / Math.PI);
}

@Component({
  selector: 'app-pose-measure-editor',
  imports: [MatMiniFabButton, MatIcon, Lozenge, ImageRenderer],
  templateUrl: './pose-measure-editor.html',
  styleUrl: './pose-measure-editor.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PoseMeasureEditor {
  public data = input.required<{ image: Blob; width: number; height: number }>();
  public angleConfirm = output<{
    points: Point[];
    angle: number;
  }>();

  private readonly imageRenderer = viewChild.required<ImageRenderer>('imageRenderer');
  private readonly svgEl = computed(() => this.imageRenderer().svgEl());
  protected readonly points = signal<Point[]>([]);
  protected readonly lines = computed(() => {
    const points = this.points();
    if (points.length < 2) return [];

    const [startPoint, midPoint, endPoint] = points;

    if (!endPoint) return [new Line(startPoint, midPoint)];

    return [
      new Line(startPoint, midPoint),
      new Line(midPoint, endPoint),
    ];
  });
  protected readonly href = computed(() => URL.createObjectURL(this.data().image));
  protected readonly viewBox = computed(() => `0 0 ${this.data().width} ${this.data().height}`);

  protected readonly angle = computed(() => {
    const points = this.points();

    if (points.length === 3) {
      return calculateAngle(points[0], points[1], points[2]);
    }

    return null;
  });
  protected readonly allPointsCaptured = computed(() => this.points().length === 3);

  protected handleClick(event: PointerEvent): void {
    const svg = this.svgEl().nativeElement;

    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;

    const transformed = point.matrixTransform(svg.getScreenCTM()?.inverse());
    const model = new Point(transformed.x, transformed.y);
    this.points.update((points) => [...points, model]);
  }

  protected undo(): void {
    this.points.update((points) => points.slice(0, -1));
  }

  protected clearAll(): void {
    this.points.set([]);
  }

  protected save(): void {
    const points = this.points();
    const angle = this.angle();

    if (points.length !== 3 || angle === null) return;

    const { width, height } = this.data();

    this.angleConfirm.emit({ points: points.map((p) => p.normalized(width, height)), angle });
  }
}
