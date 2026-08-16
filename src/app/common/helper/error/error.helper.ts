export class ErrorHelper {
  public static getMessage(error: unknown): string {
    if (typeof error === 'string') return error;

    if (error instanceof Error) {
      return error.message;
    }

    return 'Unknown Error';
  }
}
