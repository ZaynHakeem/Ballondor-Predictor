import { ProbabilityBadge } from "../ProbabilityBadge";

export default function ProbabilityBadgeExample() {
  return (
    <div className="p-8 flex gap-4 flex-wrap">
      <ProbabilityBadge probability={0.85} />
      <ProbabilityBadge probability={0.42} />
      <ProbabilityBadge probability={0.15} />
    </div>
  );
}
