import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadCloud, PlayCircle, BrainCircuit } from "lucide-react";

export function ControlPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Control Center</CardTitle>
        <CardDescription>Manual overrides and AI triggers.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Data Management</h3>
          <Button variant="outline" className="w-full justify-start gap-2">
            <UploadCloud />
            Import Static Data
          </Button>
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-medium">AI Actions</h3>
          <Button className="w-full justify-start gap-2 bg-primary/90 hover:bg-primary">
            <BrainCircuit />
            Run Traffic Prediction
          </Button>
          <Button className="w-full justify-start gap-2">
            <PlayCircle />
            Optimize All Routes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
