import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Trophy } from "lucide-react";
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <div className="min-h-screen bg-background">
            <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-3">
                  <Trophy className="h-7 w-7 text-primary" />
                  <div>
                    <h1 className="text-xl font-bold">Ballon d'Or Predictor</h1>
                    <p className="text-xs text-muted-foreground hidden sm:block">AI-Powered Predictions</p>
                  </div>
                </div>
                <ThemeToggle />
              </div>
            </header>
            <main>
              <Router />
            </main>
            <footer className="border-t border-border mt-20">
              <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="text-center text-sm text-muted-foreground">
                  <p>© 2024 Ballon d'Or Predictor. Predictions powered by machine learning.</p>
                  <p className="mt-2">Data analysis for educational and entertainment purposes.</p>
                </div>
              </div>
            </footer>
          </div>
          <Toaster />
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
