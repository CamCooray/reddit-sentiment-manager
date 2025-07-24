import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  TrendingUp, TrendingDown, MessageCircle, ExternalLink, 
  Clock, AlertTriangle, CheckCircle, Users, Search, Filter
} from "lucide-react";
import { useState } from "react";

const SentimentMonitor = () => {
  const [selectedSubreddit, setSelectedSubreddit] = useState("all");
  const [sentimentFilter, setSentimentFilter] = useState("all");

  const monitoredSubreddits = [
    { name: "r/technology", status: "active", mentions: 23, avgSentiment: 0.4 },
    { name: "r/startups", status: "active", mentions: 15, avgSentiment: -0.2 },
    { name: "r/entrepreneur", status: "active", mentions: 31, avgSentiment: 0.6 },
    { name: "r/marketing", status: "active", mentions: 8, avgSentiment: 0.1 },
    { name: "r/SaaS", status: "active", mentions: 12, avgSentiment: 0.3 },
  ];

  const recentMentions = [
    {
      id: 1,
      subreddit: "r/technology",
      title: "Anyone using AI tools for social media management? Looking for recommendations",
      author: "techuser123",
      sentiment: "neutral",
      score: 0.1,
      upvotes: 45,
      comments: 12,
      timeAgo: "23m ago",
      status: "pending",
      keywords: ["AI tools", "social media", "management"]
    },
    {
      id: 2,
      subreddit: "r/startups",
      title: "Struggling with customer acquisition, current tools aren't working",
      author: "startupfounder",
      sentiment: "negative",
      score: -0.7,
      upvotes: 23,
      comments: 8,
      timeAgo: "1h ago",
      status: "flagged",
      keywords: ["customer acquisition", "tools", "struggling"]
    },
    {
      id: 3,
      subreddit: "r/entrepreneur",
      title: "Just hit 10k MRR using community-driven growth strategies!",
      author: "entrepreneur_mike",
      sentiment: "positive",
      score: 0.8,
      upvotes: 156,
      comments: 34,
      timeAgo: "2h ago",
      status: "opportunity",
      keywords: ["10k MRR", "growth strategies", "community"]
    },
    {
      id: 4,
      subreddit: "r/marketing",
      title: "ROI on Reddit marketing? Has anyone seen actual results?",
      author: "marketing_pro",
      sentiment: "neutral",
      score: 0.0,
      upvotes: 67,
      comments: 19,
      timeAgo: "3h ago",
      status: "pending",
      keywords: ["ROI", "Reddit marketing", "results"]
    }
  ];

  const getSentimentColor = (sentiment: string, score: number) => {
    if (sentiment === "positive") return "text-success";
    if (sentiment === "negative") return "text-destructive";
    return "text-muted-foreground";
  };

  const getSentimentBadge = (sentiment: string, status: string) => {
    if (status === "flagged") return <Badge variant="destructive">Flagged</Badge>;
    if (status === "opportunity") return <Badge variant="default">Opportunity</Badge>;
    if (sentiment === "positive") return <Badge variant="outline" className="text-success border-success">Positive</Badge>;
    if (sentiment === "negative") return <Badge variant="outline" className="text-destructive border-destructive">Negative</Badge>;
    return <Badge variant="outline">Neutral</Badge>;
  };

  const getStatusIcon = (status: string) => {
    if (status === "flagged") return <AlertTriangle className="h-4 w-4 text-destructive" />;
    if (status === "opportunity") return <CheckCircle className="h-4 w-4 text-success" />;
    return <Clock className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Mentions</p>
                <p className="text-2xl font-bold">89</p>
              </div>
              <MessageCircle className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Flagged Posts</p>
                <p className="text-2xl font-bold text-destructive">7</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Opportunities</p>
                <p className="text-2xl font-bold text-success">12</p>
              </div>
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Sentiment</p>
                <p className="text-2xl font-bold text-success">+0.24</p>
              </div>
              <TrendingUp className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monitored Subreddits */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Monitored Subreddits
            </CardTitle>
            <CardDescription>Active monitoring across target communities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {monitoredSubreddits.map((subreddit, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-border/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-success rounded-full" />
                  <div>
                    <p className="font-medium text-sm">{subreddit.name}</p>
                    <p className="text-xs text-muted-foreground">{subreddit.mentions} mentions</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${subreddit.avgSentiment >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {subreddit.avgSentiment >= 0 ? '+' : ''}{subreddit.avgSentiment.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Mentions */}
        <div className="lg:col-span-2">
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Mentions</CardTitle>
                  <CardDescription>Posts requiring attention or engagement</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Select value={selectedSubreddit} onValueChange={setSelectedSubreddit}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Subreddits</SelectItem>
                      <SelectItem value="technology">r/technology</SelectItem>
                      <SelectItem value="startups">r/startups</SelectItem>
                      <SelectItem value="entrepreneur">r/entrepreneur</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={sentimentFilter} onValueChange={setSentimentFilter}>
                    <SelectTrigger className="w-28">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="positive">Positive</SelectItem>
                      <SelectItem value="negative">Negative</SelectItem>
                      <SelectItem value="neutral">Neutral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentMentions.map((mention) => (
                <div key={mention.id} className="border border-border/50 rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(mention.status)}
                        <Badge variant="outline" className="text-xs">{mention.subreddit}</Badge>
                        {getSentimentBadge(mention.sentiment, mention.status)}
                        <span className="text-xs text-muted-foreground">by u/{mention.author}</span>
                      </div>
                      <h4 className="font-medium text-sm leading-tight">{mention.title}</h4>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          {mention.upvotes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="h-3 w-3" />
                          {mention.comments}
                        </span>
                        <span>{mention.timeAgo}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {mention.keywords.map((keyword, i) => (
                          <Badge key={i} variant="secondary" className="text-xs px-2 py-1">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button 
                        variant={mention.status === "opportunity" ? "default" : "outline"} 
                        size="sm"
                      >
                        Engage
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SentimentMonitor;