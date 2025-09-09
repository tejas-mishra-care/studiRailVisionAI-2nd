
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadCloud, PlayCircle, BrainCircuit, Mic, FileWarning } from "lucide-react";
import { Textarea } from '@/components/ui/textarea';

type ControlPanelProps = {
  onRunPrediction: () => void;
  onRunOptimization: (manualOverride?: string) => void;
  loadingState: 'prediction' | 'optimization' | null;
};

export function ControlPanel({ onRunPrediction, onRunOptimization, loadingState }: ControlPanelProps) {
  const [overrideText, setOverrideText] = useState('');
  const isPredictionLoading = loadingState === 'prediction';
  const isOptimizationLoading = loadingState === 'optimization';
  const isAnyLoading = !!loadingState;

  const handleOptimizationClick = () => {
    onRunOptimization(overrideText);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Control Center</CardTitle>
        <CardDescription>Manual overrides and AI triggers.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium flex items-center gap-2"><FileWarning className="w-4 h-4" />Manual Override</h3>
          <p className="text-xs text-muted-foreground">
            Provide critical ad-hoc information to the AI (e.g., track maintenance, VIP movement).
          </p>
          <Textarea 
            placeholder="Example: 'Emergency maintenance on P4 until 09:00. No trains can be assigned there.'"
            className="text-xs"
            value={overrideText}
            onChange={(e) => setOverrideText(e.target.value)}
            disabled={isAnyLoading}
          />
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-medium">AI Actions</h3>
          <Button className="w-full justify-start gap-2 bg-primary/90 hover:bg-primary" onClick={onRunPrediction} disabled={isAnyLoading}>
            <BrainCircuit />
            {isPredictionLoading ? "Running Prediction..." : "Run Traffic Prediction"}
          </Button>
          <Button className="w-full justify-start gap-2" onClick={handleOptimizationClick} disabled={isAnyLoading}>
            <PlayCircle />
            {isOptimizationLoading ? "Optimizing Routes..." : "Optimize All Routes"}
          </Button>
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Data Management</h3>
          <Button variant="outline" className="w-full justify-start gap-2" disabled={isAnyLoading}>
            <UploadCloud />
            Import Static Data
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
