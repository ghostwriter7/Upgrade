import * as z from 'zod';

export const IdSchema = z.union([z.uuid(), z.nanoid()])
