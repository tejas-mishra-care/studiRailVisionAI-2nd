import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrainFront, Signal, TrafficCone, MapPin } from "lucide-react";

export function Map() {
  // Simplified train positions for visual representation
  const trainPositions: { [key: string]: { x: number, y: number, color: string } } = {
    "12417": { x: 450, y: 195, color: "text-green-500" }, // On Platform 3
    "12002": { x: 180, y: 80, color: "text-orange-500" }, // Approaching
    "04408": { x: 750, y: 355, color: "text-blue-500" }, // On a siding/local line
    "FREIGHT-01": { x: 650, y: 45, color: "text-gray-600" }, // On yard line
    "12951": { x: 450, y: 145, color: "text-purple-500" }, // On Platform 2
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>NDLS Digital Twin</CardTitle>
        <Badge variant="secondary">Live</Badge>
      </CardHeader>
      <CardContent className="aspect-[2/1] w-full p-2 overflow-hidden rounded-lg bg-gray-800 dark:bg-gray-900">
        <svg width="100%" height="100%" viewBox="0 0 1000 500">
          {/* Background grid */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(200, 200, 200, 0.1)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Labels */}
          <text x="50" y="30" fill="#a3a3a3" fontSize="12">To Panipat (PNP)</text>
          <text x="50" y="470" fill="#a3a3a3" fontSize="12">To Ghaziabad (GZB)</text>
          <text x="900" y="30" fill="#a3a3a3" fontSize="12">To Rohtak (ROK)</text>
          <text x="880" y="470" fill="#a3a3a3" fontSize="12">To Mathura (MTJ)</text>

          {/* Main Lines */}
          <path d="M 0 100 H 1000" stroke="#737373" strokeWidth="4" />
          <path d="M 0 400 H 1000" stroke="#737373" strokeWidth="4" />

          {/* Yard/Siding Lines */}
          <path d="M 600 50 H 950" stroke="#525252" strokeWidth="2" />
          <path d="M 700 360 H 950" stroke="#525252" strokeWidth="2" />
          
          {/* Platforms */}
          {[1, 2, 3, 4, 5, 12, 16].map((p, i) => (
             <g key={`p-${p}`}>
                <rect x="300" y={120 + i * 25} width="400" height="15" rx="3" fill="#404040" />
                <text x="310" y={131 + i * 25} fill="#a3a3a3" fontSize="9">{`P${p}`}</text>
             </g>
          ))}

          {/* Tracks to Platforms */}
          <path d="M 150 100 C 225 100, 250 127, 300 127" fill="none" stroke="#525252" strokeWidth="2" />
          <path d="M 700 127 H 800 C 850 127, 900 100, 950 100" fill="none" stroke="#525252" strokeWidth="2" />
          
          <path d="M 150 400 C 225 400, 250 282, 300 282" fill="none" stroke="#525252" strokeWidth="2" />
          <path d="M 700 282 H 800 C 850 282, 900 400, 950 400" fill="none" stroke="#525252" strokeWidth="2" />

          {/* Crossovers */}
          <path d="M 200 100 C 350 100, 650 400, 800 400" fill="none" stroke="#525252" strokeDasharray="3 3" strokeWidth="1.5" />
          <path d="M 200 400 C 350 400, 650 100, 800 100" fill="none" stroke="#525252" strokeDasharray="3 3" strokeWidth="1.5" />

          {/* Signals */}
          <Signal x="140" y="80" className="text-green-500" />
          <Signal x="140" y="380" className="text-red-500" />
          <Signal x="810" y="80" className="text-red-500" />
          <Signal x="810" y="380" className="text-green-500" />

          {/* Trains */}
          {Object.entries(trainPositions).map(([id, pos]) => (
            <g key={id} transform={`translate(${pos.x} ${pos.y})`}>
              <TrainFront className={pos.color} />
              <text x="28" y="16" fill="#e5e5e5" fontSize="10" fontWeight="bold">{id}</text>
            </g>
          ))}

          {/* Maintenance Block */}
          <g transform="translate(500 240)" className="cursor-pointer">
            <TrafficCone className="text-yellow-500" />
            <text x="25" y="15" fill="#e5e5e5" fontSize="10">Maint.</text>
          </g>
        </svg>
      </CardContent>
    </Card>
  );
}
