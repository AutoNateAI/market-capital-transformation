import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GripVertical } from "lucide-react";

interface GraphLegendProps {
  isVisible: boolean;
}

export const GraphLegend = ({ isVisible }: GraphLegendProps) => {
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const legendRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!legendRef.current) return;
    
    const rect = legendRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      // Keep within viewport bounds
      const maxX = window.innerWidth - 300;
      const maxY = window.innerHeight - 400;
      
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  if (!isVisible) return null;

  return (
    <div
      ref={legendRef}
      className="fixed z-50 select-none"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: isDragging ? 'scale(1.02)' : 'scale(1)',
        transition: isDragging ? 'none' : 'transform 0.2s ease'
      }}
    >
      <Card className="bg-slate-800/95 border-slate-600 backdrop-blur-sm shadow-2xl w-72">
        <CardHeader 
          className="pb-2 cursor-move"
          onMouseDown={handleMouseDown}
        >
          <CardTitle className="text-blue-300 text-lg flex items-center gap-2">
            <GripVertical className="w-4 h-4 text-slate-400" />
            Network Legend
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Node Types */}
          <div>
            <h4 className="text-white font-medium mb-2">Node Types</h4>
            <div className="space-y-1.5 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-white border-2 border-white"></div>
                <span className="text-slate-300">Root Network (Largest)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-red-400"></div>
                <span className="text-slate-300">Government Sector</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-teal-400"></div>
                <span className="text-slate-300">Education Sector</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-blue-400"></div>
                <span className="text-slate-300">Business Sector</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <span className="text-slate-300">Organizations</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-300"></div>
                <span className="text-slate-300">Distribution Channels</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-300"></div>
                <span className="text-slate-300">Communities (Smallest)</span>
              </div>
            </div>
          </div>

          {/* Connection Types */}
          <div>
            <h4 className="text-white font-medium mb-2">Connection Types</h4>
            <div className="space-y-1.5 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-6 h-0.5 bg-gray-500"></div>
                <span className="text-slate-300">Hierarchy</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-0.5 bg-green-400 border-dashed border-t border-green-400"></div>
                <span className="text-slate-300">Grant Flow</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-0.5 bg-blue-400 border-dashed border-t border-blue-400"></div>
                <span className="text-slate-300">Service Flow</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-0.5 bg-orange-400 border-dashed border-t border-orange-400"></div>
                <span className="text-slate-300">Knowledge Flow</span>
              </div>
            </div>
          </div>

          {/* Size Legend */}
          <div>
            <h4 className="text-white font-medium mb-2">Node Hierarchy</h4>
            <div className="text-xs text-slate-400">
              Larger nodes represent higher-level entities in the network hierarchy. 
              Communities are positioned on the outer edge for strategic analysis.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
