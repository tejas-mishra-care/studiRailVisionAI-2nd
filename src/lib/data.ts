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
    length_coaches: 22,
    scheduled_halts: [{ "station": "HIJ", "platform": 2, "duration": 5 }]
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
    length_coaches: 16,
    scheduled_halts: []
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
    length_coaches: 50,
    scheduled_halts: []
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
    length_coaches: 45,
    scheduled_halts: []
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

export const optimizationPlanData = [
    { train_id: "22895", action: "ASSIGN", target_node: "Platform 1 via T3, T5", start_time: "10:48", end_time: "10:55", reasoning: "Prioritized due to high-speed category." },
    { train_id: "08471", action: "HOLD", target_node: "Siding 1", start_time: "10:48", end_time: "10:55", reasoning: "Waiting for Vande Bharat to clear crossover." },
    { train_id: "12859", action: "PROCEED", target_node: "Depart on schedule", start_time: "10:50", end_time: "10:51", reasoning: "Path is clear, proceeding as scheduled." },
];

export type OptimizationPlan = (typeof optimizationPlanData)[0];

export const stationLayoutData = {
  "nodes": [
    {"node_id": "ENTRY_A", "type": "ENTRY"},
    {"node_id": "P1", "type": "PLATFORM", "length": 500},
    {"node_id": "P2", "type": "PLATFORM", "length": 600},
    {"node_id": "S1", "type": "SIDELINE"},
    {"node_id": "EXIT_B", "type": "EXIT"}
  ],
  "tracks": [
    {"track_id": "T1", "from": "ENTRY_A", "to": "P1"},
    {"track_id": "T2", "from": "ENTRY_A", "to": "P2"},
    {"track_id": "T3", "from": "P1", "to": "S1"},
    {"track_id": "T4", "from": "P2", "to": "EXIT_B"},
    {"track_id": "T5", "from": "S1", "to": "EXIT_B"}
  ]
};
