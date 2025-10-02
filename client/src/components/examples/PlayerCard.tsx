import { PlayerCard } from "../PlayerCard";
import type { PredictionResult } from "@shared/schema";

export default function PlayerCardExample() {
  const mockPrediction: PredictionResult = {
    player: {
      id: "1",
      name: "Kylian Mbappé",
      position: "Forward",
      nationality: "France",
      club: "Real Madrid",
      age: 25,
    },
    probability: 0.78,
    rank: 1,
    topFeatures: [],
  };

  return (
    <div className="p-8 max-w-md">
      <PlayerCard prediction={mockPrediction} onClick={() => console.log("Player clicked")} />
    </div>
  );
}
