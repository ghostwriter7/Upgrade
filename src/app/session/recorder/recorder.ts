import { Component, effect, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { MatFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSlider, MatSliderThumb } from '@angular/material/slider';
import { form, FormField } from '@angular/forms/signals';
import { MatDialogRef } from '@angular/material/dialog';
import { VideoFrameCapturer } from './video-frame-capturer';

@Component({
  selector: 'app-recorder',
  imports: [MatIcon, MatSlider, FormField, MatFabButton, MatSliderThumb],
  templateUrl: './recorder.html',
  styleUrl: './recorder.css',
})
export class Recorder implements OnInit {
  private readonly dialogRef = inject(MatDialogRef);
  private readonly video = viewChild.required<ElementRef<HTMLVideoElement>>('video');
  private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly mediaRecorder = signal<MediaRecorder | null>(null);
  protected readonly duration = signal(0);

  protected readonly model = signal({
    frameAt: 0,
  });
  protected readonly form = form(this.model);
  protected readonly isRecording = signal(true);

  constructor() {
    effect(() => {
      if (!this.isRecording()) {
        const value = this.form.frameAt().value();

        const video = this.video().nativeElement;
        video.currentTime = value;
      }
    });
  }

  public ngOnInit(): void {
    this.elementRef.nativeElement.requestFullscreen().then(() => this.startRecording());
  }

  protected stop(): void {
    const recorder = this.mediaRecorder();
    if (recorder) {
      this.isRecording.set(false);
      recorder.stop();
    }
  }

  protected async captureFrame(): Promise<void> {
    const capturer = new VideoFrameCapturer(this.video().nativeElement);
    const { blob, width, height } = await capturer.captureCurrentFrame();
    this.dialogRef.close({ image: blob, width, height });
  }

  private async startRecording(): Promise<void> {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const video = this.video().nativeElement;
    video.srcObject = stream;
    await video.play();
    const chunks: Blob[] = [];
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.onstop = async (e: Event) => {
      video.pause();
      this.duration.set(video.currentTime);
      const blob = new Blob(chunks, { type: 'video/webm' });
      const videoUrl = URL.createObjectURL(blob);
      video.srcObject = null;
      video.src = videoUrl;
    };

    mediaRecorder.ondataavailable = (e) => {
      chunks.push(e.data);
    };

    mediaRecorder.start();
    this.mediaRecorder.set(mediaRecorder);
  }
}
