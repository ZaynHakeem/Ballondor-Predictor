import { FeatureImportanceChart } from "../FeatureImportanceChart";
import type { FeatureImportance } from "@shared/schema";

export default function FeatureImportanceChartExample() {
  const mockFeatures: FeatureImportance[] = [
    { feature: "Goals", importance: 0.28 },
    { feature: "Assists", importance: 0.22 },
    { feature: "Trophies", importance: 0.18 },
    { feature: "Match Rating", importance: 0.15 },
    { feature: "Minutes Played", importance: 0.10 },
    { feature: "Appearances", importance: 0.07 },
  ];

  return (
    <div className="p-8">
      <FeatureImportanceChart features={mockFeatures} />
    </div>
  );
}
