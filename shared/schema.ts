import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const players = pgTable("players", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  position: text("position").notNull(),
  nationality: text("nationality").notNull(),
  club: text("club").notNull(),
  age: integer("age").notNull(),
});

export const playerStats = pgTable("player_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  playerId: varchar("player_id").notNull(),
  season: text("season").notNull(),
  goals: integer("goals").notNull(),
  assists: integer("assists").notNull(),
  appearances: integer("appearances").notNull(),
  minutesPlayed: integer("minutes_played").notNull(),
  trophies: integer("trophies").notNull(),
  avgRating: real("avg_rating").notNull(),
});

export const predictions = pgTable("predictions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  playerId: varchar("player_id").notNull(),
  season: text("season").notNull(),
  probability: real("probability").notNull(),
  rank: integer("rank").notNull(),
  modelVersion: text("model_version").notNull(),
});

export const insertPlayerStatsSchema = createInsertSchema(playerStats).omit({
  id: true,
});

export type InsertPlayerStats = z.infer<typeof insertPlayerStatsSchema>;
export type Player = typeof players.$inferSelect;
export type PlayerStats = typeof playerStats.$inferSelect;
export type Prediction = typeof predictions.$inferSelect;

export interface PredictionResult {
  player: Player;
  probability: number;
  rank: number;
  topFeatures: FeatureContribution[];
}

export interface FeatureContribution {
  feature: string;
  value: number;
  contribution: number;
}

export interface FeatureImportance {
  feature: string;
  importance: number;
}

export interface ModelMetrics {
  accuracy: number;
  top3Accuracy: number;
  top5Accuracy: number;
  rocAuc: number;
}
