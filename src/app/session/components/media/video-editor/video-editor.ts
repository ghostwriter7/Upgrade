import { Component, effect, ElementRef, input, OnInit, signal, viewChild } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { VideoData } from '@session/components/media/video-data.interface';
import { MatSlider, MatSliderRangeThumb, MatSliderThumb } from '@angular/material/slider';

@Component({
  selector: 'app-video-editor',
  imports: [MatSlider, MatSliderRangeThumb, FormField],
  templateUrl: './video-editor.html',
  styleUrl: './video-editor.css',
})
export class VideoEditor implements OnInit {
  public data = input.required<VideoData>();
  protected readonly duration = signal(0);

  protected readonly model = signal({
    startAt: 0,
    endAt: 0,
  });
  protected readonly form = form(this.model);

  private readonly video = viewChild.required<ElementRef<HTMLVideoElement>>('video');

  constructor() {
    effect(() => {
      this.video().nativeElement.currentTime = this.form.startAt().value();
    });

    effect(() => {
      this.video().nativeElement.currentTime = this.form.endAt().value();
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
}
