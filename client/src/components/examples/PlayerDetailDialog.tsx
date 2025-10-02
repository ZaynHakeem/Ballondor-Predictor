import { useState } from "react";
import { PlayerDetailDialog } from "../PlayerDetailDialog";
import { Button } from "@/components/ui/button";
import type { PredictionResult } from "@shared/schema";

export default function PlayerDetailDialogExample() {
  const [open, setOpen] = useState(false);
  
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
    topFeatures: [
      { feature: "Goals", value: 44, contribution: 0.32 },
      { feature: "Assists", value: 10, contribution: 0.18 },
      { feature: "Trophies", value: 3, contribution: 0.25 },
      { feature: "Match Rating", value: 8.9, contribution: 0.15 },
    ],
  };

  return (
    <div className="p-8">
      <Button onClick={() => setOpen(true)}>Open Player Details</Button>
      <PlayerDetailDialog prediction={mockPrediction} open={open} onOpenChange={setOpen} />
    </div>
  );
}
