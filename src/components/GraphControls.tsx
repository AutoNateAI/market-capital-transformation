
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect } from "react";

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
    const newSettings = { ...distanceSettings, [type]: value };
    setDistanceSettings(newSettings);
    
    // Update the graph distances
    if (networkRef.current && networkRef.current.updateLinkDistances) {
      networkRef.current.updateLinkDistances(newSettings);
    }
  };

  const resetDistances = () => {
    const defaultSettings = {
      structure: 140,
      'grant-flow': 100,
      'service-flow': 100,
      'knowledge-flow': 100
    };
    setDistanceSettings(defaultSettings);
    
    if (networkRef.current && networkRef.current.updateLinkDistances) {
      networkRef.current.updateLinkDistances(defaultSettings);
    }
  };

  const handleFilterLinks = (linkTypes: string[]) => {
    if (networkRef.current && networkRef.current.updateVisibleLinks) {
      networkRef.current.updateVisibleLinks(linkTypes);
    }
  };

  const showAllConnections = () => {
    handleFilterLinks(['structure', 'grant-flow', 'service-flow', 'knowledge-flow']);
  };

  const showGrantFlowOnly = () => {
    handleFilterLinks(['structure', 'grant-flow']);
  };

  const showServiceFlowOnly = () => {
    handleFilterLinks(['structure', 'service-flow']);
  };

  const showKnowledgeFlowOnly = () => {
    handleFilterLinks(['structure', 'knowledge-flow']);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Network Stats - Moved to top */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white text-lg">Network Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Nodes:</span>
            <span className="text-white">33</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Connections:</span>
            <span className="text-white">53</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Grant Flows:</span>
            <span className="text-green-400">9</span>
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

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white text-lg">Network Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Button 
              variant="outline" 
              onClick={showAllConnections}
              className="w-full border-slate-600 text-white bg-slate-700/50 hover:bg-slate-600 hover:text-white"
            >
              Show All Connections
            </Button>
            <Button 
              variant="outline" 
              onClick={showGrantFlowOnly}
              className="w-full border-green-600 text-green-400 bg-slate-700/50 hover:bg-green-600 hover:text-white"
            >
              Grant Flow Only
            </Button>
            <Button 
              variant="outline" 
              onClick={showServiceFlowOnly}
              className="w-full border-blue-600 text-blue-400 bg-slate-700/50 hover:bg-blue-600 hover:text-white"
            >
              Service Flow Only
            </Button>
            <Button 
              variant="outline" 
              onClick={showKnowledgeFlowOnly}
              className="w-full border-orange-600 text-orange-400 bg-slate-700/50 hover:bg-orange-600 hover:text-white"
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
                <label className="text-slate-300 text-sm capitalize">
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
            className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
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
              Click nodes to view details and add them to your strategic path.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
