import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertTriangle } from "lucide-react";
import type { LiveTrainStatus } from "@/lib/railway-api";

const getStatusVisuals = (status: string, delay: number) => {
  if (delay > 0) {
    return {
      Icon: Clock,
      color: "text-orange-500",
      text: `Delayed ${delay}m`,
      variant: "destructive" as const,
    };
  }
  if (status.toLowerCase().includes("halted")) {
     return {
      Icon: AlertTriangle,
      color: "text-red-500",
      text: "Halted",
      variant: "destructive" as const,
    };
  }
  if (status.toLowerCase().includes("cancelled")) {
     return {
      Icon: AlertTriangle,
      color: "text-red-500",
      text: "Cancelled",
      variant: "destructive" as const,
    };
  }
  return {
    Icon: CheckCircle,
    color: "text-green-500",
    text: "On Time",
    variant: "default" as const,
  };
};

export function LiveStatusPanel({ trainData }: { trainData: LiveTrainStatus[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Train Status</CardTitle>
        <CardDescription>Real-time updates from the network.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Train</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>ETA</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trainData.map((train) => {
              const { Icon, color, text, variant } = getStatusVisuals(train.status, train.delay_minutes);
              return (
                <TableRow key={train.id}>
                  <TableCell>
                    <div className="font-medium">{train.name}</div>
                    <div className="text-xs text-muted-foreground">{train.id}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={variant} className="bg-opacity-20 text-foreground border-opacity-30">
                      <Icon className={`mr-1 h-3 w-3 ${color}`} />
                      {text}
                    </Badge>
                  </TableCell>
                  <TableCell>{train.last_location}</TableCell>
                  <TableCell>{train.expected_time}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
