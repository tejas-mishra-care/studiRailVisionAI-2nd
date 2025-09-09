import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrainFront, Signal, TrafficCone } from "lucide-react";

export function Map() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Station Digital Twin</CardTitle>
        <Badge variant="secondary">Live</Badge>
      </CardHeader>
      <CardContent className="aspect-[2/1] w-full p-2 overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-800">
        <svg width="100%" height="100%" viewBox="0 0 800 400">
          {/* Background grid */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(200, 200, 200, 0.3)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Main Tracks */}
          <path d="M 50 100 H 750" stroke="#a3a3a3" strokeWidth="4" />
          <path d="M 50 300 H 750" stroke="#a3a3a3" strokeWidth="4" />

          {/* Platform Tracks and Platforms */}
          <path d="M 150 150 C 200 100, 250 100, 300 100" fill="none" stroke="#a3a3a3" strokeWidth="2" />
          <rect x="250" y="130" width="300" height="20" rx="5" fill="#d4d4d4" />
          <text x="400" y="145" textAnchor="middle" fill="#525252" fontSize="12">P1</text>
          
          <path d="M 150 250 C 200 300, 250 300, 300 300" fill="none" stroke="#a3a3a3" strokeWidth="2" />
          <rect x="250" y="250" width="300" height="20" rx="5" fill="#d4d4d4" />
          <text x="400" y="265" textAnchor="middle" fill="#525252" fontSize="12">P2</text>

          <path d="M 600 100 C 650 100, 700 150, 750 150" fill="none" stroke="#a3a3a3" strokeWidth="2" />
          <path d="M 600 300 C 650 300, 700 250, 750 250" fill="none" stroke="#a3a3a3" strokeWidth="2" />

          {/* Signals */}
          <Signal x="120" y="80" className="text-green-500" />
          <Signal x="120" y="280" className="text-green-500" />
          <Signal x="760" y="80" className="text-red-500" />
          <Signal x="760" y="280" className="text-red-500" />

          {/* Trains */}
          <g transform="translate(200 80)">
             <TrainFront className="text-primary" />
             <text x="25" y="15" fill="hsl(var(--primary))" fontSize="10" fontWeight="bold">12859</text>
          </g>

          <g transform="translate(680 280)">
             <TrainFront className="text-orange-500" />
             <text x="25" y="15" fill="hsl(var(--primary))" fontSize="10" fontWeight="bold">22895</text>
          </g>
          
          <g transform="translate(450 280)">
             <TrainFront className="text-gray-600" />
             <text x="25" y="15" fill="hsl(var(--primary))" fontSize="10" fontWeight="bold">08471</text>
          </g>

          {/* Maintenance Block */}
          <g transform="translate(500 80)" className="cursor-pointer">
            <TrafficCone className="text-yellow-600" />
            <text x="25" y="15" fill="hsl(var(--primary))" fontSize="10">Maint.</text>
          </g>
        </svg>
      </CardContent>
    </Card>
  );
}
