
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Route, Download, RotateCcw } from "lucide-react";

interface PathTraversalModalProps {
  isOpen: boolean;
  onClose: () => void;
  traversalPath: any[];
  isTraversalMode: boolean;
  onToggleTraversalMode: () => void;
}

export const PathTraversalModal = ({ 
  isOpen, 
  onClose, 
  traversalPath, 
  isTraversalMode, 
  onToggleTraversalMode 
}: PathTraversalModalProps) => {
  
  const handleDownloadPath = () => {
    if (traversalPath.length === 0) return;
    
    const pathData = {
      metadata: {
        name: "Strategic Path Analysis",
        created: new Date().toISOString(),
        nodes_count: traversalPath.length,
        author: "AutoNateAI Strategic Analysis"
      },
      path: traversalPath.map(node => ({
        id: node.id,
        name: node.name,
        type: node.type,
        order: traversalPath.indexOf(node) + 1
      })),
      analysis: {
        connected_segments: "Analysis pending",
        disconnected_segments: "Analysis pending",
        strategic_recommendations: [
          "Build connections between disconnected segments",
          "Strengthen weak links",
          "Optimize resource flow"
        ]
      }
    };

    const blob = new Blob([JSON.stringify(pathData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `strategic-path-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Route className="w-5 h-5" />
            Path Traversal Tool
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Card className="bg-slate-700/50 border-slate-600">
            <CardHeader>
              <CardTitle className="text-lg text-blue-300">Traversal Mode</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">
                  Status: {isTraversalMode ? 'Active' : 'Inactive'}
                </span>
                <Badge 
                  variant={isTraversalMode ? 'default' : 'outline'}
                  className={isTraversalMode ? 'bg-green-600' : 'border-slate-600 text-gray-300'}
                >
                  {isTraversalMode ? 'ON' : 'OFF'}
                </Badge>
              </div>
              <p className="text-sm text-gray-400">
                {isTraversalMode 
                  ? "Click nodes in the graph to build strategic paths and identify disconnected segments."
                  : "Enable traversal mode to start building paths by clicking nodes."
                }
              </p>
              <Button
                onClick={onToggleTraversalMode}
                className={`w-full ${isTraversalMode ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
              >
                <Route className="w-4 h-4 mr-2" />
                {isTraversalMode ? 'Exit Traversal Mode' : 'Enter Traversal Mode'}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-700/50 border-slate-600">
            <CardHeader>
              <CardTitle className="text-lg text-blue-300">
                Current Path ({traversalPath.length} nodes)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {traversalPath.length === 0 ? (
                <p className="text-gray-400 text-sm">
                  No nodes selected. Enable traversal mode and click nodes to build a path.
                </p>
              ) : (
                <div className="space-y-2">
                  {traversalPath.map((node, index) => (
                    <div 
                      key={`${node.id}-${index}`}
                      className="flex items-center gap-3 p-2 bg-slate-600/50 rounded-md"
                    >
                      <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                        {index + 1}
                      </span>
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: node.color }}
                      />
                      <span className="text-white text-sm">{node.name}</span>
                      <Badge 
                        variant="outline" 
                        className="border-slate-500 text-slate-300 text-xs"
                      >
                        {node.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {traversalPath.length > 0 && (
            <Card className="bg-blue-900/30 border-blue-600">
              <CardHeader>
                <CardTitle className="text-lg text-blue-300">Path Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Total Nodes:</span>
                    <span className="text-white ml-2 font-semibold">{traversalPath.length}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Path Length:</span>
                    <span className="text-white ml-2 font-semibold">{traversalPath.length - 1} connections</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-blue-300 font-semibold">Strategic Insights:</h4>
                  <ul className="text-sm text-blue-200 space-y-1">
                    <li>• Identify gaps between disconnected path segments</li>
                    <li>• Analyze resource flow efficiency across the path</li>
                    <li>• Develop strategies to strengthen weak connections</li>
                  </ul>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleDownloadPath}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Path
                  </Button>
                  <Button
                    onClick={() => {/* Clear path logic */}}
                    variant="outline"
                    className="border-slate-600 text-white hover:bg-slate-700"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="bg-slate-700/50 border-slate-600">
            <CardHeader>
              <CardTitle className="text-lg text-orange-300">How to Use</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="text-sm text-gray-300 space-y-2">
                <li>1. Enable traversal mode using the button above</li>
                <li>2. Click nodes in the graph to add them to your path</li>
                <li>3. Build strategic paths to identify connection opportunities</li>
                <li>4. Download your path analysis for strategic planning</li>
                <li>5. Use insights to strengthen network connections</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
