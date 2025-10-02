import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ProbabilityBadge } from "./ProbabilityBadge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Trophy, Target, Award } from "lucide-react";
import type { PredictionResult, FeatureContribution } from "@shared/schema";

interface PlayerDetailDialogProps {
  prediction: PredictionResult | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PlayerDetailDialog({ prediction, open, onOpenChange }: PlayerDetailDialogProps) {
  if (!prediction) return null;

  const { player, probability, rank, topFeatures } = prediction;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl">
                {player.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <DialogTitle className="text-2xl" data-testid="text-player-name">{player.name}</DialogTitle>
              <div className="flex gap-2 mt-1 flex-wrap">
                <Badge variant="secondary">{player.position}</Badge>
                <Badge variant="secondary">{player.club}</Badge>
                <Badge variant="secondary">{player.nationality}</Badge>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <Award className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-sm text-muted-foreground mb-1">Prediction Rank</p>
              <p className="text-2xl font-bold font-mono" data-testid="text-rank">#{rank}</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <Target className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-sm text-muted-foreground mb-1">Win Probability</p>
              <p className="text-2xl font-bold font-mono">{(probability * 100).toFixed(1)}%</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <Trophy className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-sm text-muted-foreground mb-1">Age</p>
              <p className="text-2xl font-bold font-mono">{player.age}</p>
            </div>
          </div>

          {topFeatures && topFeatures.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Key Contributing Factors</h3>
              <div className="space-y-2">
                {topFeatures.map((feature, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{feature.feature}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground font-mono">{feature.value.toFixed(1)}</span>
                      <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${Math.abs(feature.contribution) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold mb-3">Prediction Explanation</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This prediction is based on machine learning analysis of historical Ballon d'Or winners 
              and nominees. The model considers performance metrics including goals, assists, trophies won, 
              and overall match ratings. The probability indicates the likelihood of winning based on 
              historical patterns and current season performance.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
