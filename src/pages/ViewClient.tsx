
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ClientHeader } from "@/components/client/ClientHeader";
import { ClientActivity } from "@/components/client/ClientActivity";
import { ClientQueries } from "@/components/client/ClientQueries";
import { ClientErrors } from "@/components/client/ClientErrors";

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
        <ClientHeader client={client} />
        <ClientActivity activities={activities ?? []} />
        <ClientQueries queries={commonQueries ?? []} />
        <ClientErrors errors={errorLogs ?? []} />
      </div>
    </div>
  );
}
