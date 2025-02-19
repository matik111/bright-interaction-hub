
import { formatDistanceToNow } from "date-fns";

interface ActivityItemProps {
  client: string;
  action: string;
  date: Date;
}

export function ActivityItem({ client, action, date }: ActivityItemProps) {
  return (
    <div className="flex items-center py-3 border-b last:border-0">
      <div className="flex-1">
        <p className="text-sm">
          <span className="font-medium">{client}</span> {action}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {formatDistanceToNow(date, { addSuffix: true })}
        </p>
      </div>
    </div>
  );
}
