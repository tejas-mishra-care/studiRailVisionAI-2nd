"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ShieldCheck, BrainCircuit, History, AlertTriangle, Lightbulb, CheckCircle, GaugeCircle } from "lucide-react";
import { auditLogData as defaultAuditLogData, optimizationPlanData as defaultOptimizationPlanData } from "@/lib/data";

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
    if (active) {
      setStatusStep(0);
      const timer1 = setTimeout(() => setStatusStep(1), 1500);
      const timer2 = setTimeout(() => setStatusStep(2), 3000);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
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

export function AIPanel({ isLoading, predictionData, optimizationPlanData }: { isLoading: boolean, predictionData: any, optimizationPlanData: any }) {
  const [currentOptimizationPlan, setCurrentOptimizationPlan] = useState(defaultOptimizationPlanData);
  const [currentPrediction, setCurrentPrediction] = useState(null);
  const [isClientLoading, setIsClientLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsClientLoading(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (optimizationPlanData) {
      setCurrentOptimizationPlan(optimizationPlanData);
    }
  }, [optimizationPlanData]);

  useEffect(() => {
    if (predictionData) {
      setCurrentPrediction(predictionData);
    }
  }, [predictionData]);

  const finalIsLoading = isLoading || (isClientLoading && !predictionData && !optimizationPlanData);
  
  const optimizationPlan = optimizationPlanData || currentOptimizationPlan;

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
            {finalIsLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : (
              <div className="space-y-4">
                <SafetyShieldStatus active={!!optimizationPlanData} />
                {optimizationPlan && optimizationPlan.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Train</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Target</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Reasoning</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {optimizationPlan.map((plan: any) => {
                        const Icon = actionIcons[plan.action] || Lightbulb;
                        return (
                          <TableRow key={plan.train_id}>
                            <TableCell className="font-medium">{plan.train_id}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="flex items-center gap-1.5 w-fit">
                                <Icon className="h-3 w-3" />
                                {plan.action}
                              </Badge>
                            </TableCell>
                            <TableCell>{plan.target_node}</TableCell>
                            <TableCell>{plan.start_time}-{plan.end_time}</TableCell>
                            <TableCell>{plan.reasoning}</TableCell>
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
             {finalIsLoading && !currentPrediction ? (
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
