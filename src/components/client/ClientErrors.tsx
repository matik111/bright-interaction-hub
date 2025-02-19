
import { AlertTriangle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Tables } from "@/integrations/supabase/types";

type ClientErrorsProps = {
  errors: Tables<"error_logs">[];
};

export function ClientErrors({ errors }: ClientErrorsProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Error Logs</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        {errors?.length === 0 ? (
          <p className="text-sm text-muted-foreground">No errors reported</p>
        ) : (
          <div className="space-y-4">
            {errors?.map((log) => (
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
  );
}
