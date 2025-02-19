
import { MessageSquare } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tables } from "@/integrations/supabase/types";

type ClientQueriesProps = {
  queries: Tables<"common_queries">[];
};

export function ClientQueries({ queries }: ClientQueriesProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Common Queries</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        {queries?.length === 0 ? (
          <p className="text-sm text-muted-foreground">No common queries yet</p>
        ) : (
          <div className="space-y-4">
            {queries?.map((query) => (
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
  );
}
