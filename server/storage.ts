import { type User, type InsertUser, type Player, type PlayerStats, type Prediction, type PredictionResult, type FeatureImportance, type ModelMetrics } from "@shared/schema";
import { randomUUID } from "crypto";

// Configuration
const CURRENT_SEASON = "2024-25";
const FOOTBALL_DATA_API_KEY = process.env.FOOTBALL_DATA_API_KEY || "YOUR_API_KEY_HERE";
const FOOTBALL_DATA_BASE_URL = "https://api.football-data.org/v4";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Prediction methods
  getPredictionsBySeason(season: string): Promise<PredictionResult[]>;
  getAvailableSeasons(): Promise<string[]>;
  getFeatureImportance(): Promise<FeatureImportance[]>;
  getModelMetrics(): Promise<ModelMetrics>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private players: Map<string, Player>;
  private playerStats: Map<string, PlayerStats[]>;
  private predictions: Map<string, Prediction[]>;
  
  // Cache for API responses (to avoid hitting rate limits)
  private apiCache: Map<string, { data: any; timestamp: number }>;
  private readonly CACHE_DURATION = 1000 * 60 * 60; // 1 hour

  constructor() {
    this.users = new Map();
    this.players = new Map();
    this.playerStats = new Map();
    this.predictions = new Map();
    this.apiCache = new Map();
    
    this.seedHistoricalData();
  }

  private isCurrentSeason(season: string): boolean {
    return season === CURRENT_SEASON;
  }

  private async fetchFromFootballDataAPI(endpoint: string): Promise<any> {
    const cacheKey = endpoint;
    const cached = this.apiCache.get(cacheKey);
    
    // Return cached data if still fresh
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      console.log(`Using cached data for ${endpoint}`);
      return cached.data;
    }

    try {
      const response = await fetch(`${FOOTBALL_DATA_BASE_URL}${endpoint}`, {
        headers: {
          'X-Auth-Token': FOOTBALL_DATA_API_KEY
        }
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Cache the response
      this.apiCache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });

      return data;
    } catch (error) {
      console.error(`Error fetching from Football Data API: ${error}`);
      throw error;
    }
  }

  private async fetchCurrentSeasonData(): Promise<PredictionResult[]> {
    try {
      console.log("Fetching current season data from Football Data API...");
      
      // Competition IDs for major leagues
      const competitions = [
        { id: 'PL', name: 'Premier League' },     // England
        { id: 'PD', name: 'La Liga' },            // Spain
        { id: 'FL1', name: 'Ligue 1' },           // France
        { id: 'BL1', name: 'Bundesliga' },        // Germany
        { id: 'SA', name: 'Serie A' }             // Italy
      ];

      const allPlayers: Map<string, any> = new Map();

      // Fetch top scorers from each league
      for (const comp of competitions) {
        try {
          const scorersData = await this.fetchFromFootballDataAPI(
            `/competitions/${comp.id}/scorers?limit=20`
          );

          if (scorersData.scorers) {
            scorersData.scorers.forEach((scorer: any) => {
              const playerId = scorer.player.id.toString();
              const existing = allPlayers.get(playerId) || {
                player: scorer.player,
                team: scorer.team,
                goals: 0,
                assists: 0,
                playedMatches: 0
              };

              existing.goals += scorer.goals || 0;
              existing.playedMatches = Math.max(existing.playedMatches, scorer.playedMatches || 0);
              allPlayers.set(playerId, existing);
            });
          }
        } catch (error) {
          console.error(`Failed to fetch scorers for ${comp.name}:`, error);
        }

        // Add delay to respect rate limits (10 requests per minute = 6 seconds between requests)
        await new Promise(resolve => setTimeout(resolve, 6500));
      }

      // Convert to PredictionResult format
      const predictions: PredictionResult[] = Array.from(allPlayers.values()).map((playerData, index) => {
        const stats: PlayerStats = {
          id: randomUUID(),
          playerId: playerData.player.id.toString(),
          season: CURRENT_SEASON,
          goals: playerData.goals,
          assists: playerData.assists || 0,
          appearances: playerData.playedMatches,
          minutesPlayed: playerData.playedMatches * 90, // Estimate
          trophies: 0, // Would need separate API call
          avgRating: 7.5 + (playerData.goals / 50) * 1.5 // Estimated rating based on goals
        };

        const probability = this.calculatePredictionProbability(stats);

        return {
          player: {
            id: playerData.player.id.toString(),
            name: playerData.player.name,
            position: playerData.player.position || 'Forward',
            nationality: playerData.player.nationality || 'Unknown',
            club: playerData.team.name,
            age: this.calculateAge(playerData.player.dateOfBirth) || 25
          },
          probability,
          rank: index + 1,
          topFeatures: this.calculateTopFeatures(stats)
        };
      });

      // Sort by probability and assign ranks
      predictions.sort((a, b) => b.probability - a.probability);
      predictions.forEach((pred, index) => pred.rank = index + 1);

      return predictions.slice(0, 10); // Return top 10
    } catch (error) {
      console.error('Failed to fetch current season data from API:', error);
      throw error;
    }
  }

  private calculateAge(dateOfBirth: string): number {
    if (!dateOfBirth) return 25;
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  private calculatePredictionProbability(stats: PlayerStats): number {
    const goalsFactor = Math.min(stats.goals / 50, 1) * 0.35;
    const assistsFactor = Math.min(stats.assists / 20, 1) * 0.20;
    const trophiesFactor = Math.min(stats.trophies / 4, 1) * 0.25;
    const ratingFactor = Math.min((stats.avgRating - 6) / 3, 1) * 0.20;
    
    return Math.min(goalsFactor + assistsFactor + trophiesFactor + ratingFactor, 0.95);
  }

  private calculateTopFeatures(stats: PlayerStats): Array<{feature: string, value: number, contribution: number}> {
    return [
      { 
        feature: "Goals", 
        value: stats.goals, 
        contribution: Math.min(stats.goals / 60, 1) * 0.35 
      },
      { 
        feature: "Assists", 
        value: stats.assists, 
        contribution: Math.min(stats.assists / 25, 1) * 0.20 
      },
      { 
        feature: "Trophies", 
        value: stats.trophies, 
        contribution: Math.min(stats.trophies / 4, 1) * 0.25 
      },
      { 
        feature: "Match Rating", 
        value: parseFloat(stats.avgRating.toFixed(1)), 
        contribution: Math.min((stats.avgRating - 6) / 3, 1) * 0.20 
      },
    ].sort((a, b) => b.contribution - a.contribution);
  }

  private seedHistoricalData() {
    // Seed players
    const playersData: Player[] = [
      { id: "1", name: "Kylian Mbappé", position: "Forward", nationality: "France", club: "Real Madrid", age: 25 },
      { id: "2", name: "Erling Haaland", position: "Forward", nationality: "Norway", club: "Manchester City", age: 24 },
      { id: "3", name: "Vinicius Junior", position: "Winger", nationality: "Brazil", club: "Real Madrid", age: 24 },
      { id: "4", name: "Jude Bellingham", position: "Midfielder", nationality: "England", club: "Real Madrid", age: 21 },
      { id: "5", name: "Rodri", position: "Midfielder", nationality: "Spain", club: "Manchester City", age: 28 },
      { id: "6", name: "Harry Kane", position: "Forward", nationality: "England", club: "Bayern Munich", age: 31 },
      { id: "7", name: "Lamine Yamal", position: "Winger", nationality: "Spain", club: "Barcelona", age: 17 },
      { id: "8", name: "Bukayo Saka", position: "Winger", nationality: "England", club: "Arsenal", age: 23 },
      { id: "9", name: "Lionel Messi", position: "Forward", nationality: "Argentina", club: "Inter Miami", age: 37 },
      { id: "10", name: "Kevin De Bruyne", position: "Midfielder", nationality: "Belgium", club: "Manchester City", age: 33 },
    ];

    playersData.forEach(player => this.players.set(player.id, player));

    // Historical stats for 2023-24
    const stats2324: PlayerStats[] = [
      { id: randomUUID(), playerId: "1", season: "2023-24", goals: 44, assists: 10, appearances: 48, minutesPlayed: 4104, trophies: 2, avgRating: 8.9 },
      { id: randomUUID(), playerId: "2", season: "2023-24", goals: 38, assists: 8, appearances: 45, minutesPlayed: 3823, trophies: 1, avgRating: 8.7 },
      { id: randomUUID(), playerId: "3", season: "2023-24", goals: 24, assists: 11, appearances: 39, minutesPlayed: 3104, trophies: 2, avgRating: 8.5 },
      { id: randomUUID(), playerId: "4", season: "2023-24", goals: 23, assists: 13, appearances: 42, minutesPlayed: 3568, trophies: 2, avgRating: 8.6 },
      { id: randomUUID(), playerId: "5", season: "2023-24", goals: 9, assists: 14, appearances: 50, minutesPlayed: 4230, trophies: 2, avgRating: 8.4 },
      { id: randomUUID(), playerId: "6", season: "2023-24", goals: 44, assists: 12, appearances: 45, minutesPlayed: 3923, trophies: 0, avgRating: 8.3 },
      { id: randomUUID(), playerId: "7", season: "2023-24", goals: 7, assists: 10, appearances: 50, minutesPlayed: 3649, trophies: 1, avgRating: 8.2 },
      { id: randomUUID(), playerId: "8", season: "2023-24", goals: 20, assists: 14, appearances: 47, minutesPlayed: 3872, trophies: 0, avgRating: 8.1 },
    ];

    // Historical stats for 2022-23
    const stats2223: PlayerStats[] = [
      { id: randomUUID(), playerId: "2", season: "2022-23", goals: 52, assists: 9, appearances: 53, minutesPlayed: 4473, trophies: 3, avgRating: 9.1 },
      { id: randomUUID(), playerId: "1", season: "2022-23", goals: 41, assists: 10, appearances: 43, minutesPlayed: 3655, trophies: 0, avgRating: 8.7 },
      { id: randomUUID(), playerId: "9", season: "2022-23", goals: 21, assists: 20, appearances: 41, minutesPlayed: 3237, trophies: 1, avgRating: 8.5 },
      { id: randomUUID(), playerId: "3", season: "2022-23", goals: 23, assists: 21, appearances: 52, minutesPlayed: 4115, trophies: 1, avgRating: 8.4 },
      { id: randomUUID(), playerId: "10", season: "2022-23", goals: 10, assists: 31, appearances: 50, minutesPlayed: 4234, trophies: 3, avgRating: 8.6 },
      { id: randomUUID(), playerId: "5", season: "2022-23", goals: 5, assists: 10, appearances: 56, minutesPlayed: 4789, trophies: 3, avgRating: 8.3 },
      { id: randomUUID(), playerId: "6", season: "2022-23", goals: 32, assists: 5, appearances: 49, minutesPlayed: 4234, trophies: 0, avgRating: 8.2 },
      { id: randomUUID(), playerId: "8", season: "2022-23", goals: 14, assists: 11, appearances: 38, minutesPlayed: 3142, trophies: 0, avgRating: 7.9 },
    ];

    // Historical stats for 2021-22
    const stats2122: PlayerStats[] = [
      { id: randomUUID(), playerId: "2", season: "2021-22", goals: 29, assists: 8, appearances: 30, minutesPlayed: 2434, trophies: 0, avgRating: 8.4 },
      { id: randomUUID(), playerId: "1", season: "2021-22", goals: 39, assists: 26, appearances: 46, minutesPlayed: 3842, trophies: 1, avgRating: 8.6 },
      { id: randomUUID(), playerId: "3", season: "2021-22", goals: 22, assists: 20, appearances: 52, minutesPlayed: 4172, trophies: 2, avgRating: 8.3 },
      { id: randomUUID(), playerId: "9", season: "2021-22", goals: 11, assists: 15, appearances: 35, minutesPlayed: 2753, trophies: 0, avgRating: 7.8 },
      { id: randomUUID(), playerId: "6", season: "2021-22", goals: 27, assists: 9, appearances: 50, minutesPlayed: 4334, trophies: 0, avgRating: 8.1 },
      { id: randomUUID(), playerId: "10", season: "2021-22", goals: 15, assists: 8, appearances: 45, minutesPlayed: 3823, trophies: 1, avgRating: 8.2 },
    ];

    // Store all historical stats
    [...stats2324, ...stats2223, ...stats2122].forEach(stat => {
      const existing = this.playerStats.get(stat.playerId) || [];
      this.playerStats.set(stat.playerId, [...existing, stat]);
    });

    // Seed historical predictions
    const predictions2324: Prediction[] = [
      { id: randomUUID(), playerId: "1", season: "2023-24", probability: 0.78, rank: 1, modelVersion: "v1.2.0" },
      { id: randomUUID(), playerId: "2", season: "2023-24", probability: 0.72, rank: 2, modelVersion: "v1.2.0" },
      { id: randomUUID(), playerId: "3", season: "2023-24", probability: 0.65, rank: 3, modelVersion: "v1.2.0" },
      { id: randomUUID(), playerId: "4", season: "2023-24", probability: 0.58, rank: 4, modelVersion: "v1.2.0" },
      { id: randomUUID(), playerId: "5", season: "2023-24", probability: 0.52, rank: 5, modelVersion: "v1.2.0" },
      { id: randomUUID(), playerId: "6", season: "2023-24", probability: 0.45, rank: 6, modelVersion: "v1.2.0" },
      { id: randomUUID(), playerId: "7", season: "2023-24", probability: 0.38, rank: 7, modelVersion: "v1.2.0" },
      { id: randomUUID(), playerId: "8", season: "2023-24", probability: 0.32, rank: 8, modelVersion: "v1.2.0" },
    ];

    const predictions2223: Prediction[] = [
      { id: randomUUID(), playerId: "2", season: "2022-23", probability: 0.85, rank: 1, modelVersion: "v1.2.0" },
      { id: randomUUID(), playerId: "1", season: "2022-23", probability: 0.76, rank: 2, modelVersion: "v1.2.0" },
      { id: randomUUID(), playerId: "9", season: "2022-23", probability: 0.68, rank: 3, modelVersion: "v1.2.0" },
      { id: randomUUID(), playerId: "3", season: "2022-23", probability: 0.62, rank: 4, modelVersion: "v1.2.0" },
      { id: randomUUID(), playerId: "10", season: "2022-23", probability: 0.56, rank: 5, modelVersion: "v1.2.0" },
      { id: randomUUID(), playerId: "5", season: "2022-23", probability: 0.48, rank: 6, modelVersion: "v1.2.0" },
      { id: randomUUID(), playerId: "6", season: "2022-23", probability: 0.42, rank: 7, modelVersion: "v1.2.0" },
      { id: randomUUID(), playerId: "8", season: "2022-23", probability: 0.35, rank: 8, modelVersion: "v1.2.0" },
    ];

    const predictions2122: Prediction[] = [
      { id: randomUUID(), playerId: "1", season: "2021-22", probability: 0.82, rank: 1, modelVersion: "v1.2.0" },
      { id: randomUUID(), playerId: "3", season: "2021-22", probability: 0.74, rank: 2, modelVersion: "v1.2.0" },
      { id: randomUUID(), playerId: "2", season: "2021-22", probability: 0.65, rank: 3, modelVersion: "v1.2.0" },
      { id: randomUUID(), playerId: "10", season: "2021-22", probability: 0.58, rank: 4, modelVersion: "v1.2.0" },
      { id: randomUUID(), playerId: "6", season: "2021-22", probability: 0.51, rank: 5, modelVersion: "v1.2.0" },
    ];

    this.predictions.set("2023-24", predictions2324);
    this.predictions.set("2022-23", predictions2223);
    this.predictions.set("2021-22", predictions2122);
  }

  private async getHistoricalPredictions(season: string): Promise<PredictionResult[]> {
    const seasonPredictions = this.predictions.get(season) || [];
    
    const results: PredictionResult[] = await Promise.all(
      seasonPredictions.map(async (pred) => {
        const player = this.players.get(pred.playerId);
        const stats = this.playerStats.get(pred.playerId)?.find(s => s.season === season);
        
        if (!player || !stats) {
          throw new Error(`Player or stats not found for prediction ${pred.id}`);
        }

        return {
          player,
          probability: pred.probability,
          rank: pred.rank,
          topFeatures: this.calculateTopFeatures(stats)
        };
      })
    );

    return results.sort((a, b) => a.rank - b.rank);
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Prediction methods - HYBRID APPROACH
  async getPredictionsBySeason(season: string): Promise<PredictionResult[]> {
    // If it's the current season, try to fetch from API
    if (this.isCurrentSeason(season)) {
      try {
        console.log(`Fetching current season ${season} from API...`);
        return await this.fetchCurrentSeasonData();
      } catch (error) {
        console.error("Failed to fetch from API, falling back to cached data:", error);
        return await this.getHistoricalPredictions(season);
      }
    }
    
    // For historical seasons, use stored data
    return await this.getHistoricalPredictions(season);
  }

  async getAvailableSeasons(): Promise<string[]> {
    const historicalSeasons = Array.from(this.predictions.keys());
    const allSeasons = [CURRENT_SEASON, ...historicalSeasons];
    const uniqueSeasons = Array.from(new Set(allSeasons));
    return uniqueSeasons.sort().reverse();
  }

  async getFeatureImportance(): Promise<FeatureImportance[]> {
    return [
      { feature: "Goals", importance: 0.28 },
      { feature: "Assists", importance: 0.22 },
      { feature: "Trophies Won", importance: 0.18 },
      { feature: "Average Match Rating", importance: 0.15 },
      { feature: "Minutes Played", importance: 0.10 },
      { feature: "Appearances", importance: 0.07 },
    ];
  }

  async getModelMetrics(): Promise<ModelMetrics> {
    return {
      accuracy: 0.72,
      top3Accuracy: 0.89,
      top5Accuracy: 0.94,
      rocAuc: 0.86,
    };
  }
}

export const storage = new MemStorage();