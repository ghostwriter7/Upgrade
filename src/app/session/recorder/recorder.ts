import { Component, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { MatMiniFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-recorder',
  imports: [MatMiniFabButton, MatIcon],
  templateUrl: './recorder.html',
  styleUrl: './recorder.css',
})
export class Recorder implements OnInit {
  private readonly video = viewChild.required<ElementRef<HTMLVideoElement>>('video');
  private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly mediaRecorder = signal<MediaRecorder | null>(null);
  protected readonly mode = signal<'paused' | 'recording' | 'not-started' | 'finished'>('not-started');

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
        await video.pause();
        video.srcObject = null;
        video.src = videoUrl;
        await video.play();
      }

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
}
