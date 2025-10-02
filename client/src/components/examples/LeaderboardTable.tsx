import { LeaderboardTable } from "../LeaderboardTable";
import type { PredictionResult } from "@shared/schema";

export default function LeaderboardTableExample() {
  const mockPredictions: PredictionResult[] = [
    {
      player: { id: "1", name: "Kylian Mbappé", position: "Forward", nationality: "France", club: "Real Madrid", age: 25 },
      probability: 0.78,
      rank: 1,
      topFeatures: [],
    },
    {
      player: { id: "2", name: "Erling Haaland", position: "Forward", nationality: "Norway", club: "Manchester City", age: 24 },
      probability: 0.65,
      rank: 2,
      topFeatures: [],
    },
    {
      player: { id: "3", name: "Vinicius Junior", position: "Winger", nationality: "Brazil", club: "Real Madrid", age: 23 },
      probability: 0.52,
      rank: 3,
      topFeatures: [],
    },
  ];

  return (
    <div className="p-8">
      <LeaderboardTable predictions={mockPredictions} onPlayerClick={(p) => console.log("Clicked", p.player.name)} />
    </div>
  );
}
