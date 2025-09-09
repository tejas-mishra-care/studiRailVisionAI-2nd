"use client";

import { useState } from "react";
import { Header } from "@/components/dashboard/header";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Map } from "@/components/dashboard/map";
import { ControlPanel } from "@/components/dashboard/control-panel";
import { LiveStatusPanel } from "@/components/dashboard/live-status-panel";
import { AIPanel } from "@/components/dashboard/ai-panel";
import { predictFutureTraffic } from "@/ai/flows/predict-future-traffic";
import { optimizeTrainRoutes } from "@/ai/flows/optimize-train-routes";
import { stationLayoutData, trainData as liveTrainStatuses } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";

type LoadingState = 'prediction' | 'optimization' | null;

export default function Home() {
  const [prediction, setPrediction] = useState(null);
  const [optimization, setOptimization] = useState(null);
  const [isLoading, setIsLoading] = useState<LoadingState>(null);
  const { toast } = useToast();

  const handleRunPrediction = async () => {
    setIsLoading('prediction');
    setPrediction(null);
    try {
      const result = await predictFutureTraffic({
        stationLayout: JSON.stringify(stationLayoutData),
        liveTrainStatuses: JSON.stringify(liveTrainStatuses),
      });
      const parsedResult = JSON.parse(result.predictedTrafficConditions);
      setPrediction(parsedResult);
    } catch (error) {
      console.error("Error running prediction:", error);
      toast({
        title: "Prediction Failed",
        description: "Could not run the traffic prediction model.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(null);
    }
  };

  const handleRunOptimization = async () => {
    setIsLoading('optimization');
    setOptimization(null);
    try {
      const result = await optimizeTrainRoutes({
        stationLayout: JSON.stringify(stationLayoutData),
        liveTrainStatuses: JSON.stringify(liveTrainStatuses),
      });
      const parsedResult = JSON.parse(result);
      setOptimization(parsedResult);
    } catch (error) {
      console.error("Error running optimization:", error);
      toast({
        title: "Optimization Failed",
        description: "Could not run the route optimization model.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(null);
    }
  };


  return (
    <div className="flex h-screen w-full bg-background text-foreground">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
              <Map />
              <AIPanel isLoading={!!isLoading} predictionData={prediction} optimizationPlanData={optimization} />
            </div>
            <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
              <ControlPanel 
                onRunPrediction={handleRunPrediction}
                onRunOptimization={handleRunOptimization}
                loadingState={isLoading}
              />
              <LiveStatusPanel />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
