import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { Recorder } from '../recorder/recorder';
import { FramePicker } from '../frame-picker/frame-picker';
import { PoseMeasureEditor } from '../pose-measure-editor/pose-measure-editor';
import { MatDialogRef } from '@angular/material/dialog';
import { MeasureProgressOutput } from '@session/components/media/measure-progress/measure-progress-output.interface';
import { Point } from '@domain/model/measurement.model';
import { FrameData } from '@session/components/media/frame-picker/video-frame-capturer';
import { VideoEditor } from '@session/components/media/video-editor/video-editor';
import { IconButton } from '@ui/icon-button/icon-button';
import { VideoData } from '@session/components/media/video-data.interface';
import { MatMiniFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-measure-progress',
  imports: [
    Recorder,
    FramePicker,
    PoseMeasureEditor,
    VideoEditor,
    IconButton,
    MatMiniFabButton,
    MatIcon,
  ],
  templateUrl: './measure-progress.html',
  styleUrl: './measure-progress.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeasureProgress implements OnInit {
  protected readonly activeStep = signal<'record' | 'crop-video' | 'pick-frame' | 'measure'>(
    'record',
  );

  protected videoData: VideoData | null = null;
  protected frameData: FrameData | null = null;
  private readonly elementRef = inject(ElementRef);
  private readonly dialogRef: MatDialogRef<MeasureProgress, MeasureProgressOutput> =
    inject(MatDialogRef);
  private readonly framePicker = viewChild<FramePicker>('framePicker');

  public ngOnInit(): void {
    if (this.elementRef.nativeElement.requestFullscreen) {
      this.elementRef.nativeElement.requestFullscreen();
    }
  }

  protected onVideoCapture(event: VideoData): void {
    this.videoData = event;
  }

  protected onFramePick(event: { image: Blob; width: number; height: number }): void {
    this.frameData = event;
  }

  protected onAngleConfirm({ points, angle }: { points: Point[]; angle: number }) {
    if (!this.frameData) return;

    const { image, width, height } = this.frameData;

    this.dialogRef.close({ points, angle, image, width, height });
  }

  protected async saveImage(): Promise<void> {
    const { image, width, height } = await this.getFrameData();
    this.dialogRef.close({ image, width, height });
  }

  protected async measureAngles(): Promise<void> {
    this.frameData = await this.getFrameData();
    this.activeStep.set('measure');
  }

  private getFrameData(): Promise<FrameData> {
    const framePicker = this.framePicker();
    if (framePicker) {
      return framePicker.captureFrame();
    }
    throw new Error('FramePicker cannot be found');
  }

  protected goTo(step: 'crop-video' | 'pick-frame'): void {
    this.activeStep.set(step);
  }

  protected closeRecording(): void {
    this.dialogRef.close();
  }
}
