import { BlobHelper } from '@common/helper/blob/blob.helper';

describe('BlobHelper', () => {

  it('should convert Base64 to Blob', async () => {
    const base64 = 'aGVsbG8=';
    const mimeType = 'text/plain';
    const expectedBlob = new Blob(['hello']);
    const expectedArrayBuffer = await expectedBlob.arrayBuffer();
    const expectedSize = expectedBlob.size;

    const blob = BlobHelper.toBlob(base64, mimeType);

    expect(blob).toBeDefined();
    expect(blob.type).toBe(mimeType);
    expect(blob.size).toBe(expectedSize);
    await expect(blob.arrayBuffer()).resolves.toEqual(expectedArrayBuffer);
  });

  it('should convert Blob to Base64', async () => {
    const blob = new Blob(['hello'], { type: 'text/plain' });

    const base64 = await BlobHelper.toBase64(blob);

    expect(base64).toEqual('aGVsbG8=');
  })
});
