import { 
  users, type User, type InsertUser,
  rsvps, type Rsvp, type InsertRsvp,
  wishes, type Wish, type InsertWish
} from "@shared/schema";

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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private rsvps: Map<number, Rsvp>;
  private wishes: Map<number, Wish>;
  
  private userId: number;
  private rsvpId: number;
  private wishId: number;

  constructor() {
    this.users = new Map();
    this.rsvps = new Map();
    this.wishes = new Map();
    
    this.userId = 1;
    this.rsvpId = 1;
    this.wishId = 1;
    
    // Create default admin user
    this.createUser({
      username: "admin",
      password: "weddingadmin2023"
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const createdAt = new Date();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // RSVP methods
  async getAllRsvps(): Promise<Rsvp[]> {
    return Array.from(this.rsvps.values()).sort((a, b) => {
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });
  }

  async getRsvp(id: number): Promise<Rsvp | undefined> {
    return this.rsvps.get(id);
  }

  async createRsvp(insertRsvp: InsertRsvp): Promise<Rsvp> {
    const id = this.rsvpId++;
    const createdAt = new Date();
    const rsvp: Rsvp = { ...insertRsvp, id, createdAt };
    this.rsvps.set(id, rsvp);
    return rsvp;
  }

  // Wish methods
  async getAllWishes(): Promise<Wish[]> {
    return Array.from(this.wishes.values()).sort((a, b) => {
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });
  }

  async getWish(id: number): Promise<Wish | undefined> {
    return this.wishes.get(id);
  }

  async createWish(insertWish: InsertWish): Promise<Wish> {
    const id = this.wishId++;
    const createdAt = new Date();
    const wish: Wish = { ...insertWish, id, createdAt };
    this.wishes.set(id, wish);
    return wish;
  }
}

export const storage = new MemStorage();
