
import { Users, MessagesSquare, Activity, Plus, List } from "lucide-react";
import { StatCard } from "@/components/metrics/StatCard";
import { ActivityItem } from "@/components/activity/ActivityItem";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const recentActivity = [
  {
    client: "Client X",
    action: "added Google Drive link",
    date: new Date("2024-03-19T10:00:00"),
  },
  {
    client: "Client Y",
    action: "updated widget settings",
    date: new Date("2024-03-19T09:30:00"),
  },
  {
    client: "Client Z",
    action: "created account",
    date: new Date("2024-03-19T09:00:00"),
  },
  {
    client: "Client A",
    action: "added URL",
    date: new Date("2024-03-19T08:30:00"),
  },
  {
    client: "Client B",
    action: "updated AI Agent Name",
    date: new Date("2024-03-19T08:00:00"),
  },
];

const Index = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-in">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">AI Chatbot Admin System</h1>
        <div className="flex gap-4">
          <Button className="shadow-sm">
            <Plus className="mr-2 h-4 w-4" /> Add New Client
          </Button>
          <Button variant="outline" className="shadow-sm">
            <List className="mr-2 h-4 w-4" /> View Client List
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Clients"
          value="1,234"
          icon={<Users className="h-4 w-4" />}
        />
        <StatCard
          title="Active Clients"
          value="892"
          subtitle="Last 48 hours"
          icon={<Activity className="h-4 w-4" />}
        />
        <StatCard
          title="Avg. Interactions"
          value="45.2"
          subtitle="Per client"
          icon={<MessagesSquare className="h-4 w-4" />}
        />
        <StatCard
          title="Total Interactions"
          value="56,789"
          subtitle="All time"
          icon={<Activity className="h-4 w-4" />}
        />
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Recent Activity</h2>
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </div>
        <div className="divide-y">
          {recentActivity.map((activity, index) => (
            <ActivityItem key={index} {...activity} />
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Index;
