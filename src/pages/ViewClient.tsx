
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Activity, MessageSquare, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";

export default function ViewClient() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: client, isLoading: isLoadingClient } = useQuery({
    queryKey: ["client", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: activities } = useQuery({
    queryKey: ["client-activities", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("client_activities")
        .select("*")
        .eq("client_id", id)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
  });

  const { data: commonQueries } = useQuery({
    queryKey: ["common-queries", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("common_queries")
        .select("*")
        .eq("client_id", id)
        .order("frequency", { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
  });

  const { data: errorLogs } = useQuery({
    queryKey: ["error-logs", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("error_logs")
        .select("*")
        .eq("client_id", id)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
  });

  if (isLoadingClient) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!client) {
    return <div className="container mx-auto px-4 py-8">Client not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate("/clients")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Clients
      </Button>

      <div className="grid gap-6">
        {/* Client Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{client.name}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {client.email}
                </p>
              </div>
              <Badge variant={client.status === "active" ? "default" : "secondary"}>
                {client.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4">
            {client.company && (
              <div>
                <h4 className="text-sm font-medium">Company</h4>
                <p>{client.company}</p>
              </div>
            )}
            {client.website && (
              <div>
                <h4 className="text-sm font-medium">Website</h4>
                <a
                  href={client.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {client.website}
                </a>
              </div>
            )}
            <div>
              <h4 className="text-sm font-medium">AI Agent Name</h4>
              <p>{client.agent_name}</p>
            </div>
            {client.description && (
              <div>
                <h4 className="text-sm font-medium">Description</h4>
                <p>{client.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
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

        {/* Common Queries */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Common Queries</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            {commonQueries?.length === 0 ? (
              <p className="text-sm text-muted-foreground">No common queries yet</p>
            ) : (
              <div className="space-y-4">
                {commonQueries?.map((query) => (
                  <div key={query.id} className="flex items-start gap-4">
                    <MessageSquare className="h-4 w-4 text-muted-foreground mt-1" />
                    <div>
                      <p className="text-sm">{query.query_text}</p>
                      <p className="text-xs text-muted-foreground">
                        Asked {query.frequency} times
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Error Logs */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Error Logs</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            {errorLogs?.length === 0 ? (
              <p className="text-sm text-muted-foreground">No errors reported</p>
            ) : (
              <div className="space-y-4">
                {errorLogs?.map((log) => (
                  <div key={log.id} className="flex items-start gap-4">
                    <AlertTriangle className="h-4 w-4 text-destructive mt-1" />
                    <div>
                      <p className="text-sm font-medium">{log.error_type}</p>
                      <p className="text-sm">{log.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(log.created_at), {
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
      </div>
    </div>
  );
}
