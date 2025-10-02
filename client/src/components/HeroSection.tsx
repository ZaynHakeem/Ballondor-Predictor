import { Button } from "@/components/ui/button";
import { Trophy, TrendingUp, Brain } from "lucide-react";
import heroImage from "@assets/generated_images/Ballon_d'Or_trophy_hero_cb9c97bc.png";

interface HeroSectionProps {
  onGetStarted?: () => void;
}

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <div className="relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/90 to-background" />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-32">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            <Brain className="h-4 w-4" />
            <span>Powered by Machine Learning</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Predict the Next
            <span className="block text-primary mt-2">Ballon d'Or Winner</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Advanced AI models analyze historical player statistics, performance metrics, and trophy wins 
            to predict football's most prestigious individual award
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" onClick={onGetStarted} data-testid="button-get-started">
              <Trophy className="h-5 w-5 mr-2" />
              View Predictions
            </Button>
            <Button size="lg" variant="outline" onClick={() => console.log("Learn more clicked")}>
              <TrendingUp className="h-5 w-5 mr-2" />
              How It Works
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
            <div>
              <p className="text-3xl md:text-4xl font-bold text-primary">72%</p>
              <p className="text-sm text-muted-foreground mt-1">Prediction Accuracy</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-primary">10+</p>
              <p className="text-sm text-muted-foreground mt-1">Seasons Analyzed</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-primary">500+</p>
              <p className="text-sm text-muted-foreground mt-1">Players Evaluated</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
