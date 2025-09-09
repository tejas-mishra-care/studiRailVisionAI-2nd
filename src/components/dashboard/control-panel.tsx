import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadCloud, PlayCircle, BrainCircuit } from "lucide-react";

type ControlPanelProps = {
  onRunPrediction: () => void;
  onRunOptimization: () => void;
  loadingState: 'prediction' | 'optimization' | null;
};

export function ControlPanel({ onRunPrediction, onRunOptimization, loadingState }: ControlPanelProps) {
  const isPredictionLoading = loadingState === 'prediction';
  const isOptimizationLoading = loadingState === 'optimization';
  const isAnyLoading = !!loadingState;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Control Center</CardTitle>
        <CardDescription>Manual overrides and AI triggers.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Data Management</h3>
          <Button variant="outline" className="w-full justify-start gap-2" disabled={isAnyLoading}>
            <UploadCloud />
            Import Static Data
          </Button>
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-medium">AI Actions</h3>
          <Button className="w-full justify-start gap-2 bg-primary/90 hover:bg-primary" onClick={onRunPrediction} disabled={isAnyLoading}>
            <BrainCircuit />
            {isPredictionLoading ? "Running Prediction..." : "Run Traffic Prediction"}
          </Button>
          <Button className="w-full justify-start gap-2" onClick={onRunOptimization} disabled={isAnyLoading}>
            <PlayCircle />
            {isOptimizationLoading ? "Optimizing Routes..." : "Optimize All Routes"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
