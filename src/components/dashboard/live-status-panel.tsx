import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { trainData } from "@/lib/data";

export function LiveStatusPanel() {
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
            {trainData.map((train) => (
              <TableRow key={train.id}>
                <TableCell>
                  <div className="font-medium">{train.name}</div>
                  <div className="text-xs text-muted-foreground">{train.id}</div>
                </TableCell>
                <TableCell>
                  <Badge variant={train.status === 'Delayed' || train.status === 'Halted' ? 'destructive' : 'default'} className="bg-opacity-20 text-foreground border-opacity-30">
                    <train.statusIcon className={`mr-1 h-3 w-3 ${train.statusColor}`} />
                    {train.status}
                  </Badge>
                </TableCell>
                <TableCell>{train.location}</TableCell>
                <TableCell>{train.eta}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
