import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { NetworkGraph } from "@/components/NetworkGraph";
import { GraphControls } from "@/components/GraphControls";
import { NodeModal } from "@/components/NodeModal";
import { UploadModal } from "@/components/UploadModal";
import { PathTraversalModal } from "@/components/PathTraversalModal";
import { LogOut, Network, Brain, Download, Upload, Route, Menu } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const Graph = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedNode, setSelectedNode] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isPathModalOpen, setIsPathModalOpen] = useState(false);
  const [isTraversalMode, setIsTraversalMode] = useState(false);
  const [traversalPath, setTraversalPath] = useState([]);
  const [isMobileControlsOpen, setIsMobileControlsOpen] = useState(false);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <SidebarProvider>
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 md:px-6 py-3 md:py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2 md:space-x-4">
                <div className="md:hidden">
                  <SidebarTrigger className="text-white hover:bg-slate-700/50" />
                </div>
                
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
              </div>
              
              <div className="flex items-center space-x-1 md:space-x-3">
                <div className="hidden md:flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsUploadModalOpen(true)}
                    className="border-slate-600 text-slate-300 bg-slate-700/50 hover:bg-slate-600 hover:text-white hover:border-slate-500"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadGraph}
                    className="border-slate-600 text-slate-300 bg-slate-700/50 hover:bg-slate-600 hover:text-white hover:border-slate-500"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Graph
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleTraversalMode}
                    className={`border-slate-600 text-slate-300 bg-slate-700/50 hover:bg-slate-600 hover:text-white hover:border-slate-500 ${
                      isTraversalMode ? 'bg-blue-600/70 border-blue-500 text-white' : ''
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
                      className="border-green-600 text-green-400 bg-slate-700/50 hover:bg-green-600 hover:text-white hover:border-green-500"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Path ({traversalPath.length})
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsPathModalOpen(true)}
                    className="border-slate-600 text-slate-300 bg-slate-700/50 hover:bg-slate-600 hover:text-white hover:border-slate-500"
                  >
                    Path Info
                  </Button>
                </div>

                <div className="md:hidden lg:hidden flex items-center space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleTraversalMode}
                    className={`border-slate-600 text-slate-300 bg-slate-700/50 hover:bg-slate-600 hover:text-white hover:border-slate-500 px-2 ${
                      isTraversalMode ? 'bg-blue-600/70 border-blue-500 text-white' : ''
                    }`}
                  >
                    <Route className="w-4 h-4" />
                  </Button>
                  
                  <Drawer>
                    <DrawerTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-slate-600 text-slate-300 bg-slate-700/50 hover:bg-slate-600 hover:text-white hover:border-slate-500 px-2"
                      >
                        <Menu className="w-4 h-4" />
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
                          onClick={() => setIsUploadModalOpen(true)}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Data
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full border-slate-600 text-slate-300 bg-slate-700/50 hover:bg-slate-600 hover:text-white justify-start"
                          onClick={handleDownloadGraph}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download Graph
                        </Button>
                        {traversalPath.length > 0 && (
                          <Button
                            variant="outline"
                            className="w-full border-green-600 text-green-400 bg-slate-700/50 hover:bg-green-600 hover:text-white justify-start"
                            onClick={handleDownloadPath}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download Path ({traversalPath.length})
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          className="w-full border-slate-600 text-slate-300 bg-slate-700/50 hover:bg-slate-600 hover:text-white justify-start"
                          onClick={() => setIsPathModalOpen(true)}
                        >
                          Path Info
                        </Button>
                      </div>
                    </DrawerContent>
                  </Drawer>
                </div>

                {/* iPad actions - show in horizontal mode */}
                <div className="hidden lg:flex xl:hidden items-center space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleTraversalMode}
                    className={`border-slate-600 text-slate-300 bg-slate-700/50 hover:bg-slate-600 hover:text-white hover:border-slate-500 px-2 ${
                      isTraversalMode ? 'bg-blue-600/70 border-blue-500 text-white' : ''
                    }`}
                  >
                    <Route className="w-4 h-4" />
                  </Button>
                  
                  <Drawer>
                    <DrawerTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-slate-600 text-slate-300 bg-slate-700/50 hover:bg-slate-600 hover:text-white hover:border-slate-500 px-2"
                      >
                        <Menu className="w-4 h-4" />
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
                          onClick={() => setIsUploadModalOpen(true)}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Data
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full border-slate-600 text-slate-300 bg-slate-700/50 hover:bg-slate-600 hover:text-white justify-start"
                          onClick={handleDownloadGraph}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download Graph
                        </Button>
                        {traversalPath.length > 0 && (
                          <Button
                            variant="outline"
                            className="w-full border-green-600 text-green-400 bg-slate-700/50 hover:bg-green-600 hover:text-white justify-start"
                            onClick={handleDownloadPath}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download Path ({traversalPath.length})
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          className="w-full border-slate-600 text-slate-300 bg-slate-700/50 hover:bg-slate-600 hover:text-white justify-start"
                          onClick={() => setIsPathModalOpen(true)}
                        >
                          Path Info
                        </Button>
                      </div>
                    </DrawerContent>
                  </Drawer>
                </div>

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

        {/* Main Content with proper responsive layout */}
        <div className="flex w-full min-h-screen">
          {/* Desktop Sidebar - only show on xl screens */}
          <Sidebar className="hidden xl:flex border-slate-700 bg-slate-800/30 backdrop-blur-sm">
            <SidebarContent className="overflow-y-auto">
              <GraphControls 
                networkRef={networkRef}
                isTraversalMode={isTraversalMode}
                traversalPath={traversalPath}
              />
            </SidebarContent>
          </Sidebar>

          {/* Mobile/Tablet Sidebar - show on mobile and lg screens */}
          <Sidebar className="xl:hidden border-slate-700 bg-slate-800/95 backdrop-blur-sm">
            <SidebarContent className="overflow-y-auto">
              <GraphControls 
                networkRef={networkRef}
                isTraversalMode={isTraversalMode}
                traversalPath={traversalPath}
              />
            </SidebarContent>
          </Sidebar>

          <SidebarInset className="flex-1">
            {/* Graph Visualization with proper responsive container and background */}
            <div className="pt-16 md:pt-20 h-screen w-full relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
              <div className="absolute inset-0 p-2 md:p-4">
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
          </SidebarInset>
        </div>
      </SidebarProvider>

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
