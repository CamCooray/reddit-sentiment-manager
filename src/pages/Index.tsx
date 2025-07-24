import Header from "@/components/Header";
import SentimentMonitor from "@/components/SentimentMonitor";
import OutreachDashboard from "@/components/OutreachDashboard";
import AccountManager from "@/components/AccountManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">GTM Reddit Operations</h1>
          <p className="text-muted-foreground">
            Monitor sentiment, manage outreach campaigns, and track engagement across Reddit
          </p>
        </div>

        <Tabs defaultValue="monitor" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="monitor">Sentiment Monitor</TabsTrigger>
            <TabsTrigger value="outreach">Active Campaigns</TabsTrigger>
            <TabsTrigger value="accounts">Account Manager</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="monitor" className="space-y-6">
            <SentimentMonitor />
          </TabsContent>

          <TabsContent value="outreach" className="space-y-6">
            <OutreachDashboard />
          </TabsContent>

          <TabsContent value="accounts" className="space-y-6">
            <AccountManager />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2">Analytics Dashboard</h3>
              <p className="text-muted-foreground">Campaign performance and ROI tracking coming soon</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;