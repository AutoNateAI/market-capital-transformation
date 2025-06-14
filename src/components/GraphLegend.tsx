
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GripVertical, X, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GraphLegendProps {
  isVisible: boolean;
  onToggle: () => void;
}

export const GraphLegend = ({ isVisible, onToggle }: GraphLegendProps) => {
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [size, setSize] = useState({ width: 288, height: 400 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const legendRef = useRef<HTMLDivElement>(null);

  const getEventCoordinates = (e: MouseEvent | TouchEvent) => {
    if ('touches' in e && e.touches.length > 0) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: (e as MouseEvent).clientX, y: (e as MouseEvent).clientY };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!legendRef.current) return;
    
    const rect = legendRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setIsDragging(true);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!legendRef.current || e.touches.length !== 1) return;
    
    const rect = legendRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    setDragOffset({
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    });
    setIsDragging(true);
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height
    });
    setIsResizing(true);
  };

  const handleResizeTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    if (e.touches.length !== 1) return;
    
    const touch = e.touches[0];
    setResizeStart({
      x: touch.clientX,
      y: touch.clientY,
      width: size.width,
      height: size.height
    });
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      const coords = getEventCoordinates(e);
      
      if (isDragging) {
        const newX = coords.x - dragOffset.x;
        const newY = coords.y - dragOffset.y;
        
        const maxX = window.innerWidth - size.width;
        const maxY = window.innerHeight - size.height;
        
        setPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY))
        });
      } else if (isResizing) {
        const deltaX = coords.x - resizeStart.x;
        const deltaY = coords.y - resizeStart.y;
        
        const newWidth = Math.max(250, Math.min(500, resizeStart.width + deltaX));
        const newHeight = Math.max(300, Math.min(600, resizeStart.height + deltaY));
        
        setSize({ width: newWidth, height: newHeight });
      }
    };

    const handleEnd = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleMove, { passive: false });
      document.addEventListener('touchend', handleEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, isResizing, dragOffset, resizeStart, size]);

  if (!isVisible) return null;

  return (
    <div
      ref={legendRef}
      className="fixed z-50 select-none touch-none"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        transform: isDragging || isResizing ? 'scale(1.02)' : 'scale(1)',
        transition: isDragging || isResizing ? 'none' : 'transform 0.2s ease'
      }}
    >
      <Card className="bg-slate-800/95 border-slate-600 backdrop-blur-sm shadow-2xl h-full flex flex-col">
        <CardHeader 
          className="pb-2 cursor-move flex-shrink-0"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <CardTitle className="text-blue-300 text-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GripVertical className="w-4 h-4 text-slate-400" />
              Network Legend
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="text-slate-400 hover:text-white p-1 h-auto"
            >
              <X className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 flex-1 overflow-y-auto">
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
        
        {/* Resize Handle */}
        <div
          className="absolute bottom-0 right-0 w-6 h-6 cursor-se-resize touch-none"
          onMouseDown={handleResizeStart}
          onTouchStart={handleResizeTouchStart}
        >
          <Maximize2 className="w-4 h-4 text-slate-400 absolute bottom-1 right-1" />
        </div>
      </Card>
    </div>
  );
};
