import { Badge } from "@/components/ui/badge";

interface ProbabilityBadgeProps {
  probability: number;
}

export function ProbabilityBadge({ probability }: ProbabilityBadgeProps) {
  const percentage = (probability * 100).toFixed(1);
  
  const getVariant = () => {
    if (probability >= 0.5) return "default";
    if (probability >= 0.2) return "secondary";
    return "outline";
  };

  return (
    <Badge variant={getVariant()} data-testid="badge-probability">
      {percentage}%
    </Badge>
  );
}
