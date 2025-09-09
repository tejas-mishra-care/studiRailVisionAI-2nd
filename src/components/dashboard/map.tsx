"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrainFront, Signal, TrafficCone, ArrowRight, ArrowLeft } from "lucide-react";
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

  // A helper to place trains on the map based on their status
  const getTrainPosition = (train: typeof trainData[0]): { x: number, y: number, color: string, direction: 'in' | 'out' | 'none', destinationText: string } => {
    const defaultPosition = { x: 50, y: 50, color: "text-gray-400", direction: 'none', destinationText: train.destination };
    const platformMatch = train.destination.match(/NDLS P-(\d+)/);
    const locationMatch = train.location.match(/NDLS P-(\d+)/);

    if (train.location.includes("Departed")) {
       const departedPlatform = parseInt(locationMatch?.[1] || '16', 10);
       return { x: 800, y: platformYPosition(departedPlatform) - 10, color: "text-green-500", direction: 'out', destinationText: `To ${train.destination}` };
    }
    if (train.location.includes("Approaching")) {
       return { x: 180, y: 80, color: "text-orange-500", direction: 'in', destinationText: `To ${train.destination}` };
    }
    if (train.location.includes("Yard")) {
       return { x: 650, y: 45, color: "text-gray-500", direction: 'none', destinationText: "Yard/Stabling" };
    }
    if (locationMatch) { // Train is AT a platform
        const platformNumber = parseInt(locationMatch[1], 10);
        return { x: 450, y: platformYPosition(platformNumber) - 10, color: "text-blue-500", direction: 'none', destinationText: `At P-${platformNumber}` };
    }
     if (platformMatch) { // Train is assigned to a platform but not there yet
      const platformNumber = parseInt(platformMatch[1], 10);
      return { x: 250, y: platformYPosition(platformNumber) - 10, color: "text-yellow-500", direction: 'in', destinationText: `To P-${platformNumber}` };
    }
    
    return defaultPosition;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>NDLS Digital Twin</CardTitle>
          <CardDescription>Live operational map of New Delhi Railway Station</CardDescription>
        </div>
        <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-300">
          <span className="relative flex h-2 w-2 mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          Live Feed
        </Badge>
      </CardHeader>
      <CardContent className="aspect-[2/1] w-full p-2 overflow-hidden rounded-lg bg-gray-800 dark:bg-gray-900">
        <svg width="100%" height="100%" viewBox="0 0 1000 500">
          {/* Background grid */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(200, 200, 200, 0.1)" strokeWidth="0.5"/>
            </pattern>
             <marker id="arrow-incoming" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="3" markerHeight="3" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#a3a3a3" />
            </marker>
             <marker id="arrow-outgoing" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="3" markerHeight="3" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#a3a3a3" />
            </marker>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Labels */}
          <text x="50" y="30" fill="#a3a3a3" fontSize="12">To Panipat / West</text>
          <text x="50" y="470" fill="#a3a3a3" fontSize="12">To Ghaziabad / East</text>
          <text x="850" y="30" fill="#a3a3a3" fontSize="12">Paharganj Side (Entry)</text>
          <text x="850" y="470" fill="#a3a3a3" fontSize="12">Ajmeri Gate Side (Entry)</text>
          <text x="450" y="30" fill="#a3a3a3" fontSize="12">Washing/Stabling Lines</text>
          
          {/* Main Through Lines with direction */}
          <path d="M 0 100 H 200" stroke="#737373" strokeWidth="4" markerEnd="url(#arrow-incoming)" />
          <path d="M 200 100 H 800" stroke="#737373" strokeWidth="4" />
          <path d="M 800 100 H 1000" stroke="#737373" strokeWidth="4" markerStart="url(#arrow-outgoing)" />
          <text x="10" y="95" fill="#a3a3a3" fontSize="10">IN</text>
          <text x="970" y="95" fill="#a3a3a3" fontSize="10">OUT</text>

          <path d="M 0 400 H 200" stroke="#737373" strokeWidth="4" markerEnd="url(#arrow-incoming)" />
          <path d="M 200 400 H 800" stroke="#737373" strokeWidth="4" />
          <path d="M 800 400 H 1000" stroke="#737373" strokeWidth="4" markerStart="url(#arrow-outgoing)" />
           <text x="10" y="395" fill="#a3a3a3" fontSize="10">IN</text>
           <text x="970" y="395" fill="#a3a3a3" fontSize="10">OUT</text>

          {/* Yard/Siding Lines */}
          <path d="M 300 50 H 700" stroke="#525252" strokeWidth="2" />
          <path d="M 300 70 H 700" stroke="#525252" strokeWidth="2" />

          {/* Platforms */}
          {Array.from({ length: 16 }).map((_, i) => {
            const pNum = i + 1;
            const isIsland = pNum >= 2 && pNum <= 15;
            const isSide = pNum === 1 || pNum === 16;
            const isPaired = isIsland && pNum % 2 === 0;

            if (isSide) {
              return (
                <g key={`platform-${pNum}`}>
                  <rect x="250" y={platformYPosition(pNum)} width="500" height="15" rx="3" fill="#404040" />
                  <text x="260" y={platformYPosition(pNum) + 11} fill="#a3a3a3" fontSize="9">{`P${pNum}`}</text>
                </g>
              );
            }
            if (isPaired) {
              const p_even = pNum;
              const p_odd = pNum + 1;
              const y_base = platformYPosition(p_even);
              return (
                 <g key={`island-${p_even}`}>
                  <rect x="250" y={y_base} width="500" height="30" rx="3" fill="#404040" />
                  <line x1="250" y1={y_base+15} x2="750" y2={y_base+15} stroke="#303030" strokeWidth="1" />
                  <text x="260" y={y_base + 11} fill="#a3a3a3" fontSize="9">{`P${p_even}`}</text>
                  <text x="260" y={y_base + 26} fill="#a3a3a3" fontSize="9">{`P${p_odd}`}</text>
                </g>
              );
            }
            return null;
          })}
          
          {/* Tracks to Platforms */}
          <path d="M 200 100 C 225 100, 240 120, 250 120" fill="none" stroke="#525252" strokeWidth="2" />
          <path d="M 750 120 H 800 C 825 120, 850 100, 800 100" fill="none" stroke="#525252" strokeWidth="2" />
          
          <path d="M 200 400 C 225 400, 240 385, 250 385" fill="none" stroke="#525252" strokeWidth="2" />
          <path d="M 750 385 H 800 C 825 385, 850 400, 800 400" fill="none" stroke="#525252" strokeWidth="2" />
          
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
          {trainData.map((train) => {
            const pos = getTrainPosition(train);
            return (
              <g key={train.id} transform={`translate(${pos.x} ${pos.y})`}>
                <TrainFront className={pos.color} />
                <text x="28" y="10" fill="#e5e5e5" fontSize="10" fontWeight="bold">{train.id}</text>
                <text x="28" y="22" fill="#d4d4d4" fontSize="9">{pos.destinationText}</text>
                {pos.direction === 'in' && <ArrowRight x={-20} y={5} className="text-yellow-400" width="16" height="16" />}
                {pos.direction === 'out' && <ArrowRight x={70} y={5} className="text-green-400" width="16" height="16" />}
              </g>
            )
          })}

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
