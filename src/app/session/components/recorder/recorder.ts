import { Component, ElementRef, OnInit, output, signal, viewChild } from '@angular/core';
import { MatFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Timer } from '@session/components/timer/timer';

@Component({
  selector: 'app-recorder',
  imports: [MatIcon, MatFabButton, Timer],
  templateUrl: './recorder.html',
  styleUrl: './recorder.css',
})
export class Recorder implements OnInit {
  public videoCapture = output<{ video: Blob; width: number; height: number }>();

  private readonly video = viewChild.required<ElementRef<HTMLVideoElement>>('video');
  private readonly mediaRecorder = signal<MediaRecorder | null>(null);

  protected readonly isRecording = signal(false);

  public ngOnInit(): void {
    this.setupRecorder();
  }

  protected toggleRecording(): void {
    if (this.isRecording()) {
      this.mediaRecorder()?.stop();
    } else {
      this.mediaRecorder()?.start();
    }
    this.isRecording.update((value) => !value);
  }

  private async setupRecorder(): Promise<void> {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const video = this.video().nativeElement;
    video.srcObject = stream;
    await video.play();
    const chunks: Blob[] = [];
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.onstop = async (e: Event) => {
      video.pause();
      const blob = new Blob(chunks, { type: 'video/webm' });
      this.videoCapture.emit({ video: blob, width: video.videoWidth, height: video.videoHeight });
    };

    mediaRecorder.ondataavailable = (e) => {
      chunks.push(e.data);
    };

    this.mediaRecorder.set(mediaRecorder);
  }
}
