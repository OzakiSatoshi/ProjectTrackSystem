import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAnkenSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all anken
  app.get("/api/anken", async (req, res) => {
    try {
      const { search, status } = req.query;
      let result;
      
      if (search || status) {
        const statusCode = status ? parseInt(status as string) : undefined;
        result = await storage.searchAnken(search as string || "", statusCode);
      } else {
        result = await storage.getAllAnken();
      }
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  // Get anken by ID
  app.get("/api/anken/:id", async (req, res) => {
    try {
      const anken = await storage.getAnken(req.params.id);
      if (!anken) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(anken);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  // Create new anken
  app.post("/api/anken", async (req, res) => {
    try {
      const validatedData = insertAnkenSchema.parse(req.body);
      const newAnken = await storage.createAnken(validatedData);
      res.status(201).json(newAnken);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  // Update anken
  app.put("/api/anken/:id", async (req, res) => {
    try {
      const validatedData = insertAnkenSchema.partial().parse(req.body);
      const updatedAnken = await storage.updateAnken(req.params.id, validatedData);
      if (!updatedAnken) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(updatedAnken);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update project" });
    }
  });

  // Delete anken
  app.delete("/api/anken/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteAnken(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json({ message: "Project deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  // Get dashboard stats
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getAnkenStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
