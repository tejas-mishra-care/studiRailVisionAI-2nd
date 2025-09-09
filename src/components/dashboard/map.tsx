import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrainFront, Signal, TrafficCone, MapPin } from "lucide-react";
import { trainData } from "@/lib/data";

export function Map() {
  
  const platformYPosition = (platformNumber: number): number => {
    if (platformNumber === 1) return 120;
    if (platformNumber >= 2 && platformNumber <= 15) {
      const islandIndex = Math.floor((platformNumber - 2) / 2);
      const yBase = 155 + islandIndex * 35;
      return platformNumber % 2 === 0 ? yBase : yBase + 15;
    }
    if (platformNumber === 16) return 155 + 7 * 35; // Position P16 below the last island.
    return 0;
  }

  const trainPositions: { [key: string]: { x: number, y: number, color: string } } = {
    "12417": { x: 450, y: platformYPosition(3) - 10, color: "text-green-500" }, 
    "12002": { x: 180, y: 80, color: "text-orange-500" }, 
    "04408": { x: 450, y: platformYPosition(12) - 10, color: "text-blue-500" },
    "FREIGHT-01": { x: 650, y: 45, color: "text-gray-600" },
    "12951": { x: 450, y: platformYPosition(2) - 10, color: "text-purple-500" }, 
    "22435": { x: 800, y: platformYPosition(16) - 10, color: "text-yellow-400"},
    "12302": { x: 450, y: platformYPosition(9) - 10, color: "text-indigo-400"},
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
          <text x="50" y="30" fill="#a3a3a3" fontSize="12">To Panipat / West</text>
          <text x="50" y="470" fill="#a3a3a3" fontSize="12">To Ghaziabad / East</text>
          <text x="850" y="30" fill="#a3a3a3" fontSize="12">Paharganj Side (Entry)</text>
          <text x="850" y="470" fill="#a3a3a3" fontSize="12">Ajmeri Gate Side (Entry)</text>
          <text x="450" y="30" fill="#a3a3a3" fontSize="12">Washing/Stabling Lines</text>
          
          {/* Main Through Lines */}
          <path d="M 0 100 H 1000" stroke="#737373" strokeWidth="4" />
          <path d="M 0 400 H 1000" stroke="#737373" strokeWidth="4" />
          
          {/* Yard/Siding Lines */}
          <path d="M 300 50 H 700" stroke="#525252" strokeWidth="2" />
          <path d="M 300 70 H 700" stroke="#525252" strokeWidth="2" />

          {/* Platforms */}
          {/* Platform 1 (Side Platform) */}
          <g>
            <rect x="250" y={platformYPosition(1)} width="500" height="15" rx="3" fill="#404040" />
            <text x="260" y={platformYPosition(1) + 11} fill="#a3a3a3" fontSize="9">P1</text>
          </g>

          {/* Island Platforms 2-15 */}
          {Array.from({ length: 7 }).map((_, i) => {
              const p_even = 2 + i * 2;
              const p_odd = 3 + i * 2;
              const y_base = 155 + i * 35;
              return (
                <g key={`island-${i}`}>
                  <rect x="250" y={y_base} width="500" height="30" rx="3" fill="#404040" />
                  <line x1="250" y1={y_base+15} x2="750" y2={y_base+15} stroke="#303030" strokeWidth="1" />
                  <text x="260" y={y_base + 11} fill="#a3a3a3" fontSize="9">{`P${p_even}`}</text>
                  <text x="260" y={y_base + 26} fill="#a3a3a3" fontSize="9">{`P${p_odd}`}</text>
                </g>
              )
          })}

          {/* Platform 16 (Side Platform) */}
          <g>
            <rect x="250" y={platformYPosition(16)} width="500" height="15" rx="3" fill="#404040" />
            <text x="260" y={platformYPosition(16) + 11} fill="#a3a3a3" fontSize="9">P16</text>
          </g>
          
          {/* Tracks to Platforms */}
          <path d="M 150 100 C 200 100, 225 120, 250 120" fill="none" stroke="#525252" strokeWidth="2" />
          <path d="M 750 120 H 800 C 850 120, 900 100, 950 100" fill="none" stroke="#525252" strokeWidth="2" />
          
          <path d="M 150 400 C 200 400, 225 390, 250 390" fill="none" stroke="#525252" strokeWidth="2" />
          <path d="M 750 390 H 800 C 850 390, 900 400, 950 400" fill="none" stroke="#525252" strokeWidth="2" />
          
          {/* Crossovers */}
          <path d="M 200 100 C 350 100, 650 400, 800 400" fill="none" stroke="#525252" strokeDasharray="3 3" strokeWidth="1.5" />
          <path d="M 200 400 C 350 400, 650 100, 800 100" fill="none" stroke="#525252" strokeDasharray="3 3" strokeWidth="1.5" />
          <path d="M 175 100 L 225 155" fill="none" stroke="#525252" strokeWidth="1.5" />
          <path d="M 175 400 L 225 350" fill="none" stroke="#525252" strokeWidth="1.5" />
          <path d="M 775 155 L 825 100" fill="none" stroke="#525252" strokeWidth="1.5" />
          <path d="M 775 350 L 825 400" fill="none" stroke="#525252" strokeWidth="1.5" />


          {/* Signals */}
          <Signal x="140" y="80" className="text-green-500" />
          <Signal x="140" y="380" className="text-red-500" />
          <Signal x="810" y="80" className="text-red-500" />
          <Signal x="810" y="380" className="text-green-500" />
          
          {/* Dynamic Train Positions */}
          {Object.entries(trainPositions).map(([id, pos]) => (
            <g key={id} transform={`translate(${pos.x} ${pos.y})`}>
              <TrainFront className={pos.color} />
              <text x="28" y="16" fill="#e5e5e5" fontSize="10" fontWeight="bold">{id}</text>
            </g>
          ))}

          {/* Maintenance Block */}
          <g transform="translate(500, 320)" className="cursor-pointer">
            <TrafficCone className="text-yellow-500" />
            <text x="25" y="15" fill="#e5e5e5" fontSize="10">Maint.</text>
          </g>
        </svg>
      </CardContent>
    </Card>
  );
}
