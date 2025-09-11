
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle, BrainCircuit, X, RefreshCw, PlusCircle, Train, Ban, Star, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LiveTrainStatus } from '@/lib/railway-api';
import { Textarea } from '@/components/ui/textarea';

export type ScenarioRule = {
  id: string;
  type: 'PLATFORM_CLOSURE' | 'ADD_DELAY' | 'PRIORITIZE_TRAIN';
  details: any;
};

type ControlPanelProps = {
  onRunPrediction: () => void;
  onRunOptimization: (rules: ScenarioRule[], overrideText: string) => void;
  onRefreshData: () => void;
  loadingState: 'prediction' | 'optimization' | 'live_data' | null;
  trainData: LiveTrainStatus[];
  countdown: number;
};

function AddRuleDialog({ onAddRule, trains }: { onAddRule: (rule: ScenarioRule) => void, trains: LiveTrainStatus[] }) {
  const [ruleType, setRuleType] = useState('');
  const [platform, setPlatform] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [trainId, setTrainId] = useState('');
  const [delayMinutes, setDelayMinutes] = useState('');

  const handleAdd = () => {
    let newRule: Omit<ScenarioRule, 'id'> | null = null;
    if (ruleType === 'PLATFORM_CLOSURE') {
      newRule = { type: 'PLATFORM_CLOSURE', details: { platform, startTime, endTime } };
    } else if (ruleType === 'ADD_DELAY') {
      newRule = { type: 'ADD_DELAY', details: { trainId, delayMinutes: parseInt(delayMinutes) } };
    } else if (ruleType === 'PRIORITIZE_TRAIN') {
      newRule = { type: 'PRIORITIZE_TRAIN', details: { trainId } };
    }

    if (newRule) {
      onAddRule({ ...newRule, id: Date.now().toString() });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full justify-start gap-2">
          <PlusCircle />
          Add Scenario Rule
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Scenario Rule</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Rule Type</Label>
            <Select onValueChange={setRuleType} value={ruleType}>
              <SelectTrigger>
                <SelectValue placeholder="Select a rule type..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PLATFORM_CLOSURE">Close a Platform</SelectItem>
                <SelectItem value="ADD_DELAY">Add Delay to Train</SelectItem>
                <SelectItem value="PRIORITIZE_TRAIN">Prioritize a Train</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {ruleType === 'PLATFORM_CLOSURE' && (
            <div className="space-y-2">
              <Label>Platform Number</Label>
              <Input placeholder="e.g., P4" value={platform} onChange={(e) => setPlatform(e.target.value)} />
              <Label>Start Time (HH:MM)</Label>
              <Input placeholder="e.g., 09:00" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
              <Label>End Time (HH:MM)</Label>
              <Input placeholder="e.g., 11:30" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
            </div>
          )}
          {ruleType === 'ADD_DELAY' && (
             <div className="space-y-2">
              <Label>Train</Label>
               <Select onValueChange={setTrainId} value={trainId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a train..." />
                </SelectTrigger>
                <SelectContent>
                  {trains.map(t => <SelectItem key={t.id} value={t.id}>{t.name} ({t.id})</SelectItem>)}
                </SelectContent>
              </Select>
              <Label>Additional Delay (minutes)</Label>
              <Input type="number" placeholder="e.g., 30" value={delayMinutes} onChange={(e) => setDelayMinutes(e.target.value)} />
            </div>
          )}
          {ruleType === 'PRIORITIZE_TRAIN' && (
             <div className="space-y-2">
              <Label>Train to Prioritize</Label>
               <Select onValueChange={setTrainId} value={trainId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a train..." />
                </SelectTrigger>
                <SelectContent>
                  {trains.map(t => <SelectItem key={t.id} value={t.id}>{t.name} ({t.id})</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <Button onClick={handleAdd} disabled={!ruleType}>Add Rule</Button>
      </DialogContent>
    </Dialog>
  )
}

const ruleIcons = {
  PLATFORM_CLOSURE: <Ban className="text-red-500" />,
  ADD_DELAY: <Clock className="text-orange-500" />,
  PRIORITIZE_TRAIN: <Star className="text-yellow-500" />,
};

const getRuleDescription = (rule: ScenarioRule): string => {
  switch (rule.type) {
    case 'PLATFORM_CLOSURE':
      return `Platform ${rule.details.platform} closed (${rule.details.startTime} - ${rule.details.endTime})`;
    case 'ADD_DELAY':
      return `Delay ${rule.details.trainId} by ${rule.details.delayMinutes} min`;
    case 'PRIORITIZE_TRAIN':
      return `Prioritize ${rule.details.trainId}`;
    default:
      return 'Unknown rule';
  }
};


export function ControlPanel({ onRunPrediction, onRunOptimization, onRefreshData, loadingState, trainData, countdown }: ControlPanelProps) {
  const [scenarioRules, setScenarioRules] = useState<ScenarioRule[]>([]);
  const [overrideText, setOverrideText] = useState('');
  
  const isPredictionLoading = loadingState === 'prediction';
  const isOptimizationLoading = loadingState === 'optimization';
  const isDataLoading = loadingState === 'live_data';
  const isAnyLoading = !!loadingState;

  const handleOptimizationClick = () => {
    onRunOptimization(scenarioRules, overrideText);
  };
  
  const addRule = (rule: ScenarioRule) => {
    setScenarioRules(prev => [...prev, rule]);
  };
  
  const removeRule = (id: string) => {
    setScenarioRules(prev => prev.filter(rule => rule.id !== id));
  }

  const formatCountdown = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Control Center</CardTitle>
        <CardDescription>Live data refresh and AI scenario triggers.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm font-medium">
            <h3>Data Management</h3>
            <span className="text-muted-foreground text-xs">Next refresh in: {formatCountdown(countdown)}</span>
          </div>
          <Button variant="outline" className="w-full justify-start gap-2" onClick={onRefreshData} disabled={isAnyLoading}>
            <RefreshCw className={isDataLoading ? "animate-spin" : ""} />
            {isDataLoading ? "Refreshing Live Data..." : "Refresh Live Data Now"}
          </Button>
        </div>
        
        <div className="space-y-3">
           <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium flex items-center gap-2">Scenario Builder</h3>
            {scenarioRules.length > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setScenarioRules([])} className="flex items-center gap-1 text-xs h-auto px-2 py-1">
                <X className="w-3 h-3" />
                Clear Rules
              </Button>
            )}
          </div>
          <div className="space-y-2">
            {scenarioRules.map(rule => (
               <div key={rule.id} className="flex items-center justify-between p-2 rounded-md bg-secondary text-secondary-foreground text-xs">
                 <div className="flex items-center gap-2">
                  {ruleIcons[rule.type]}
                  <span>{getRuleDescription(rule)}</span>
                 </div>
                 <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeRule(rule.id)}>
                   <X className="w-3 h-3" />
                 </Button>
               </div>
            ))}
             <AddRuleDialog onAddRule={addRule} trains={trainData} />
          </div>
        </div>

        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Manual Override</h3>
                {overrideText && (
                    <Button variant="ghost" size="sm" onClick={() => setOverrideText('')} className="flex items-center gap-1 text-xs h-auto px-2 py-1">
                        <X className="w-3 h-3" />
                        Clear
                    </Button>
                )}
            </div>
            <Textarea 
                placeholder="Enter any specific, overriding instructions for the AI. E.g., 'VIP movement on Line 3, clear all traffic.'"
                value={overrideText}
                onChange={(e) => setOverrideText(e.target.value)}
                rows={3}
            />
        </div>

        <div className="space-y-2 pt-2">
          <h3 className="text-sm font-medium">AI Actions</h3>
          <Button className="w-full justify-start gap-2" onClick={handleOptimizationClick} disabled={isAnyLoading}>
            <PlayCircle />
            {isOptimizationLoading ? "Optimizing Routes..." : "Optimize All Routes"}
          </Button>
          <Button className="w-full justify-start gap-2 bg-primary/90 hover:bg-primary" onClick={onRunPrediction} disabled={isAnyLoading}>
            <BrainCircuit />
            {isPredictionLoading ? "Running Prediction..." : "Run Traffic Prediction"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
