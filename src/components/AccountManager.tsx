import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  User, Shield, Clock, MessageCircle, 
  Settings, Plus, Eye, EyeOff, Activity
} from "lucide-react";

const AccountManager = () => {
  const accounts = [
    {
      id: 1,
      username: "helpful_dev_22",
      karma: 2847,
      accountAge: "2y 4m",
      status: "active",
      lastActivity: "2h ago",
      campaignsActive: 2,
      postsToday: 3,
      avgSentiment: 0.6,
      isVisible: true
    },
    {
      id: 2,
      username: "startup_advisor_pro",
      karma: 5621,
      accountAge: "3y 1m",
      status: "active",
      lastActivity: "45m ago",
      campaignsActive: 1,
      postsToday: 1,
      avgSentiment: 0.4,
      isVisible: true
    },
    {
      id: 3,
      username: "community_builder_89",
      karma: 1423,
      accountAge: "1y 8m",
      status: "cooldown",
      lastActivity: "1d ago",
      campaignsActive: 0,
      postsToday: 0,
      avgSentiment: 0.7,
      isVisible: false
    },
    {
      id: 4,
      username: "tech_solutions_help",
      karma: 892,
      accountAge: "11m",
      status: "active",
      lastActivity: "4h ago",
      campaignsActive: 1,
      postsToday: 2,
      avgSentiment: 0.5,
      isVisible: true
    },
    {
      id: 5,
      username: "industry_expert_insights",
      karma: 3156,
      accountAge: "2y 9m",
      status: "paused",
      lastActivity: "3d ago",
      campaignsActive: 0,
      postsToday: 0,
      avgSentiment: 0.8,
      isVisible: false
    }
  ];

  const getStatusColor = (status: string) => {
    if (status === "active") return "text-success";
    if (status === "cooldown") return "text-warning";
    if (status === "paused") return "text-muted-foreground";
    return "text-destructive";
  };

  const getStatusBadge = (status: string) => {
    if (status === "active") return <Badge variant="default" className="bg-success">Active</Badge>;
    if (status === "cooldown") return <Badge variant="outline" className="text-warning border-warning">Cooldown</Badge>;
    if (status === "paused") return <Badge variant="outline" className="text-muted-foreground border-muted">Paused</Badge>;
    return <Badge variant="destructive">Flagged</Badge>;
  };

  const getKarmaColor = (karma: number) => {
    if (karma >= 5000) return "text-success";
    if (karma >= 2000) return "text-primary";
    if (karma >= 1000) return "text-warning";
    return "text-muted-foreground";
  };

  return (
    <div className="space-y-6">
      {/* Account Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Accounts</p>
                <p className="text-2xl font-bold">5</p>
              </div>
              <User className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Accounts</p>
                <p className="text-2xl font-bold text-success">3</p>
              </div>
              <Activity className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Karma</p>
                <p className="text-2xl font-bold">13,939</p>
              </div>
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Posts Today</p>
                <p className="text-2xl font-bold">6</p>
              </div>
              <MessageCircle className="h-8 w-8 text-info" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Account Management */}
      <Card className="bg-gradient-card border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Account Management</CardTitle>
              <CardDescription>Monitor and control your Reddit accounts for outreach campaigns</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Account
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {accounts.map((account) => (
            <div key={account.id} className="border border-border/50 rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {account.isVisible ? (
                        <Eye className="h-4 w-4 text-success" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      )}
                      <h4 className="font-semibold text-sm">u/{account.username}</h4>
                    </div>
                    {getStatusBadge(account.status)}
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                    <div>
                      <p className="text-muted-foreground">Karma</p>
                      <p className={`font-medium ${getKarmaColor(account.karma)}`}>
                        {account.karma.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Account Age</p>
                      <p className="font-medium">{account.accountAge}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Active Campaigns</p>
                      <p className="font-medium">{account.campaignsActive}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Posts Today</p>
                      <p className="font-medium">{account.postsToday}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Last activity: {account.lastActivity}
                    </span>
                    <span className={`flex items-center gap-1 ${account.avgSentiment >= 0.5 ? 'text-success' : 'text-warning'}`}>
                      <Activity className="h-3 w-3" />
                      Avg sentiment: {account.avgSentiment.toFixed(1)}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <Button variant="ghost" size="sm">
                    <Settings className="h-3 w-3" />
                  </Button>
                  <Button 
                    variant={account.status === "active" ? "outline" : "default"} 
                    size="sm"
                  >
                    {account.status === "active" ? "Pause" : "Activate"}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Account Health</CardTitle>
            <CardDescription>Monitor account safety and compliance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-border/50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full" />
                <span className="text-sm">All accounts in good standing</span>
              </div>
              <Badge variant="outline" className="text-success border-success">Healthy</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border border-border/50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-warning rounded-full" />
                <span className="text-sm">1 account in cooldown period</span>
              </div>
              <Badge variant="outline" className="text-warning border-warning">Monitor</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border border-border/50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-muted-foreground rounded-full" />
                <span className="text-sm">Rate limits: Normal</span>
              </div>
              <Badge variant="outline">Normal</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
            <CardDescription>Common account management tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Shield className="h-4 w-4 mr-2" />
              Run Account Health Check
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Activity className="h-4 w-4 mr-2" />
              View Activity Logs
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Settings className="h-4 w-4 mr-2" />
              Configure Rate Limits
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Plus className="h-4 w-4 mr-2" />
              Bulk Import Accounts
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AccountManager;