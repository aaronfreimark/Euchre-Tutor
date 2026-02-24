import { db } from "./db";
import { dummy, type InsertDummy, type Dummy } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getDummies(): Promise<Dummy[]>;
}

export class DatabaseStorage implements IStorage {
  async getDummies(): Promise<Dummy[]> {
    return await db.select().from(dummy);
  }
}

export const storage = new DatabaseStorage();
