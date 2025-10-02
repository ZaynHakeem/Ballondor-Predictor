import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, TrendingUp, Target, Award } from "lucide-react";
import type { ModelMetrics } from "@shared/schema";

interface ModelMetricsCardProps {
  metrics: ModelMetrics;
  modelVersion?: string;
}

export function ModelMetricsCard({ metrics, modelVersion = "v1.2.0" }: ModelMetricsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-3">
        <CardTitle className="text-lg">Model Performance</CardTitle>
        <Badge variant="secondary">{modelVersion}</Badge>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-muted rounded-lg">
            <Target className="h-5 w-5 mx-auto mb-2 text-chart-1" />
            <p className="text-xs text-muted-foreground mb-1">Accuracy</p>
            <p className="text-xl font-bold font-mono">{(metrics.accuracy * 100).toFixed(1)}%</p>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <Award className="h-5 w-5 mx-auto mb-2 text-chart-2" />
            <p className="text-xs text-muted-foreground mb-1">Top-3</p>
            <p className="text-xl font-bold font-mono">{(metrics.top3Accuracy * 100).toFixed(1)}%</p>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <TrendingUp className="h-5 w-5 mx-auto mb-2 text-chart-3" />
            <p className="text-xs text-muted-foreground mb-1">Top-5</p>
            <p className="text-xl font-bold font-mono">{(metrics.top5Accuracy * 100).toFixed(1)}%</p>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <Activity className="h-5 w-5 mx-auto mb-2 text-chart-4" />
            <p className="text-xs text-muted-foreground mb-1">ROC-AUC</p>
            <p className="text-xl font-bold font-mono">{(metrics.rocAuc * 100).toFixed(1)}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
