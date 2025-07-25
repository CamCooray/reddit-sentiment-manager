import { useEffect, useState } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  TrendingUp, TrendingDown, MessageCircle, ExternalLink,
  Clock, AlertTriangle, CheckCircle, Users
} from "lucide-react";

const SentimentMonitor = () => {
  const [selectedSubreddit, setSelectedSubreddit] = useState("all");
  const [sentimentFilter, setSentimentFilter] = useState("all");
  const [recentMentions, setRecentMentions] = useState<any[]>([]);

  // Compute monitored subreddits dynamically from recentMentions
  const monitoredSubreddits = Object.values(
    recentMentions.reduce((acc, mention) => {
      const name = mention.subreddit;
      if (!acc[name]) {
        acc[name] = { name, mentions: 0 };
      }
      acc[name].mentions += 1;
      return acc;
    }, {} as Record<string, { name: string; mentions: number }>)
  ) as Array<{ name: string; mentions: number }>;

  useEffect(() => {
    axios.get<any[]>("http://localhost:8000/recent-mentions")
      .then(res => {
        const mentions = Array.isArray(res.data) ? res.data : [];
        console.log("Backend mentions:", mentions);
        mentions.forEach((m, i) => {
          console.log(`Mention ${i}: id=${m.id}, subreddit=${m.subreddit}, title=${m.title}`);
        });
        setRecentMentions(mentions);
      })
      .catch(err => {
        console.error("Failed to fetch recent mentions:", err);
      });
  }, []);

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

  const filteredMentions = recentMentions.filter((mention) => {
    const subredditMatches = selectedSubreddit === "all" || mention.subreddit.toLowerCase().includes(selectedSubreddit.toLowerCase());
    const sentimentMatches = sentimentFilter === "all" || mention.sentiment === sentimentFilter;
    return subredditMatches && sentimentMatches;
  });

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><div className="text-center"><div className="text-2xl font-semibold">{recentMentions.length}</div><div className="text-sm text-muted-foreground">Total Mentions</div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-center"><div className="text-2xl font-semibold text-destructive">0</div><div className="text-sm text-muted-foreground">Flagged</div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-center"><div className="text-2xl font-semibold text-success">0</div><div className="text-sm text-muted-foreground">Opportunities</div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-center"><div className="text-2xl font-semibold">--</div><div className="text-sm text-muted-foreground">Avg Sentiment</div></div></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monitored Subreddits (optional, still static) */}
        <Card>
          <CardHeader><CardTitle className="text-base">Monitored Subreddits</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {monitoredSubreddits.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <p className="text-sm">No subreddits being monitored</p>
              </div>
            ) : (
              monitoredSubreddits.map((subreddit, index) => (
                <div key={subreddit.name} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-success rounded-full" />
                    <div>
                      <div className="text-sm font-medium">{subreddit.name}</div>
                      <div className="text-xs text-muted-foreground">{subreddit.mentions} mentions</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent Mentions */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Recent Mentions</CardTitle>
                <div className="flex gap-2">
                  <Select value={selectedSubreddit} onValueChange={setSelectedSubreddit}>
                    <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Subreddits</SelectItem>
                      <SelectItem value="technology">r/technology</SelectItem>
                      <SelectItem value="startups">r/startups</SelectItem>
                      <SelectItem value="entrepreneur">r/entrepreneur</SelectItem>
                      <SelectItem value="saas">r/SaaS</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={sentimentFilter} onValueChange={setSentimentFilter}>
                    <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
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
            <CardContent className="space-y-3">
              {filteredMentions.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <p className="text-sm">No recent mentions found</p>
                </div>
              ) : (
                filteredMentions.map((mention) => (
                  <div key={mention.id} className="border rounded p-3 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {getStatusIcon(mention.status ?? "neutral")}
                          <Badge variant="outline" className="text-xs">{mention.subreddit}</Badge>
                          {getSentimentBadge(mention.sentiment, mention.status ?? "")}
                          <span className="text-xs text-muted-foreground">u/{mention.author ?? "anonymous"}</span>
                        </div>
                        <div className="text-sm font-medium mb-1">{mention.title}</div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-1">
                          <span>{mention.upvotes} upvotes</span>
                          <span>{mention.comments} comments</span>
                          <span>{mention.timeAgo}</span>
                        </div>
                        {mention.keywords && (
                          <div className="flex flex-wrap gap-1">
                            {mention.keywords.map((keyword: string, i: number) => (
                              <Badge key={i} variant="secondary" className="text-xs">{keyword}</Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-1 ml-3">
                        <Button variant="outline" size="sm">View</Button>
                        <Button variant={mention.status === "opportunity" ? "default" : "outline"} size="sm">
                          Engage
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SentimentMonitor;
