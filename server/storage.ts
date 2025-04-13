import { 
  rsvps, type Rsvp, type InsertRsvp,
  wishes, type Wish, type InsertWish
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // RSVP methods
  getAllRsvps(): Promise<Rsvp[]>;
  getRsvp(id: number): Promise<Rsvp | undefined>;
  createRsvp(rsvp: InsertRsvp): Promise<Rsvp>;
  
  // Wish methods
  getAllWishes(): Promise<Wish[]>;
  getWish(id: number): Promise<Wish | undefined>;
  createWish(wish: InsertWish): Promise<Wish>;
}

export class DatabaseStorage implements IStorage {
  // RSVP methods
  async getAllRsvps(): Promise<Rsvp[]> {
    return await db.select().from(rsvps).orderBy(desc(rsvps.createdAt));
  }

  async getRsvp(id: number): Promise<Rsvp | undefined> {
    const [rsvp] = await db.select().from(rsvps).where(eq(rsvps.id, id));
    return rsvp || undefined;
  }

  async createRsvp(insertRsvp: InsertRsvp): Promise<Rsvp> {
    const [rsvp] = await db.insert(rsvps).values({
      ...insertRsvp,
      createdAt: new Date()
    }).returning();
    return rsvp;
  }

  // Wish methods
  async getAllWishes(): Promise<Wish[]> {
    return await db.select().from(wishes).orderBy(desc(wishes.createdAt));
  }

  async getWish(id: number): Promise<Wish | undefined> {
    const [wish] = await db.select().from(wishes).where(eq(wishes.id, id));
    return wish || undefined;
  }

  async createWish(insertWish: InsertWish): Promise<Wish> {
    const [wish] = await db.insert(wishes).values({
      ...insertWish,
      createdAt: new Date()
    }).returning();
    return wish;
  }
}

// Using PostgreSQL storage exclusively
console.log('Using PostgreSQL storage');
export const storage = new DatabaseStorage();
