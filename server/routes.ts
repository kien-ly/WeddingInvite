import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertRsvpSchema, 
  insertWishSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // RSVP routes
  app.get("/api/rsvps", async (_req, res) => {
    try {
      const rsvps = await storage.getAllRsvps();
      res.json(rsvps);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch RSVPs" });
    }
  });

  app.post("/api/rsvps", async (req, res) => {
    try {
      const result = insertRsvpSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid RSVP data", errors: result.error });
      }
      
      const rsvp = await storage.createRsvp(result.data);
      res.status(201).json(rsvp);
    } catch (error) {
      res.status(500).json({ message: "Failed to create RSVP" });
    }
  });

  // Wishes routes
  app.get("/api/wishes", async (_req, res) => {
    try {
      const wishes = await storage.getAllWishes();
      res.json(wishes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch wishes" });
    }
  });

  app.post("/api/wishes", async (req, res) => {
    try {
      const result = insertWishSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid wish data", errors: result.error });
      }
      
      const wish = await storage.createWish(result.data);
      res.status(201).json(wish);
    } catch (error) {
      res.status(500).json({ message: "Failed to create wish" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
