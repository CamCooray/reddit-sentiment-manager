import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  TrendingUp, TrendingDown, MessageCircle, ExternalLink,
  Clock, AlertTriangle, CheckCircle, Users
} from "lucide-react";

// Type for backend response
interface RecentMentionsResponse {
  posts: any[];
  average_sentiment: number;
}

const SentimentMonitor = () => {
  const [selectedSubreddit, setSelectedSubreddit] = useState("all");
  const [sentimentFilter, setSentimentFilter] = useState("all");
  const [flaggedIds, setFlaggedIds] = useState<string[]>([]);
  const [showFlaggedOnly, setShowFlaggedOnly] = useState(false);
  const [opportunityFilter, setOpportunityFilter] = useState(false);
  const [subredditInput, setSubredditInput] = useState("");
  const [manualSubreddits, setManualSubreddits] = useState<string[]>([]);
  // State for monitored subreddits from backend
  const [backendSubreddits, setBackendSubreddits] = useState<string[]>([]);

  // State for keywords management
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");

  const recentMentionsQuery = useQuery<RecentMentionsResponse>({
    queryKey: ["recentMentions"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:8000/recent-mentions");
      return res.data as RecentMentionsResponse;
    },
    staleTime: 1000 * 60 * 5,
  });
  const recentMentions = recentMentionsQuery.data?.posts ?? [];
  const average_sentiment = recentMentionsQuery.data?.average_sentiment ?? 0;
  const isLoading = recentMentionsQuery.isLoading;
  const error = recentMentionsQuery.error;

  // Fetch flagged IDs from backend
  useEffect(() => {
    axios.get<string[]>("http://localhost:8000/flagged")
      .then(res => setFlaggedIds(res.data))
      .catch(() => setFlaggedIds([]));
  }, []);

  // Compute monitored subreddits dynamically from recentMentions
  const computedMonitoredSubreddits = Object.values(
    recentMentions.reduce((acc, mention) => {
      const name = mention.subreddit;
      if (!acc[name]) {
        acc[name] = { name, mentions: 0 };
      }
      acc[name].mentions += 1;
      return acc;
    }, {} as Record<string, { name: string; mentions: number }>)
  ) as Array<{ name: string; mentions: number }>;

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
    const subredditMatches =
      selectedSubreddit === "all" ||
      mention.subreddit.toLowerCase() === `r/${selectedSubreddit}`.toLowerCase();
    const sentimentMatches =
      sentimentFilter === "all" || mention.sentiment === sentimentFilter;
    return subredditMatches && sentimentMatches;
  });

  // Reset selectedSubreddit to 'all' if it's not present in monitoredSubreddits
  if (
    selectedSubreddit !== "all" &&
    !computedMonitoredSubreddits.some(sub => sub.name.toLowerCase() === `r/${selectedSubreddit}`.toLowerCase())
  ) {
    setSelectedSubreddit("all");
  }

  // Function to flag a post
  const flagPost = async (id: string) => {
    await axios.post("http://localhost:8000/flag", { id });
    setFlaggedIds(prev => [...prev, id]);
  };

  // Function to unflag a post
  const unflagPost = async (id: string) => {
    await axios.post("http://localhost:8000/unflag", { id });
    setFlaggedIds(prev => prev.filter(flaggedId => flaggedId !== id));
  };

  // Add subreddit to backend
  async function addSubredditToBackend(subreddit: string) {
    try {
      const response = await fetch('http://localhost:8000/monitored-subreddits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subreddit }),
      });
      return await response.json();
    } catch (err) {
      return { success: false, error: 'Network error' };
    }
  }

  // Remove subreddit from backend
  async function removeSubredditFromBackend(subreddit: string) {
    try {
      const response = await fetch(`http://localhost:8000/monitored-subreddits/${subreddit.replace(/^r\//i, "")}`, {
        method: 'DELETE',
      });
      return await response.json();
    } catch (err) {
      return { success: false, error: 'Network error' };
    }
  }

  // Fetch monitored subreddits from backend on mount and after add/remove
  const fetchMonitoredSubreddits = async () => {
    try {
      const res = await fetch('http://localhost:8000/monitored-subreddits');
      const data = await res.json();
      setBackendSubreddits(data);
    } catch {
      setBackendSubreddits([]);
    }
  };

  // Fetch monitored subreddits on component mount
  useEffect(() => {
    fetchMonitoredSubreddits();
  }, []);

  // Keywords management functions
  const fetchKeywords = async () => {
    try {
      const res = await fetch('http://localhost:8000/keywords');
      const data = await res.json();
      setKeywords(data);
    } catch (error) {
      console.error('Failed to fetch keywords:', error);
    }
  };

  const addKeywordToBackend = async (keyword: string) => {
    try {
      const response = await fetch('http://localhost:8000/keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword }),
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  const removeKeywordFromBackend = async (keyword: string) => {
    try {
      const response = await fetch(`http://localhost:8000/keywords/${encodeURIComponent(keyword)}`, {
        method: 'DELETE',
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  // Fetch keywords on component mount
  useEffect(() => {
    fetchKeywords();
  }, []);

  const handleAddSubreddit = async () => {
    const sub = subredditInput.trim();
    if (sub && !backendSubreddits.includes(sub)) {
      const result = await addSubredditToBackend(sub);
      if (result.success) {
        setSubredditInput("");
        recentMentionsQuery.refetch(); // Refetch mentions after adding
        fetchMonitoredSubreddits(); // Refetch backend subreddits
      } else {
        alert(result.error || 'Failed to add subreddit');
      }
    }
  };

  const handleRemoveSubreddit = async (subreddit: string) => {
    const result = await removeSubredditFromBackend(subreddit);
    if (result.success) {
      recentMentionsQuery.refetch(); // Refetch mentions after removing
      fetchMonitoredSubreddits(); // Refetch backend subreddits
    } else {
      alert(result.error || 'Failed to remove subreddit');
    }
  };

  const handleAddKeyword = async () => {
    const keyword = keywordInput.trim();
    if (keyword && !keywords.includes(keyword)) {
      const result = await addKeywordToBackend(keyword);
      if (result.success) {
        setKeywordInput("");
        // Update local state immediately to prevent flicker
        setKeywords(prev => [...prev, keyword]);
        // Refetch mentions after adding keyword
        recentMentionsQuery.refetch();
      } else {
        alert(result.error || 'Failed to add keyword');
      }
    }
  };

  const handleRemoveKeyword = async (keyword: string) => {
    const result = await removeKeywordFromBackend(keyword);
    if (result.success) {
      // Update local state immediately to prevent flicker
      setKeywords(prev => prev.filter(k => k !== keyword));
      // Refetch mentions after removing keyword
      recentMentionsQuery.refetch();
    } else {
      alert(result.error || 'Failed to remove keyword');
    }
  };

  // Only use backend subreddits for display, with mention counts
  const allMonitoredSubreddits = backendSubreddits.map(sub => {
    const subredditName = `r/${sub.replace(/^r\//i, "")}`;
    const mentions = recentMentions.filter(m => m.subreddit.toLowerCase() === subredditName.toLowerCase()).length;
    return { name: subredditName, mentions };
  });

  return (
    <div className="space-y-6 bg-gray-900 min-h-screen text-white">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><div className="text-center"><div className="text-2xl font-semibold">{recentMentions.length}</div><div className="text-sm text-muted-foreground">Total Mentions</div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-center"><div className="text-2xl font-semibold text-destructive">{flaggedIds.length}</div><div className="text-sm text-muted-foreground">Flagged</div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-center"><div className="text-2xl font-semibold text-success">{recentMentions.filter(m => m.status === "opportunity").length}</div><div className="text-sm text-muted-foreground">Opportunities</div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-center"><div className="text-2xl font-semibold">{average_sentiment}</div><div className="text-sm text-muted-foreground">Avg Sentiment</div></div></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Monitored Subreddits and Keywords */}
        <div className="space-y-6">
          {/* Monitored Subreddits */}
          <Card>
            <CardHeader><CardTitle className="text-base">Monitored Subreddits</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <div className="flex gap-2 mb-4">
                <input
                  className="border rounded px-2 py-1 w-full bg-gray-800 text-white placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary"
                  placeholder="Add subreddit (e.g. SaaS)"
                  value={subredditInput}
                  onChange={e => setSubredditInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") handleAddSubreddit(); }}
                />
                <Button variant="default" onClick={handleAddSubreddit}>Add</Button>
              </div>
              {allMonitoredSubreddits.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <p className="text-sm">No subreddits being monitored</p>
                </div>
              ) : (
                allMonitoredSubreddits.map((subreddit, index) => (
                  <div key={subreddit.name} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-success rounded-full" />
                      <div>
                        <div className="text-sm font-medium">{subreddit.name}</div>
                        <div className="text-xs text-muted-foreground">{subreddit.mentions} mentions</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleRemoveSubreddit(subreddit.name)}>
                      Remove
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Keywords Management */}
          <Card>
            <CardHeader><CardTitle className="text-base">Search Keywords</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <div className="flex gap-2 mb-4">
                <input
                  className="border rounded px-2 py-1 w-full bg-gray-800 text-white placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary"
                  placeholder="Add keyword (e.g. payment)"
                  value={keywordInput}
                  onChange={e => setKeywordInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") handleAddKeyword(); }}
                />
                <Button variant="default" onClick={handleAddKeyword}>Add</Button>
              </div>
              {keywords.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <p className="text-sm">No keywords configured</p>
                </div>
              ) : (
                keywords.map((keyword, index) => (
                  <div key={keyword} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <div>
                        <div className="text-sm font-medium">{keyword}</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleRemoveKeyword(keyword)}>
                      Remove
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Mentions */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Recent Mentions</CardTitle>
                <div className="flex gap-2 items-center">
                  <Select value={selectedSubreddit} onValueChange={setSelectedSubreddit}>
                    <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Subreddits</SelectItem>
                      {computedMonitoredSubreddits.map(subreddit => {
                        const value = subreddit.name.replace(/^r\//i, "");
                        return (
                          <SelectItem key={subreddit.name} value={value}>{subreddit.name}</SelectItem>
                        );
                      })}
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
                  <div className="flex items-center gap-1 px-2 py-1 border rounded bg-muted">
                    <input
                      type="checkbox"
                      checked={showFlaggedOnly}
                      onChange={e => setShowFlaggedOnly(e.target.checked)}
                      className="accent-destructive"
                    />
                    <span className="text-xs">Show Flagged Only</span>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 border rounded bg-muted">
                    <input
                      type="checkbox"
                      checked={opportunityFilter}
                      onChange={e => setOpportunityFilter(e.target.checked)}
                      className="accent-success"
                    />
                    <span className="text-xs">Show Opportunities Only</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {(showFlaggedOnly
                ? filteredMentions.filter(m => flaggedIds.includes(m.id))
                : opportunityFilter
                  ? filteredMentions.filter(m => m.status === "opportunity")
                  : filteredMentions
              ).length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <p className="text-sm">No recent mentions found</p>
                </div>
              ) : (
                (showFlaggedOnly
                  ? filteredMentions.filter(m => flaggedIds.includes(m.id))
                  : opportunityFilter
                    ? filteredMentions.filter(m => m.status === "opportunity")
                    : filteredMentions
                ).map((mention) => (
                  <div key={mention.id} className="border rounded p-3 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {getStatusIcon(mention.status ?? "neutral")}
                          <Badge variant="outline" className="text-xs">{mention.subreddit}</Badge>
                          {getSentimentBadge(mention.sentiment, mention.status ?? "")}
                          <span className="text-xs text-muted-foreground">u/{mention.author ?? "anonymous"}</span>
                          <span className="text-xs text-[#00ADEF]">{mention.sentiment} ({mention.score})</span>
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
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <a href={mention.url} target="_blank" rel="noopener noreferrer">View</a>
                        </Button>
                        <Button
                          variant={flaggedIds.includes(mention.id) ? "outline" : "destructive"}
                          size="sm"
                          onClick={() => flaggedIds.includes(mention.id) ? unflagPost(mention.id) : flagPost(mention.id)}
                        >
                          {flaggedIds.includes(mention.id) ? "Unflag" : "Flag"}
                        </Button>
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
