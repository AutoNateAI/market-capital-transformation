
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { NetworkGraph } from "@/components/NetworkGraph";
import { GraphControls } from "@/components/GraphControls";
import { NodeModal } from "@/components/NodeModal";
import { UploadModal } from "@/components/UploadModal";
import { PathTraversalModal } from "@/components/PathTraversalModal";
import { LogOut, Network, Brain, Download, Upload, Route, Menu, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { GraphLegend } from "@/components/GraphLegend";

const Graph = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedNode, setSelectedNode] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isPathModalOpen, setIsPathModalOpen] = useState(false);
  const [isTraversalMode, setIsTraversalMode] = useState(false);
  const [traversalPath, setTraversalPath] = useState([]);
  const [isControlsOpen, setIsControlsOpen] = useState(false);
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const networkRef = useRef(null);
  const [isLegendVisible, setIsLegendVisible] = useState(true);

  // Check authentication on mount
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('autonateai_logged_in');
    if (!isLoggedIn) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access the network graph.",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [navigate, toast]);

  const handleLogout = () => {
    // Remove login status from cache
    localStorage.removeItem('autonateai_logged_in');
    
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
        description: "Click nodes to view details and add them to your strategic path.",
      });
    } else {
      toast({
        title: "Traversal Mode Deactivated",
        description: "Path building mode disabled.",
      });
    }
  };

  const handleAddToPath = (node: any) => {
    if (!traversalPath.find(n => n.id === node.id)) {
      const newPath = [...traversalPath, node];
      setTraversalPath(newPath);
      toast({
        title: "Node Added to Path",
        description: `${node.name} added to traversal path (${newPath.length} nodes)`,
      });
    } else {
      toast({
        title: "Node Already in Path",
        description: `${node.name} is already part of your strategic path.`,
        variant: "destructive",
      });
    }
  };

  const handleShowConfiguration = () => {
    setIsControlsOpen(false);
    toast({
      title: "Configuration Applied",
      description: "New network configuration is now displayed on the graph.",
    });
  };

  const toggleLegend = () => {
    setIsLegendVisible(!isLegendVisible);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 md:px-6 py-3 md:py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Network className="w-4 h-4 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-bold text-white">Strategic Network Graph</h1>
                <div className="hidden md:flex items-center text-sm text-blue-300">
                  <Brain className="w-3 h-3 mr-1" />
                  <span>AutoNateAI Strategic Intelligence</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleLegend}
                className="border-slate-600 text-slate-300 bg-slate-700/50 hover:bg-slate-600 hover:text-white hover:border-slate-500 px-2 md:px-3"
              >
                <Network className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">Legend</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTraversalMode}
                className={`border-slate-600 text-slate-300 bg-slate-700/50 hover:bg-slate-600 hover:text-white hover:border-slate-500 px-2 md:px-3 ${
                  isTraversalMode ? 'bg-blue-600/70 border-blue-500 text-white' : ''
                }`}
              >
                <Route className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">{isTraversalMode ? 'Exit Path' : 'Path Mode'}</span>
              </Button>
              
              {/* Controls Drawer */}
              <Drawer open={isControlsOpen} onOpenChange={setIsControlsOpen}>
                <DrawerTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-600 text-slate-300 bg-slate-700/50 hover:bg-slate-600 hover:text-white hover:border-slate-500 px-2 md:px-3"
                  >
                    <Settings className="w-4 h-4 md:mr-2" />
                    <span className="hidden md:inline">Controls</span>
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="bg-slate-800 border-slate-700 max-h-[80vh]">
                  <DrawerHeader>
                    <DrawerTitle className="text-white">Graph Controls</DrawerTitle>
                  </DrawerHeader>
                  <div className="px-4 pb-4 overflow-y-auto">
                    <GraphControls 
                      networkRef={networkRef}
                      isTraversalMode={isTraversalMode}
                      traversalPath={traversalPath}
                      onShowConfiguration={handleShowConfiguration}
                    />
                  </div>
                </DrawerContent>
              </Drawer>
              
              {/* Actions Drawer */}
              <Drawer open={isActionsOpen} onOpenChange={setIsActionsOpen}>
                <DrawerTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-600 text-slate-300 bg-slate-700/50 hover:bg-slate-600 hover:text-white hover:border-slate-500 px-2 md:px-3"
                  >
                    <Menu className="w-4 h-4 md:mr-2" />
                    <span className="hidden md:inline">Actions</span>
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="bg-slate-800 border-slate-700">
                  <DrawerHeader>
                    <DrawerTitle className="text-white">Actions</DrawerTitle>
                  </DrawerHeader>
                  <div className="p-4 space-y-2">
                    <Button
                      variant="outline"
                      className="w-full border-slate-600 text-slate-300 bg-slate-700/50 hover:bg-slate-600 hover:text-white justify-start"
                      onClick={() => {
                        setIsUploadModalOpen(true);
                        setIsActionsOpen(false);
                      }}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Data
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-slate-600 text-slate-300 bg-slate-700/50 hover:bg-slate-600 hover:text-white justify-start"
                      onClick={() => {
                        handleDownloadGraph();
                        setIsActionsOpen(false);
                      }}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Graph
                    </Button>
                    {traversalPath.length > 0 && (
                      <Button
                        variant="outline"
                        className="w-full border-green-600 text-green-400 bg-slate-700/50 hover:bg-green-600 hover:text-white justify-start"
                        onClick={() => {
                          handleDownloadPath();
                          setIsActionsOpen(false);
                        }}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Path ({traversalPath.length})
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      className="w-full border-slate-600 text-slate-300 bg-slate-700/50 hover:bg-slate-600 hover:text-white justify-start"
                      onClick={() => {
                        setIsPathModalOpen(true);
                        setIsActionsOpen(false);
                      }}
                    >
                      Path Info
                    </Button>
                  </div>
                </DrawerContent>
              </Drawer>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-red-400 hover:text-red-300 hover:bg-red-900/20 bg-slate-700/30 px-2 md:px-4"
              >
                <LogOut className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Full width graph */}
      <div className="pt-16 md:pt-20 h-screen w-full">
        <div className="h-full w-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
          <div className="h-full w-full p-2 md:p-4">
            <div className="w-full h-full">
              <NetworkGraph
                ref={networkRef}
                onNodeSelect={setSelectedNode}
                isTraversalMode={isTraversalMode}
                traversalPath={traversalPath}
                onTraversalPathUpdate={setTraversalPath}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Resizable Draggable Legend */}
      <GraphLegend isVisible={isLegendVisible} onToggle={toggleLegend} />

      {/* Modals */}
      {selectedNode && (
        <NodeModal
          node={selectedNode}
          isOpen={!!selectedNode}
          onClose={() => setSelectedNode(null)}
          isTraversalMode={isTraversalMode}
          onAddToPath={handleAddToPath}
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
