import { 
  users, type User, type InsertUser,
  rsvps, type Rsvp, type InsertRsvp,
  wishes, type Wish, type InsertWish
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
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
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

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

// Initialize the admin user if none exists
const initAdminUser = async () => {
  const storage = new DatabaseStorage();
  const adminUser = await storage.getUserByUsername("admin");
  
  if (!adminUser) {
    await storage.createUser({
      username: "admin",
      password: "weddingadmin2023"
    });
    console.log("Admin user created successfully");
  }
};

// Initialize the database
initAdminUser().catch(err => console.error("Failed to initialize admin user:", err));

export const storage = new DatabaseStorage();
