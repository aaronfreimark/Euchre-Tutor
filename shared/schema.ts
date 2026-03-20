import { z } from "zod";

export const SuitSchema = z.enum(["Hearts", "Diamonds", "Clubs", "Spades"]);
export type Suit = z.infer<typeof SuitSchema>;

export const CardSchema = z.object({
  id: z.string(),
  suit: SuitSchema,
  rank: z.string(),
  name: z.string(),
  isTrump: z.boolean(),
  isBower: z.boolean(),
  description: z.string().optional()
});
export type Card = z.infer<typeof CardSchema>;
