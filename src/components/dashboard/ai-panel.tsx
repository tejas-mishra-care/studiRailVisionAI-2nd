
"use client";

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ShieldCheck, BrainCircuit, History, AlertTriangle, Lightbulb, CheckCircle, GaugeCircle, Clock, FileWarning } from "lucide-react";
import { auditLogData as defaultAuditLogData } from "@/lib/data";
import { OptimizeTrainRoutesOutput } from '@/ai/flows/optimize-train-routes';

const actionIcons: { [key: string]: React.ElementType } = {
  ASSIGN: GaugeCircle,
  HOLD: AlertTriangle,
  PROCEED: CheckCircle,
};


function SafetyShieldStatus({ active }: { active: boolean }) {
  const [statusStep, setStatusStep] = useState(0);
  const statuses = [
    { text: "Generating Plan...", icon: BrainCircuit, color: "text-blue-500" },
    { text: "Safety Shield Validation...", icon: ShieldCheck, color: "text-yellow-500" },
    { text: "Plan Ready & Verified", icon: CheckCircle, color: "text-green-500" },
  ];

  useEffect(() => {
    let timer1: NodeJS.Timeout, timer2: NodeJS.Timeout;
    if (active) {
      setStatusStep(0);
      timer1 = setTimeout(() => setStatusStep(1), 1500);
      timer2 = setTimeout(() => setStatusStep(2), 3000);
    }
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [active]);
  
  if (!active) return null;

  return (
    <div className="flex items-center space-x-2 rounded-lg bg-secondary p-3">
      {statuses.map((status, index) => (
        <div key={index} className={`flex items-center gap-2 text-sm font-medium ${index <= statusStep ? 'opacity-100' : 'opacity-40'}`}>
          <status.icon className={`h-5 w-5 ${status.color}`} />
          <span>{status.text}</span>
          {index < statuses.length - 1 && <div className="h-0.5 w-8 bg-border rounded-full" />}
        </div>
      ))}
    </div>
  );
}

export function AIPanel({ isLoading, predictionData, optimizationPlanData, manualOverride }: { isLoading: boolean, predictionData: any, optimizationPlanData: OptimizeTrainRoutesOutput | null, manualOverride: string | null }) {
  const [currentPrediction, setCurrentPrediction] = useState(null);

  useEffect(() => {
    if (predictionData) {
      setCurrentPrediction(predictionData);
    }
  }, [predictionData]);

  const sortedOptimizationPlan = useMemo(() => {
    if (!optimizationPlanData) return [];
    // Ensure we have a fresh copy to sort
    const planToSort = JSON.parse(JSON.stringify(optimizationPlanData));
    return planToSort.sort((a: any, b: any) => a.start_time.localeCompare(b.start_time));
  }, [optimizationPlanData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Operations Console</CardTitle>
        <CardDescription>
          Analysis, predictions, and optimized action plans from the AI engine.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="optimization">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="optimization">
              <Lightbulb className="mr-2 h-4 w-4" /> Optimization
            </TabsTrigger>
            <TabsTrigger value="prediction">
              <BrainCircuit className="mr-2 h-4 w-4" /> Prediction
            </TabsTrigger>
            <TabsTrigger value="audit">
              <History className="mr-2 h-4 w-4" /> Audit Trail
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="optimization" className="mt-4">
            {isLoading ? (
              <div className="space-y-4">
                <SafetyShieldStatus active={true} />
                <Skeleton className="h-48 w-full" />
              </div>
            ) : (
              <div className="space-y-4">
                {manualOverride && (
                  <Alert variant="destructive" className="bg-yellow-50 border-yellow-300 text-yellow-800 [&>svg]:text-yellow-600">
                    <FileWarning className="h-4 w-4" />
                    <AlertTitle>Manual Override Active</AlertTitle>
                    <AlertDescription>
                     The current plan incorporates the following instruction: "{manualOverride}"
                    </AlertDescription>
                  </Alert>
                )}
                
                {sortedOptimizationPlan && sortedOptimizationPlan.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Time</TableHead>
                        <TableHead>Train</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Target</TableHead>
                        <TableHead>Impact</TableHead>
                        <TableHead className="w-[40%]">Reasoning</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedOptimizationPlan.map((plan: any, index: number) => {
                        const Icon = actionIcons[plan.action] || Lightbulb;
                        const hasDelay = plan.delay_impact_minutes > 0;
                        return (
                          <TableRow key={`${plan.train_id}-${plan.start_time}-${index}`}>
                            <TableCell className="font-mono text-xs">{plan.start_time}-{plan.end_time}</TableCell>
                            <TableCell className="font-medium">{plan.train_id}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="flex items-center gap-1.5 w-fit">
                                <Icon className="h-3 w-3" />
                                {plan.action}
                              </Badge>
                            </TableCell>
                            <TableCell>{plan.target_node}</TableCell>
                             <TableCell>
                              {hasDelay ? (
                                <Badge variant="destructive" className="flex items-center gap-1.5 w-fit bg-orange-500/20 text-orange-700">
                                  <Clock className="h-3 w-3" />
                                  {plan.delay_impact_minutes} min
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className="flex items-center gap-1.5 w-fit bg-green-500/10 text-green-700">
                                   <CheckCircle className="h-3 w-3" />
                                  On Time
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-xs">{plan.reasoning}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                ) : (
                   <div className="text-center py-8 text-muted-foreground">
                    <p>No optimization plan generated yet.</p>
                    <p className="text-sm">Click "Optimize All Routes" to generate a plan.</p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="prediction" className="mt-4">
             {isLoading && !currentPrediction ? (
                <Skeleton className="h-24 w-full" />
             ) : currentPrediction && (currentPrediction as any).conflicts.length > 0 ? (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Potential Conflicts Detected</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc pl-5 mt-2">
                    {(currentPrediction as any).conflicts.map((c: any, index: number) => <li key={index}>{c.description}</li>)}
                  </ul>
                </AlertDescription>
              </Alert>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No predictions available.</p>
                <p className="text-sm">Click "Run Traffic Prediction" to generate predictions.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="audit" className="mt-4">
             <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Event</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {defaultAuditLogData.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-xs">{log.timestamp}</TableCell>
                    <TableCell>
                      <Badge variant={log.user === 'SafetyShield' ? 'default' : 'secondary'} className={log.user === 'SafetyShield' ? 'bg-green-500/20 text-green-700' : ''}>
                        {log.user}
                      </Badge>
                    </TableCell>
                    <TableCell>{log.event}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
