export class VideoFrameCapturer {
  private static readonly MAX_WIDTH = 1280;

  constructor(private readonly video: HTMLVideoElement) {}

  public async captureCurrentFrame(): Promise<{ blob: Blob; width: number; height: number }> {
    const { videoWidth, videoHeight } = this.video;

    const canvas = new OffscreenCanvas(videoWidth, videoHeight);
    const ctx = canvas.getContext('2d');

    if (!ctx) throw new Error('Failed to get 2D context for canvas');

    ctx.drawImage(this.video, 0, 0, videoWidth, videoHeight);
    const blob = await canvas.convertToBlob({ type: 'image/jpeg', quality: 1 });
    return { blob, width: videoWidth, height: videoHeight };
  }
}
