import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  input,
  OnInit,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { MatFabButton } from '@angular/material/button';
import { MatSlider, MatSliderThumb } from '@angular/material/slider';
import { form, FormField } from '@angular/forms/signals';
import { VideoFrameCapturer } from '../recorder/video-frame-capturer';

@Component({
  selector: 'app-frame-picker',
  imports: [MatSlider, MatFabButton, FormField, MatSliderThumb],
  templateUrl: './frame-picker.html',
  styleUrl: './frame-picker.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FramePicker implements OnInit {
  public data = input.required<{ video: Blob; width: number; height: number }>();
  public framePick = output<{ image: Blob; width: number; height: number }>();
  protected readonly duration = signal(0);

  protected readonly model = signal({
    frameAt: 0,
  });
  protected readonly form = form(this.model);

  private readonly video = viewChild.required<ElementRef<HTMLVideoElement>>('video');

  constructor() {
    effect(() => {
      const value = this.form.frameAt().value();

      const video = this.video().nativeElement;
      video.currentTime = value;
    });
  }

  public ngOnInit(): void {
    const videoEl = this.video().nativeElement;
    const data = this.data();
    videoEl.src = URL.createObjectURL(data.video);
    videoEl.load();
    videoEl.addEventListener('durationchange', () => this.duration.set(videoEl.duration), {
      once: true,
    });
  }

  protected async captureFrame(): Promise<void> {
    const capturer = new VideoFrameCapturer(this.video().nativeElement);
    const { blob, width, height } = await capturer.captureCurrentFrame();
    this.framePick.emit({ image: blob, width, height });
  }
}
