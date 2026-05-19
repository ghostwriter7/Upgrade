import { Component, ElementRef, viewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialogActions, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';

@Component({
  selector: 'app-recorder',
  imports: [MatButton, MatDialogActions, MatDialogContent, MatDialogTitle],
  templateUrl: './recorder.html',
  styleUrl: './recorder.css',
})
export class Recorder {
  private readonly video = viewChild.required<ElementRef<HTMLVideoElement>>('video');

  protected async record(): Promise<void> {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const video = this.video().nativeElement;
    video.srcObject = stream;
    await video.play();
  }
}
