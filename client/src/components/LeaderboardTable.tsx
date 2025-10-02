import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ProbabilityBadge } from "./ProbabilityBadge";
import type { PredictionResult } from "@shared/schema";

interface LeaderboardTableProps {
  predictions: PredictionResult[];
  onPlayerClick?: (prediction: PredictionResult) => void;
}

export function LeaderboardTable({ predictions, onPlayerClick }: LeaderboardTableProps) {
  const getMedalEmoji = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return null;
  };

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-16 font-semibold">Rank</TableHead>
            <TableHead className="font-semibold">Player</TableHead>
            <TableHead className="font-semibold">Position</TableHead>
            <TableHead className="font-semibold">Club</TableHead>
            <TableHead className="text-right font-semibold">Probability</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {predictions.map((pred) => {
            const medal = getMedalEmoji(pred.rank);
            return (
              <TableRow
                key={pred.player.id}
                className="hover-elevate cursor-pointer"
                onClick={() => onPlayerClick?.(pred)}
                data-testid={`row-player-${pred.player.id}`}
              >
                <TableCell className="font-mono font-bold">
                  <div className="flex items-center gap-2">
                    {medal && <span>{medal}</span>}
                    <span>#{pred.rank}</span>
                  </div>
                </TableCell>
                <TableCell className="font-semibold" data-testid="text-player-name">
                  {pred.player.name}
                </TableCell>
                <TableCell className="text-muted-foreground">{pred.player.position}</TableCell>
                <TableCell className="text-muted-foreground">{pred.player.club}</TableCell>
                <TableCell className="text-right">
                  <ProbabilityBadge probability={pred.probability} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
