
import { Activity } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Tables } from "@/integrations/supabase/types";

type ClientActivityProps = {
  activities: Tables<"client_activities">[];
};

export function ClientActivity({ activities }: ClientActivityProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Recent Activity</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        {activities?.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recent activity</p>
        ) : (
          <div className="space-y-4">
            {activities?.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4">
                <Activity className="h-4 w-4 text-muted-foreground mt-1" />
                <div>
                  <p className="text-sm">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(activity.created_at), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
