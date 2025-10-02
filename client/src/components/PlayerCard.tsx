import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ProbabilityBadge } from "./ProbabilityBadge";
import { Trophy } from "lucide-react";
import type { PredictionResult } from "@shared/schema";

interface PlayerCardProps {
  prediction: PredictionResult;
  onClick?: () => void;
}

export function PlayerCard({ prediction, onClick }: PlayerCardProps) {
  const { player, probability, rank } = prediction;
  
  const getMedalEmoji = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return null;
  };

  const medal = getMedalEmoji(rank);

  return (
    <Card 
      className="hover-elevate active-elevate-2 cursor-pointer transition-all"
      onClick={onClick}
      data-testid={`card-player-${player.id}`}
    >
      <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {player.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              {medal && <span className="text-xl">{medal}</span>}
              <h3 className="font-semibold text-base truncate" data-testid="text-player-name">
                {player.name}
              </h3>
            </div>
            <p className="text-sm text-muted-foreground truncate">
              {player.position} • {player.club}
            </p>
          </div>
        </div>
        <ProbabilityBadge probability={probability} />
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-muted-foreground">Rank</p>
            <p className="text-lg font-bold font-mono" data-testid="text-rank">#{rank}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Age</p>
            <p className="text-lg font-bold font-mono">{player.age}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Country</p>
            <p className="text-sm font-medium truncate">{player.nationality}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
