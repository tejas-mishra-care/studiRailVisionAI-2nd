import type { LucideIcon } from "lucide-react";
import { GaugeCircle, AlertTriangle, CheckCircle, Clock } from "lucide-react";

export const trainData = [
  {
    id: "12859",
    name: "Gitanjali Express",
    type: "Express",
    status: "On Time",
    statusIcon: CheckCircle,
    statusColor: "text-green-500",
    location: "Track 4",
    destination: "Platform 2",
    eta: "10:45",
  },
  {
    id: "22895",
    name: "Vande Bharat",
    type: "High-Speed",
    status: "Delayed",
    statusIcon: Clock,
    statusColor: "text-orange-500",
    location: "Approach J2",
    destination: "Platform 1",
    eta: "10:55",
  },
  {
    id: "08471",
    name: "Goods Freight",
    type: "Freight",
    status: "On Time",
    statusIcon: CheckCircle,
    statusColor: "text-green-500",
    location: "Siding 1",
    destination: "Yard",
    eta: "11:10",
  },
  {
    id: "SHM-LTT-SPL",
    name: "Special Cargo",
    type: "Freight",
    status: "Halted",
    statusIcon: AlertTriangle,
    statusColor: "text-red-500",
    location: "Signal S5",
    destination: "Platform 4",
    eta: "N/A",
  },
];

export type Train = (typeof trainData)[0];

export const auditLogData = [
    { id: 1, timestamp: "10:42:15", user: "System", event: "AI optimization request received." },
    { id: 2, timestamp: "10:42:18", user: "SafetyShield", event: "Plan for 22895 validated: OK." },
    { id: 3, timestamp: "10:42:19", user: "AI Engine", event: "Route optimized for Vande Bharat (22895) to P1." },
    { id: 4, timestamp: "10:42:25", user: "Controller", event: "Plan for 22895 approved and executed." },
    { id: 5, timestamp: "10:43:01", user: "System", event: "Traffic prediction model updated." },
];

export type AuditLog = (typeof auditLogData)[0];

export const predictionData = {
    conflicts: [
        { id: 1, type: "Crossing", severity: "Medium", time: "10:52", description: "Train 22895 path conflicts with 08471 departure." },
        { id: 2, type: "Platform", severity: "Low", time: "11:05", description: "Platform 2 occupancy close to limit." },
    ],
    estimatedArrivals: [
        { trainId: "22895", newEta: "10:58", reason: "Conflict resolution delay" },
        { trainId: "08471", newEta: "11:12", reason: "Waiting for platform clearance" },
    ]
};

export type Prediction = typeof predictionData;

export const optimizationPlanData = [
    { trainId: "22895", action: "ASSIGN", target: "Platform 1 via T3, T5", time: "10:48", icon: GaugeCircle },
    { trainId: "08471", action: "HOLD", target: "Siding 1 until 10:55", time: "10:48", icon: AlertTriangle },
    { trainId: "12859", action: "PROCEED", target: "Depart on schedule", time: "10:50", icon: CheckCircle },
];

export type OptimizationPlan = (typeof optimizationPlanData)[0];
