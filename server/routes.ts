import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertGradeSubmissionSchema, gradesDataSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Get grades by session ID
  app.get("/api/grades/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const submission = await storage.getGradeSubmissionBySessionId(sessionId);
      
      if (!submission) {
        return res.json(null);
      }

      res.json({
        grades: submission.grades,
        finalAverage: submission.finalAverage,
      });
    } catch (error) {
      console.error("Error fetching grades:", error);
      res.status(500).json({ error: "Failed to fetch grades" });
    }
  });

  // Save or update grades
  app.post("/api/grades", async (req, res) => {
    try {
      const bodySchema = z.object({
        sessionId: z.string(),
        grades: gradesDataSchema,
        finalAverage: z.number().nullable(),
      });

      const parsed = bodySchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.message });
      }

      const { sessionId, grades, finalAverage } = parsed.data;

      // Check if submission exists
      const existing = await storage.getGradeSubmissionBySessionId(sessionId);

      if (existing) {
        // Update existing submission
        const updated = await storage.updateGradeSubmission(sessionId, grades, finalAverage);
        return res.json(updated);
      } else {
        // Create new submission
        const created = await storage.createGradeSubmission({
          sessionId,
          grades,
          finalAverage,
        });
        return res.json(created);
      }
    } catch (error) {
      console.error("Error saving grades:", error);
      res.status(500).json({ error: "Failed to save grades" });
    }
  });

  // Get all submissions (for admin viewing)
  app.get("/api/submissions", async (req, res) => {
    try {
      const submissions = await storage.getAllGradeSubmissions();
      res.json(submissions);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      res.status(500).json({ error: "Failed to fetch submissions" });
    }
  });

  return httpServer;
}
