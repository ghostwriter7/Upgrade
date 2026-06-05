import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Recorder } from '../recorder/recorder';
import { FramePicker } from '../frame-picker/frame-picker';
import { PoseMeasureEditor } from '../pose-measure-editor/pose-measure-editor';
import { MatDialogRef } from '@angular/material/dialog';
import { MeasureProgressOutput } from '@session/components/measure-progress/measure-progress-output.interface';
import { Point } from '@domain/model/measurement.model';

@Component({
  selector: 'app-measure-progress',
  imports: [Recorder, FramePicker, PoseMeasureEditor],
  templateUrl: './measure-progress.html',
  styleUrl: './measure-progress.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeasureProgress implements OnInit {
  protected readonly activeStep = signal<'record' | 'pick-frame' | 'measure'>('record');

  protected videoData: { video: Blob; width: number; height: number } | null = null;
  protected frameData: { image: Blob; width: number; height: number } | null = null;
  private readonly elementRef = inject(ElementRef);
  private readonly dialogRef: MatDialogRef<MeasureProgress, MeasureProgressOutput> = inject(MatDialogRef);

  public ngOnInit(): void {
    if (this.elementRef.nativeElement.requestFullscreen) {
      this.elementRef.nativeElement.requestFullscreen();
    }
  }

  protected onVideoCapture($event: { video: Blob; width: number; height: number }): void {
    this.videoData = $event;
    this.activeStep.set('pick-frame');
  }

  protected onFramePick($event: { image: Blob; width: number; height: number }): void {
    this.frameData = $event;
    this.activeStep.set('measure');
  }

  protected onAngleConfirm({ points, angle }: { points: Point[]; angle: number }) {
    if (!this.frameData)
      return;

    const { image, width, height } = this.frameData;

    this.dialogRef.close({ points, angle, image, width, height });
  }
}
