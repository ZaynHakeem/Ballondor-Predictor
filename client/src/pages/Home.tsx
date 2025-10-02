import { useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { SeasonSelector } from "@/components/SeasonSelector";
import { PlayerCard } from "@/components/PlayerCard";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { FeatureImportanceChart } from "@/components/FeatureImportanceChart";
import { ModelMetricsCard } from "@/components/ModelMetricsCard";
import { PlayerDetailDialog } from "@/components/PlayerDetailDialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Trophy, BarChart3, Users, Info } from "lucide-react";
import type { PredictionResult, FeatureImportance, ModelMetrics } from "@shared/schema";

export default function Home() {
  const [selectedSeason, setSelectedSeason] = useState("2023-24");
  const [selectedPlayer, setSelectedPlayer] = useState<PredictionResult | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // TODO: remove mock functionality - replace with real data from API
  const mockSeasons = ["2023-24", "2022-23", "2021-22", "2020-21", "2019-20"];
  
  const mockPredictions: PredictionResult[] = [
    {
      player: { id: "1", name: "Kylian Mbappé", position: "Forward", nationality: "France", club: "Real Madrid", age: 25 },
      probability: 0.78,
      rank: 1,
      topFeatures: [
        { feature: "Goals", value: 44, contribution: 0.32 },
        { feature: "Assists", value: 10, contribution: 0.18 },
        { feature: "Trophies", value: 3, contribution: 0.25 },
        { feature: "Match Rating", value: 8.9, contribution: 0.15 },
      ],
    },
    {
      player: { id: "2", name: "Erling Haaland", position: "Forward", nationality: "Norway", club: "Manchester City", age: 24 },
      probability: 0.65,
      rank: 2,
      topFeatures: [
        { feature: "Goals", value: 52, contribution: 0.38 },
        { feature: "Assists", value: 7, contribution: 0.12 },
        { feature: "Trophies", value: 2, contribution: 0.18 },
        { feature: "Match Rating", value: 8.7, contribution: 0.14 },
      ],
    },
    {
      player: { id: "3", name: "Vinicius Junior", position: "Winger", nationality: "Brazil", club: "Real Madrid", age: 23 },
      probability: 0.52,
      rank: 3,
      topFeatures: [
        { feature: "Goals", value: 24, contribution: 0.22 },
        { feature: "Assists", value: 16, contribution: 0.24 },
        { feature: "Trophies", value: 3, contribution: 0.25 },
        { feature: "Match Rating", value: 8.5, contribution: 0.13 },
      ],
    },
    {
      player: { id: "4", name: "Jude Bellingham", position: "Midfielder", nationality: "England", club: "Real Madrid", age: 21 },
      probability: 0.48,
      rank: 4,
      topFeatures: [],
    },
    {
      player: { id: "5", name: "Rodri", position: "Midfielder", nationality: "Spain", club: "Manchester City", age: 28 },
      probability: 0.42,
      rank: 5,
      topFeatures: [],
    },
    {
      player: { id: "6", name: "Harry Kane", position: "Forward", nationality: "England", club: "Bayern Munich", age: 31 },
      probability: 0.38,
      rank: 6,
      topFeatures: [],
    },
    {
      player: { id: "7", name: "Lamine Yamal", position: "Winger", nationality: "Spain", club: "Barcelona", age: 17 },
      probability: 0.32,
      rank: 7,
      topFeatures: [],
    },
    {
      player: { id: "8", name: "Bukayo Saka", position: "Winger", nationality: "England", club: "Arsenal", age: 23 },
      probability: 0.28,
      rank: 8,
      topFeatures: [],
    },
  ];

  const mockFeatures: FeatureImportance[] = [
    { feature: "Goals", importance: 0.28 },
    { feature: "Assists", importance: 0.22 },
    { feature: "Trophies Won", importance: 0.18 },
    { feature: "Average Match Rating", importance: 0.15 },
    { feature: "Minutes Played", importance: 0.10 },
    { feature: "Appearances", importance: 0.07 },
  ];

  const mockMetrics: ModelMetrics = {
    accuracy: 0.72,
    top3Accuracy: 0.89,
    top5Accuracy: 0.94,
    rocAuc: 0.86,
  };

  const handlePlayerClick = (prediction: PredictionResult) => {
    console.log("Player selected:", prediction.player.name);
    setSelectedPlayer(prediction);
    setDialogOpen(true);
  };

  const scrollToLeaderboard = () => {
    document.getElementById("leaderboard")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <HeroSection onGetStarted={scrollToLeaderboard} />

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
        <section id="leaderboard" className="scroll-mt-20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <Trophy className="h-8 w-8 text-primary" />
                Predictions Leaderboard
              </h2>
              <p className="text-muted-foreground mt-1">
                Top candidates for the {selectedSeason} Ballon d'Or
              </p>
            </div>
            <SeasonSelector
              value={selectedSeason}
              onChange={(season) => {
                console.log("Season changed:", season);
                setSelectedSeason(season);
              }}
              seasons={mockSeasons}
            />
          </div>

          <Tabs defaultValue="grid" className="space-y-6">
            <TabsList>
              <TabsTrigger value="grid" data-testid="tab-grid-view">
                <Users className="h-4 w-4 mr-2" />
                Grid View
              </TabsTrigger>
              <TabsTrigger value="table" data-testid="tab-table-view">
                <BarChart3 className="h-4 w-4 mr-2" />
                Table View
              </TabsTrigger>
            </TabsList>

            <TabsContent value="grid" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockPredictions.slice(0, 6).map((prediction) => (
                  <PlayerCard
                    key={prediction.player.id}
                    prediction={prediction}
                    onClick={() => handlePlayerClick(prediction)}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="table">
              <LeaderboardTable
                predictions={mockPredictions}
                onPlayerClick={handlePlayerClick}
              />
            </TabsContent>
          </Tabs>
        </section>

        <section>
          <div className="mb-6">
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-primary" />
              Model Insights
            </h2>
            <p className="text-muted-foreground mt-1">
              Understand how our AI makes predictions
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FeatureImportanceChart
              features={mockFeatures}
              title="Global Feature Importance"
            />
            <ModelMetricsCard metrics={mockMetrics} modelVersion="v1.2.0" />
          </div>
        </section>

        <section>
          <Card className="bg-muted/50">
            <CardHeader>
              <div className="flex items-start gap-4">
                <Info className="h-6 w-6 text-primary mt-1" />
                <div>
                  <CardTitle>How Our Predictions Work</CardTitle>
                  <CardDescription className="mt-2">
                    Our machine learning models analyze historical Ballon d'Or winners and nominees 
                    from the past decade, considering key performance metrics such as goals scored, 
                    assists, trophies won, and overall match ratings. The model uses Random Forest 
                    and Logistic Regression algorithms to identify patterns that correlate with winning 
                    the award.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-background rounded-lg">
                  <h4 className="font-semibold mb-2">1. Data Collection</h4>
                  <p className="text-sm text-muted-foreground">
                    Historical player statistics and Ballon d'Or results from multiple seasons
                  </p>
                </div>
                <div className="p-4 bg-background rounded-lg">
                  <h4 className="font-semibold mb-2">2. Feature Engineering</h4>
                  <p className="text-sm text-muted-foreground">
                    Normalize statistics and create derived metrics like goals per 90 minutes
                  </p>
                </div>
                <div className="p-4 bg-background rounded-lg">
                  <h4 className="font-semibold mb-2">3. ML Prediction</h4>
                  <p className="text-sm text-muted-foreground">
                    Advanced algorithms predict probability based on learned patterns
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      <PlayerDetailDialog
        prediction={selectedPlayer}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}
