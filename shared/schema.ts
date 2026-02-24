import { pgTable, serial, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const dummy = pgTable("dummy", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

export const insertDummySchema = createInsertSchema(dummy).omit({ id: true });
export type InsertDummy = z.infer<typeof insertDummySchema>;
export type Dummy = typeof dummy.$inferSelect;

// Domain Types for Euchre (Client-side usage)
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
