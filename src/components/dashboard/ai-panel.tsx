"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ShieldCheck, BrainCircuit, History, AlertTriangle, Lightbulb, CheckCircle } from "lucide-react";
import { predictionData, optimizationPlanData, auditLogData } from "@/lib/data";

function SafetyShieldStatus() {
  const [statusStep, setStatusStep] = useState(0);
  const statuses = [
    { text: "Generating Plan...", icon: BrainCircuit, color: "text-blue-500" },
    { text: "Safety Shield Validation...", icon: ShieldCheck, color: "text-yellow-500" },
    { text: "Plan Ready & Verified", icon: CheckCircle, color: "text-green-500" },
  ];

  useEffect(() => {
    setStatusStep(0);
    const timer1 = setTimeout(() => setStatusStep(1), 1500);
    const timer2 = setTimeout(() => setStatusStep(2), 3000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

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

export function AIPanel() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 3500);
    return () => clearTimeout(timer);
  }, []);

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
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : (
              <div className="space-y-4">
                <SafetyShieldStatus />
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Train</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Target</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {optimizationPlanData.map((plan) => (
                      <TableRow key={plan.trainId}>
                        <TableCell className="font-medium">{plan.trainId}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="flex items-center gap-1.5 w-fit">
                            <plan.icon className="h-3 w-3" />
                            {plan.action}
                          </Badge>
                        </TableCell>
                        <TableCell>{plan.target}</TableCell>
                        <TableCell>{plan.time}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="prediction" className="mt-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Potential Conflicts Detected</AlertTitle>
              <AlertDescription>
                <ul className="list-disc pl-5 mt-2">
                  {predictionData.conflicts.map(c => <li key={c.id}>{c.description}</li>)}
                </ul>
              </AlertDescription>
            </Alert>
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
                {auditLogData.map((log) => (
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
