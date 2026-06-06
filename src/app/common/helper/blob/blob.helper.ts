export class BlobHelper {
  public static async toBase64(blob: Blob): Promise<string> {
    const buffer = await blob.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const binary = String.fromCodePoint(...bytes);
    return btoa(binary);
  }

  public static toBlob(base64: string, mimeType: string): Blob {
    const binary = atob(base64);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0)!);
    return new Blob([bytes], { type: mimeType });
  }
}
