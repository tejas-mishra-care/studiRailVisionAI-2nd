import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadCloud, PlayCircle, BrainCircuit } from "lucide-react";

type ControlPanelProps = {
  onRunPrediction: () => void;
  onRunOptimization: () => void;
  isLoading: boolean;
};

export function ControlPanel({ onRunPrediction, onRunOptimization, isLoading }: ControlPanelProps) {
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
          <Button className="w-full justify-start gap-2 bg-primary/90 hover:bg-primary" onClick={onRunPrediction} disabled={isLoading}>
            <BrainCircuit />
            {isLoading ? "Running..." : "Run Traffic Prediction"}
          </Button>
          <Button className="w-full justify-start gap-2" onClick={onRunOptimization} disabled={isLoading}>
            <PlayCircle />
            {isLoading ? "Running..." : "Optimize All Routes"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
