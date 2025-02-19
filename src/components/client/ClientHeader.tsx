
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tables } from "@/integrations/supabase/types";

type ClientHeaderProps = {
  client: Tables<"clients">;
};

export function ClientHeader({ client }: ClientHeaderProps) {
  return (
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
  );
}
