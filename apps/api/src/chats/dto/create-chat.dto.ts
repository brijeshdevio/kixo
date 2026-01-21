import { z } from 'zod';

export const CreateChatSchema = z
  .object({
    title: z.string().min(3, 'Title must be at least 3 characters').default("New Chat"),
  })
  .strict();

export type CreateChatDto = z.infer<typeof CreateChatSchema>;
