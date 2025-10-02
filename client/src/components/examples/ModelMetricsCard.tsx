import { ModelMetricsCard } from "../ModelMetricsCard";
import type { ModelMetrics } from "@shared/schema";

export default function ModelMetricsCardExample() {
  const mockMetrics: ModelMetrics = {
    accuracy: 0.72,
    top3Accuracy: 0.89,
    top5Accuracy: 0.94,
    rocAuc: 0.86,
  };

  return (
    <div className="p-8">
      <ModelMetricsCard metrics={mockMetrics} modelVersion="v1.2.0" />
    </div>
  );
}
