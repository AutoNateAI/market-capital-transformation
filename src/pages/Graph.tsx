
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { NetworkGraph } from "@/components/NetworkGraph";
import { GraphControls } from "@/components/GraphControls";
import { NodeModal } from "@/components/NodeModal";
import { UploadModal } from "@/components/UploadModal";
import { PathTraversalModal } from "@/components/PathTraversalModal";
import { LogOut, Network, Brain, Download, Upload, Route } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Graph = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedNode, setSelectedNode] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isPathModalOpen, setIsPathModalOpen] = useState(false);
  const [isTraversalMode, setIsTraversalMode] = useState(false);
  const [traversalPath, setTraversalPath] = useState([]);
  const networkRef = useRef(null);

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been securely logged out of the system.",
    });
    navigate("/");
  };

  const handleDownloadGraph = () => {
    if (networkRef.current && networkRef.current.downloadGraph) {
      networkRef.current.downloadGraph();
      toast({
        title: "Graph Downloaded",
        description: "Network graph has been exported successfully.",
      });
    }
  };

  const handleDownloadPath = () => {
    if (traversalPath.length > 0) {
      const pathData = {
        metadata: {
          name: "Strategic Path Analysis",
          created: new Date().toISOString(),
          nodes_count: traversalPath.length,
          author: "AutoNateAI Strategic Analysis"
        },
        path: traversalPath,
        analysis: {
          connected_segments: "Analysis pending",
          disconnected_segments: "Analysis pending",
          strategic_recommendations: ["Build connections between disconnected segments", "Strengthen weak links", "Optimize resource flow"]
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

      toast({
        title: "Path Downloaded",
        description: "Strategic path analysis has been exported successfully.",
      });
    } else {
      toast({
        title: "No Path Selected",
        description: "Please build a path in traversal mode first.",
        variant: "destructive",
      });
    }
  };

  const toggleTraversalMode = () => {
    setIsTraversalMode(!isTraversalMode);
    if (!isTraversalMode) {
      setTraversalPath([]);
      toast({
        title: "Traversal Mode Activated",
        description: "Click nodes to build strategic paths and identify disconnects.",
      });
    } else {
      toast({
        title: "Traversal Mode Deactivated",
        description: "Path building mode disabled.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Network className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Strategic Network Graph</h1>
                  <div className="flex items-center text-sm text-blue-300">
                    <Brain className="w-3 h-3 mr-1" />
                    <span>AutoNateAI Strategic Intelligence</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsUploadModalOpen(true)}
                className="border-slate-600 text-white bg-slate-700/50 hover:bg-slate-600 hover:text-white"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadGraph}
                className="border-slate-600 text-white bg-slate-700/50 hover:bg-slate-600 hover:text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Graph
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTraversalMode}
                className={`border-slate-600 text-white bg-slate-700/50 hover:bg-slate-600 hover:text-white ${
                  isTraversalMode ? 'bg-blue-600/70 border-blue-500' : ''
                }`}
              >
                <Route className="w-4 h-4 mr-2" />
                {isTraversalMode ? 'Exit Path' : 'Path Mode'}
              </Button>
              {traversalPath.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadPath}
                  className="border-green-600 text-green-400 bg-slate-700/50 hover:bg-green-600 hover:text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Path ({traversalPath.length})
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPathModalOpen(true)}
                className="border-slate-600 text-white bg-slate-700/50 hover:bg-slate-600 hover:text-white"
              >
                Path Info
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-red-400 hover:text-red-300 hover:bg-red-900/20 bg-slate-700/30"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Controls Sidebar */}
        <div className="w-80 border-r border-slate-700 bg-slate-800/30 backdrop-blur-sm overflow-y-auto">
          <GraphControls 
            networkRef={networkRef}
            isTraversalMode={isTraversalMode}
            traversalPath={traversalPath}
          />
        </div>

        {/* Graph Visualization */}
        <div className="flex-1 relative">
          <NetworkGraph
            ref={networkRef}
            onNodeSelect={setSelectedNode}
            isTraversalMode={isTraversalMode}
            traversalPath={traversalPath}
            onTraversalPathUpdate={setTraversalPath}
          />
        </div>
      </div>

      {/* Modals */}
      {selectedNode && (
        <NodeModal
          node={selectedNode}
          isOpen={!!selectedNode}
          onClose={() => setSelectedNode(null)}
        />
      )}

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={(data) => {
          if (networkRef.current && networkRef.current.addDataToNetwork) {
            networkRef.current.addDataToNetwork(data);
          }
        }}
      />

      <PathTraversalModal
        isOpen={isPathModalOpen}
        onClose={() => setIsPathModalOpen(false)}
        traversalPath={traversalPath}
        isTraversalMode={isTraversalMode}
        onToggleTraversalMode={toggleTraversalMode}
      />
    </div>
  );
};

export default Graph;
