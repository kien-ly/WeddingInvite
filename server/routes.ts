import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { storage } from "./storage";
import { 
  insertRsvpSchema, 
  insertWishSchema, 
  type User
} from "@shared/schema";

declare module "express-session" {
  interface SessionData {
    user: User;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup express-session
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "wedding-secret",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    })
  );

  // Setup passport for authentication
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        }
        if (user.password !== password) {
          return done(null, false, { message: "Incorrect password" });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // Authentication routes
  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.json({ message: "Login successful", user: req.user });
  });

  app.post("/api/logout", (req, res) => {
    req.logout(() => {
      res.json({ message: "Logout successful" });
    });
  });

  app.get("/api/current-user", (req, res) => {
    if (req.isAuthenticated()) {
      res.json({ loggedIn: true, user: req.user });
    } else {
      res.json({ loggedIn: false });
    }
  });

  // RSVP routes
  app.get("/api/rsvps", isAuthenticated, async (_req, res) => {
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

// Middleware to ensure user is authenticated
function isAuthenticated(req: Request, res: Response, next: Function) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}
