import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get predictions for a specific season
  app.get("/api/predictions/:season", async (req, res) => {
    try {
      const { season } = req.params;
      const predictions = await storage.getPredictionsBySeason(season);
      res.json(predictions);
    } catch (error) {
      console.error("Error fetching predictions:", error);
      res.status(500).json({ message: "Failed to fetch predictions" });
    }
  });

  // Get all available seasons
  app.get("/api/seasons", async (req, res) => {
    try {
      const seasons = await storage.getAvailableSeasons();
      res.json(seasons);
    } catch (error) {
      console.error("Error fetching seasons:", error);
      res.status(500).json({ message: "Failed to fetch seasons" });
    }
  });

  // Get feature importance data
  app.get("/api/feature-importance", async (req, res) => {
    try {
      const features = await storage.getFeatureImportance();
      res.json(features);
    } catch (error) {
      console.error("Error fetching feature importance:", error);
      res.status(500).json({ message: "Failed to fetch feature importance" });
    }
  });

  // Get model metrics
  app.get("/api/model-metrics", async (req, res) => {
    try {
      const metrics = await storage.getModelMetrics();
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching model metrics:", error);
      res.status(500).json({ message: "Failed to fetch model metrics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}