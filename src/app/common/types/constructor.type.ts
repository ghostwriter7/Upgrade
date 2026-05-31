export type Constructor<B, T extends B = B> = new (...args: any[]) => T;
