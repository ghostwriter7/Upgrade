import { Component, computed, effect, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { MatButton, MatFabButton, MatMiniFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSlider, MatSliderRangeThumb } from '@angular/material/slider';
import { pad } from '../../common/function/pad-time.function';
import { form, FormField } from '@angular/forms/signals';

@Component({
  selector: 'app-recorder',
  imports: [
    MatMiniFabButton,
    MatIcon,
    MatSlider,
    FormField,
    MatSliderRangeThumb,
    MatFabButton,
  ],
  templateUrl: './recorder.html',
  styleUrl: './recorder.css',
})
export class Recorder implements OnInit {
  private readonly video = viewChild.required<ElementRef<HTMLVideoElement>>('video');
  private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly mediaRecorder = signal<MediaRecorder | null>(null);
  protected readonly mode = signal<'paused' | 'recording' | 'not-started' | 'finished'>(
    'not-started',
  );
  protected readonly startTime = computed(() => {
    const { startTime } = this.model();
    const { minutes, seconds, milliseconds } = Temporal.Duration.from({
      milliseconds: Math.floor(startTime * 1000),
    }).round({ largestUnit: 'minute' });
    const twoDigitMilliseconds = milliseconds.toString().slice(0, 2).padStart(2, '0');
    return `${pad(minutes)}:${pad(seconds)}:${twoDigitMilliseconds}`;
  });
  protected readonly finishTime = computed(() => {
    const { endTime } = this.model();
    const { minutes, seconds, milliseconds } = Temporal.Duration.from({
      milliseconds: Math.floor(endTime * 1000),
    }).round({ largestUnit: 'minute' });
    const twoDigitMilliseconds = milliseconds.toString().slice(0, 2).padStart(2, '0');
    return `${pad(minutes)}:${pad(seconds)}:${twoDigitMilliseconds}`;
  });
  protected readonly duration = signal(0);

  protected readonly model = signal({
    startTime: 0,
    endTime: 0,
  });
  protected readonly form = form(this.model);

  constructor() {
    effect(() => {
      if (this.mode() === 'finished') {
        const value = this.form.endTime().value();

        const video = this.video().nativeElement;
        video.currentTime = value;
      }
    });

    effect(() => {
      if (this.mode() === 'finished') {
        const value = this.form.startTime().value();

        const video = this.video().nativeElement;
        video.currentTime = value;
      }
    });
  }

  public ngOnInit(): void {
    this.elementRef.nativeElement.requestFullscreen().then(async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = this.video().nativeElement;
      video.srcObject = stream;
      await video.play();

      const chunks: Blob[] = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.onstop = async (e: Event) => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const videoUrl = URL.createObjectURL(blob);
        video.pause();
        video.srcObject = null;
        video.src = videoUrl;
        await video.play();
        const { duration } = video;
        this.duration.set(duration);
        this.model.update((model) => ({ ...model, endTime: duration }));
      };

      mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      this.mediaRecorder.set(mediaRecorder);
    });
  }

  protected async record(): Promise<void> {
    const recorder = this.mediaRecorder();
    if (recorder) {
      this.mode.set('recording');
      recorder.start();
    }
  }

  protected pause(): void {
    const recorder = this.mediaRecorder();
    if (recorder) {
      this.mode.set('paused');
      recorder.pause();
    }
  }

  protected stop(): void {
    const recorder = this.mediaRecorder();
    if (recorder) {
      this.mode.set('finished');
      recorder.stop();
    }
  }

  protected resume(): void {
    const recorder = this.mediaRecorder();
    if (recorder) {
      this.mode.set('recording');
      recorder.resume();
    }
  }

  protected save(): void {}

  protected replay(): void {
    const video = this.video().nativeElement;
    video.currentTime = this.form.startTime().value();
    video.play();
  }
}
