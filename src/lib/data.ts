import type { LucideIcon } from "lucide-react";
import { GaugeCircle, AlertTriangle, CheckCircle, Clock } from "lucide-react";

export const trainData = [
  {
    id: "12417",
    name: "Prayagraj Express",
    type: "Express",
    status: "On Time",
    statusIcon: CheckCircle,
    statusColor: "text-green-500",
    location: "Ghaziabad Jn.",
    destination: "NDLS P-3",
    eta: "07:00",
    length_coaches: 24,
    scheduled_halts: [{ station: "NDLS", platform: 3, duration: 15 }]
  },
  {
    id: "12002",
    name: "Shatabdi Express",
    type: "High-Speed",
    status: "Delayed",
    statusIcon: Clock,
    statusColor: "text-orange-500",
    location: "Panipat Jn.",
    destination: "NDLS P-1",
    eta: "07:15",
    length_coaches: 18,
    scheduled_halts: []
  },
  {
    id: "04408",
    name: "NZM-GZB MEMU",
    type: "Local",
    status: "On Time",
    statusIcon: CheckCircle,
    statusColor: "text-green-500",
    location: "Anand Vihar",
    destination: "NDLS P-12",
    eta: "07:05",
    length_coaches: 12,
    scheduled_halts: []
  },
  {
    id: "FREIGHT-01",
    name: "Container Goods",
    type: "Freight",
    status: "Halted",
    statusIcon: AlertTriangle,
    statusColor: "text-red-500",
    location: "Yard Line 5",
    destination: "Tughlakabad",
    eta: "N/A",
    length_coaches: 60,
    scheduled_halts: []
  },
  {
    id: "12951",
    name: "Mumbai Rajdhani",
    type: "Express",
    status: "On Time",
    statusIcon: CheckCircle,
    statusColor: "text-green-500",
    location: "Approaching Outer Signal",
    destination: "NDLS P-2",
    eta: "08:30",
    length_coaches: 22,
    scheduled_halts: [{ station: "NDLS", platform: 2, duration: 20 }]
  }
];

export type Train = (typeof trainData)[0];

export const auditLogData = [
    { id: 1, timestamp: "06:55:10", user: "System", event: "AI optimization requested for morning peak hour." },
    { id: 2, timestamp: "06:55:12", user: "AI Engine", event: "Analyzing 5 active trains and 16 platforms." },
    { id: 3, timestamp: "06:55:15", user: "SafetyShield", event: "Conflict check for 12002 (Shatabdi) vs 04408 (MEMU) on crossover C1." },
    { id: 4, timestamp: "06:55:18", user: "AI Engine", event: "Generated conflict-free plan for 5 trains." },
    { id: 5, timestamp: "06:56:05", user: "Controller", event: "Plan for Prayagraj Express (12417) approved and executed." },
    { id: 6, timestamp: "06:57:00", user: "System", event: "Real-time traffic data refreshed." },
];


export type AuditLog = (typeof auditLogData)[0];

export const optimizationPlanData: OptimizationPlan[] = [];

export type OptimizationPlan = {
  train_id: string;
  action: "ASSIGN" | "HOLD" | "PROCEED";
  target_node: string;
  start_time: string;
  end_time: string;
  reasoning: string;
};

export const stationLayoutData = {
  "nodes": [
    {"node_id": "ENTRY_GZB", "type": "ENTRY"},
    {"node_id": "ENTRY_PNP", "type": "ENTRY"},
    {"node_id": "P1", "type": "PLATFORM", "length": 450},
    {"node_id": "P2", "type": "PLATFORM", "length": 650},
    {"node_id": "P3", "type": "PLATFORM", "length": 650},
    {"node_id": "P4", "type": "PLATFORM", "length": 650},
    {"node_id": "P12", "type": "PLATFORM", "length": 300},
    {"node_id": "S1", "type": "SIDELINE"},
    {"node_id": "S2", "type": "SIDELINE"},
    {"node_id": "YARD1", "type": "YARD"},
    {"node_id": "EXIT_MTJ", "type": "EXIT"},
    {"node_id": "EXIT_ROK", "type": "EXIT"}
  ],
  "tracks": [
    {"track_id": "T1A", "from": "ENTRY_PNP", "to": "P1"},
    {"track_id": "T1B", "from": "ENTRY_PNP", "to": "P2"},
    {"track_id": "T2A", "from": "ENTRY_GZB", "to": "P3"},
    {"track_id": "T2B", "from": "ENTRY_GZB", "to": "P4"},
    {"track_id": "T2C", "from": "ENTRY_GZB", "to": "P12"},
    {"track_id": "T3", "from": "P1", "to": "S1"},
    {"track_id": "T4", "from": "P2", "to": "S1"},
    {"track_id": "T5", "from": "P3", "to": "S2"},
    {"track_id": "T6", "from": "P4", "to": "S2"},
    {"track_id": "T7", "from": "S1", "to": "YARD1"},
    {"track_id": "T8", "from": "S2", "to": "EXIT_MTJ"},
    {"track_id": "T9", "from": "YARD1", "to": "EXIT_ROK"},
    {"track_id": "T10_CROSS", "from": "S1", "to": "S2"}
  ]
};
