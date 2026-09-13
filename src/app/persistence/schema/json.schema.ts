import { z } from 'zod';

export const json = <T extends z.ZodType>(schema: T) =>
  z.preprocess((value) => (typeof value === 'string' ? JSON.parse(value) : value), schema);
