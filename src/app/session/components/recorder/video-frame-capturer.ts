export class VideoFrameCapturer {
  private static readonly MAX_WIDTH = 1280;

  constructor(private readonly video: HTMLVideoElement) {}

  public async captureCurrentFrame(): Promise<{ blob: Blob, width: number, height: number }> {
    const { videoWidth, videoHeight } = this.video;

    const scale = Math.min(1, this.video.videoWidth / VideoFrameCapturer.MAX_WIDTH);
    const width = videoWidth * scale;
    const height = videoHeight * scale;

    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext('2d');

    if (!ctx) throw new Error('Failed to get 2D context for canvas');

    ctx.drawImage(this.video, 0, 0, width, height);
    const blob = await canvas.convertToBlob({ type: 'image/jpeg', quality: 0.9 });
    return { blob, width, height };
  }
}
