
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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

const REFRESH_INTERVAL_SECONDS = 900; // 15 minutes

// Helper to format scenario rules into a string for the AI
const formatScenarioForAI = (rules: ScenarioRule[], overrideText: string): string => {
  const ruleDescriptions = rules.map((rule, index) => {
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

  let combinedOverride = '';
  if (ruleDescriptions.length > 0) {
    combinedOverride += "Apply the following structured scenarios: " + ruleDescriptions.join(' ');
  }
  if (overrideText.trim()) {
    if (combinedOverride) combinedOverride += ' \nAdditionally, apply this manual override: ';
    combinedOverride += overrideText.trim();
  }
  return combinedOverride;
};

export default function Home() {
  const [prediction, setPrediction] = useState(null);
  const [optimization, setOptimization] = useState<OptimizeTrainRoutesOutput | null>(null);
  const [isLoading, setIsLoading] = useState<LoadingState>('live_data');
  const [activeOverride, setActiveOverride] = useState<string | null>(null);
  const [liveTrainData, setLiveTrainData] = useState<LiveTrainStatus[]>([]);
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL_SECONDS);
  const { toast } = useToast();
  const { station } = useStation();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchLiveTrainData = useCallback(async (isManualRefresh = false) => {
    // Don't show skeleton on background refresh, only on initial load or manual refresh
    if (liveTrainData.length === 0 || isManualRefresh) {
      setIsLoading('live_data');
    }

    try {
      const data = await getLiveStationStatus(station.code);
      setLiveTrainData(data);
      return data; // Return the data for immediate use
    } catch (error) {
      console.error("Error fetching live train data:", error);
      toast({
        title: "Live Data Failed",
        description: "Could not connect to the live railway data feed.",
        variant: "destructive",
      });
      setLiveTrainData([]);
      return []; // Return empty array on error
    } finally {
      setIsLoading(null);
      setCountdown(REFRESH_INTERVAL_SECONDS);
    }
  }, [toast, station.code, liveTrainData.length]);


  // Effect for the main countdown timer
  useEffect(() => {
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Set up the new timer
    timerRef.current = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          fetchLiveTrainData(); // This will also reset the countdown
          return REFRESH_INTERVAL_SECONDS;
        }
        return prevCountdown - 1;
      });
    }, 1000);

    // Cleanup on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [fetchLiveTrainData]); // Rerun when fetch function changes (e.g., station change)

  // Effect for initial data load and station changes
  useEffect(() => {
    setIsLoading('live_data'); // Always show loading on station change
    fetchLiveTrainData(true);
  }, [station.code]); // Removed fetchLiveTrainData from deps to avoid loop


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

  const handleRunOptimization = async (scenarioRules: ScenarioRule[], overrideText: string) => {
    setIsLoading('optimization');
    setOptimization(null);
    const combinedOverride = formatScenarioForAI(scenarioRules, overrideText);
    setActiveOverride(combinedOverride || null);
    try {
      // Refresh data right before running optimization and use the returned fresh data
      const freshTrainData = await fetchLiveTrainData(true);
      if (freshTrainData.length === 0) {
        toast({
          title: "Optimization Canceled",
          description: "Could not proceed without live train data.",
          variant: "destructive",
        });
        setIsLoading(null);
        return;
      }
      
      const result = await optimizeTrainRoutes({
        stationLayout: JSON.stringify(stationLayoutData),
        liveTrainStatuses: JSON.stringify(freshTrainData),
        manualOverride: combinedOverride,
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
                isLoading={isLoading === 'optimization'} 
                predictionData={prediction} 
                optimizationPlanData={optimization}
                manualOverride={activeOverride}
              />
            </div>
            <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
              <ControlPanel 
                onRunPrediction={handleRunPrediction}
                onRunOptimization={handleRunOptimization}
                onRefreshData={() => fetchLiveTrainData(true)}
                loadingState={isLoading}
                trainData={liveTrainData}
                countdown={countdown}
              />
              {isLoading === 'live_data' ? <Skeleton className="h-96 w-full" /> : <LiveStatusPanel trainData={liveTrainData} />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
