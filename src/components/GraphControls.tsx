
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

interface GraphControlsProps {
  networkRef: React.RefObject<any>;
  isTraversalMode: boolean;
  traversalPath: any[];
}

export const GraphControls = ({ networkRef, isTraversalMode, traversalPath }: GraphControlsProps) => {
  const [distanceSettings, setDistanceSettings] = useState({
    structure: 140,
    'grant-flow': 100,
    'service-flow': 100,
    'knowledge-flow': 100
  });

  const updateDistance = (type: string, value: number) => {
    setDistanceSettings(prev => ({ ...prev, [type]: value }));
  };

  const resetDistances = () => {
    setDistanceSettings({
      structure: 140,
      'grant-flow': 100,
      'service-flow': 100,
      'knowledge-flow': 100
    });
  };

  return (
    <div className="p-6 space-y-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white text-lg">Network Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full border-slate-600 text-white hover:bg-slate-700"
            >
              Show All Connections
            </Button>
            <Button 
              variant="outline" 
              className="w-full border-slate-600 text-white hover:bg-slate-700"
            >
              Grant Flow Only
            </Button>
            <Button 
              variant="outline" 
              className="w-full border-slate-600 text-white hover:bg-slate-700"
            >
              Service Flow Only
            </Button>
            <Button 
              variant="outline" 
              className="w-full border-slate-600 text-white hover:bg-slate-700"
            >
              Knowledge Flow Only
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white text-lg">Distance Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(distanceSettings).map(([type, value]) => (
            <div key={type} className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-white text-sm capitalize">
                  {type.replace('-', ' ')}
                </label>
                <span className="text-blue-300 text-sm">{value}</span>
              </div>
              <Slider
                value={[value]}
                onValueChange={(values) => updateDistance(type, values[0])}
                max={300}
                min={50}
                step={10}
                className="w-full"
              />
            </div>
          ))}
          <Button 
            onClick={resetDistances}
            variant="outline" 
            className="w-full border-slate-600 text-white hover:bg-slate-700"
          >
            Reset Distances
          </Button>
        </CardContent>
      </Card>

      {isTraversalMode && (
        <Card className="bg-blue-900/30 border-blue-600">
          <CardHeader>
            <CardTitle className="text-blue-300 text-lg">Path Builder</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-200 text-sm mb-2">
              Nodes in path: {traversalPath.length}
            </p>
            <p className="text-blue-200 text-xs">
              Click nodes to build strategic paths and identify disconnects.
            </p>
          </CardContent>
        </Card>
      )}

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white text-lg">Network Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Nodes:</span>
            <span className="text-white">25</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Connections:</span>
            <span className="text-white">48</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Grant Flows:</span>
            <span className="text-green-400">12</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Service Flows:</span>
            <span className="text-blue-400">18</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">People Reached:</span>
            <span className="text-white">200M+</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
