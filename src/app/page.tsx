
"use client";

import { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/dashboard/header";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Map } from "@/components/dashboard/map";
import { ControlPanel, ScenarioRule } from "@/components/dashboard/control-panel";
import { LiveStatusPanel } from "@/components/dashboard/live-status-panel";
import { AIPanel } from "@/components/dashboard/ai-panel";
import { predictFutureTraffic } from "@/ai/flows/predict-future-traffic";
import { optimizeTrainRoutes, OptimizeTrainRoutesOutput } from "@/ai/flows/optimize-train-routes";
import { stationLayoutData } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { getLiveStationStatus, LiveTrainStatus } from "@/lib/railway-api";
import { Skeleton } from "@/components/ui/skeleton";
import { useStation } from "@/context/station-context";

type LoadingState = 'prediction' | 'optimization' | 'live_data' | null;

// Helper to format scenario rules into a string for the AI
const formatScenarioForAI = (rules: ScenarioRule[]): string => {
  if (rules.length === 0) return '';
  const descriptions = rules.map((rule, index) => {
    let desc = `${index + 1}. Rule Type: ${rule.type}. `;
    switch (rule.type) {
      case 'PLATFORM_CLOSURE':
        desc += `Platform ${rule.details.platform} is closed from ${rule.details.startTime} to ${rule.details.endTime}.`;
        break;
      case 'ADD_DELAY':
        desc += `Train ${rule.details.trainId} is delayed by an additional ${rule.details.delayMinutes} minutes.`;
        break;
      case 'PRIORITIZE_TRAIN':
        desc += `Train ${rule.details.trainId} must be given top priority.`;
        break;
    }
    return desc;
  });
  return "Apply the following operational scenarios: " + descriptions.join(' ');
};

export default function Home() {
  const [prediction, setPrediction] = useState(null);
  const [optimization, setOptimization] = useState<OptimizeTrainRoutesOutput | null>(null);
  const [isLoading, setIsLoading] = useState<LoadingState>('live_data');
  const [activeOverride, setActiveOverride] = useState<string | null>(null);
  const [liveTrainData, setLiveTrainData] = useState<LiveTrainStatus[]>([]);
  const { toast } = useToast();
  const { station } = useStation();

  const fetchLiveTrainData = useCallback(async () => {
    setIsLoading('live_data');
    try {
      const data = await getLiveStationStatus(station.code);
      setLiveTrainData(data);
    } catch (error) {
      console.error("Error fetching live train data:", error);
      toast({
        title: "Live Data Failed",
        description: "Could not connect to the live railway data feed.",
        variant: "destructive",
      });
      // Fallback to empty array if API fails
      setLiveTrainData([]);
    } finally {
      setIsLoading(null);
    }
  }, [toast, station.code]);

  useEffect(() => {
    fetchLiveTrainData(); // Initial fetch
    const interval = setInterval(fetchLiveTrainData, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval); // Cleanup on unmount
  }, [fetchLiveTrainData]);

  const handleRunPrediction = async () => {
    setIsLoading('prediction');
    setPrediction(null);
    try {
      const result = await predictFutureTraffic({
        stationLayout: JSON.stringify(stationLayoutData),
        liveTrainStatuses: JSON.stringify(liveTrainData),
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

  const handleRunOptimization = async (scenarioRules: ScenarioRule[]) => {
    setIsLoading('optimization');
    setOptimization(null);
    const overrideText = formatScenarioForAI(scenarioRules);
    setActiveOverride(overrideText || null);
    try {
      const result = await optimizeTrainRoutes({
        stationLayout: JSON.stringify(stationLayoutData),
        liveTrainStatuses: JSON.stringify(liveTrainData),
        manualOverride: overrideText,
      });
      setOptimization(result);
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
              {isLoading === 'live_data' ? <Skeleton className="aspect-[2/1] w-full" /> : <Map trainData={liveTrainData} />}
              <AIPanel 
                isLoading={isLoading === 'optimization' || isLoading === 'prediction'} 
                predictionData={prediction} 
                optimizationPlanData={optimization}
                manualOverride={activeOverride}
              />
            </div>
            <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
              <ControlPanel 
                onRunPrediction={handleRunPrediction}
                onRunOptimization={handleRunOptimization}
                onRefreshData={fetchLiveTrainData}
                loadingState={isLoading}
                trainData={liveTrainData}
              />
              {isLoading === 'live_data' ? <Skeleton className="h-96 w-full" /> : <LiveStatusPanel trainData={liveTrainData} />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
