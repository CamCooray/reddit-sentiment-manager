import { TrendingUp } from "lucide-react";

const Header = () => {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-6 w-6 text-primary" />
          <h1 className="text-lg font-semibold text-foreground">
            Reddit Sentiment Tracker
          </h1>
          <span className="text-xs text-muted-foreground">Internal Tool</span>
        </div>
        
        <div className="text-xs text-muted-foreground">
          Cleverbridge GTM Team
        </div>
      </div>
    </header>
  );
};

export default Header;