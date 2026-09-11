export type SqlResponse =
  | {
      id: string;
      type: 'success';
      result: unknown;
    }
  | {
      id: string;
      type: 'error';
      error: {
        message: string;
      };
    };
