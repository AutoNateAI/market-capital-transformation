import { forwardRef, useImperativeHandle, useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RotateCw, Move, ZoomIn, Settings, X, GripVertical, Maximize2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface Node {
  id: string;
  name: string;
  type: string;
  color: string;
  size: number;
  description?: string;
  funding?: string;
  population?: string;
  grants?: string[];
  channels?: number;
  needs?: string[];
  x?: number;
  y?: number;
  fx?: number;
  fy?: number;
  vx?: number;
  vy?: number;
}

interface Link {
  source: string | Node;
  target: string | Node;
  type: string;
  description?: string;
}

interface NetworkData {
  nodes: Node[];
  links: Link[];
}

interface NetworkGraphProps {
  onNodeSelect: (node: Node | null) => void;
  isTraversalMode: boolean;
  traversalPath: Node[];
  onTraversalPathUpdate: (path: Node[]) => void;
}

export interface NetworkGraphRef {
  downloadGraph: () => void;
  addDataToNetwork: (data: any) => void;
  updateVisibleLinks: (linkTypes: string[]) => void;
  updateLinkDistances: (distances: any) => void;
}

export const NetworkGraph = forwardRef<NetworkGraphRef, NetworkGraphProps>(
  ({ onNodeSelect, isTraversalMode, traversalPath, onTraversalPathUpdate }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const controlModalRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
    const [simulation, setSimulation] = useState<d3.Simulation<Node, Link> | null>(null);
    const [visibleLinkTypes, setVisibleLinkTypes] = useState<string[]>(['structure', 'grant-flow', 'service-flow', 'knowledge-flow']);
    const [linkDistances, setLinkDistances] = useState({
      structure: 140,
      'grant-flow': 100,
      'service-flow': 100,
      'knowledge-flow': 100
    });

    // Control modal state
    const [showControlModal, setShowControlModal] = useState(false);
    const [controlModalPosition, setControlModalPosition] = useState({ x: 20, y: 20 });
    const [controlModalSize, setControlModalSize] = useState({ width: 380, height: 500 });
    const [isDraggingModal, setIsDraggingModal] = useState(false);
    const [isResizingModal, setIsResizingModal] = useState(false);
    const [modalDragOffset, setModalDragOffset] = useState({ x: 0, y: 0 });
    const [modalResizeStart, setModalResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });

    // Interaction mode and transform state
    const [interactionMode, setInteractionMode] = useState<'pan-zoom' | 'rotate'>('pan-zoom');
    const [transform, setTransform] = useState({
      rotation: 0,
      scale: 1,
      translateX: 0,
      translateY: 0
    });

    const [mouseState, setMouseState] = useState({
      isDown: false,
      lastX: 0,
      lastY: 0,
      button: 0
    });

    // Network data
    const [networkData, setNetworkData] = useState<NetworkData>({
      nodes: [
        { id: "root", name: "Community Distribution Network", type: "root", color: "#FFFFFF", size: 20 },
        { id: "gov", name: "Government Sector", type: "sector", color: "#FF6B6B", size: 16, description: "Policy makers and public service providers", funding: "$50B+", population: "328M citizens" },
        { id: "edu", name: "Higher Education", type: "sector", color: "#4ECDC4", size: 16, description: "Universities, colleges, and research institutions", funding: "$70B+", population: "20M students" },
        { id: "biz", name: "Business Sector", type: "sector", color: "#45B7D1", size: 16, description: "Private companies and corporate entities", funding: "$25B+ CSR", population: "160M employees" },
        { id: "fed", name: "Federal Agencies", type: "subsector", color: "#FF8A8A", size: 14 },
        { id: "state", name: "State & Local", type: "subsector", color: "#FF8A8A", size: 14 },
        { id: "research", name: "Research Universities", type: "subsector", color: "#6ED7D3", size: 14 },
        { id: "community", name: "Community Colleges", type: "subsector", color: "#6ED7D3", size: 14 },
        { id: "corp", name: "Large Corporations", type: "subsector", color: "#69C3E7", size: 14 },
        { id: "sme", name: "Small-Medium Enterprises", type: "subsector", color: "#69C3E7", size: 14 },
        { id: "hhs", name: "Health & Human Services", type: "organization", color: "#96CEB4", size: 12, grants: ["Community Health: $2.1B", "Mental Health: $1.8B"], channels: 4 },
        { id: "doe", name: "Department of Education", type: "organization", color: "#96CEB4", size: 12, grants: ["Title I: $18.4B", "STEM: $3.2B"], channels: 3 },
        { id: "sba", name: "Small Business Admin", type: "organization", color: "#96CEB4", size: 12, grants: ["Small Business: $500M", "Innovation: $300M"], channels: 5 },
        { id: "nsf", name: "National Science Foundation", type: "organization", color: "#96CEB4", size: 12, grants: ["Research Grants: $8.5B"], channels: 3 },
        { id: "nih", name: "National Institutes of Health", type: "organization", color: "#96CEB4", size: 12, grants: ["Medical Research: $42B"], channels: 4 },
        { id: "tech-corps", name: "Tech Companies", type: "organization", color: "#96CEB4", size: 12, grants: ["Digital Equity: $2.5B", "STEM Ed: $1.2B"], channels: 6 },
        { id: "health-corps", name: "Healthcare Companies", type: "organization", color: "#96CEB4", size: 12, grants: ["Health Equity: $1.8B"], channels: 3 },
        { id: "health-centers", name: "Community Health Centers", type: "distribution", color: "#FFEAA7", size: 10 },
        { id: "schools", name: "Educational Institutions", type: "distribution", color: "#FFEAA7", size: 10 },
        { id: "libraries", name: "Public Libraries", type: "distribution", color: "#FFEAA7", size: 10 },
        { id: "community-centers", name: "Community Centers", type: "distribution", color: "#FFEAA7", size: 10 },
        { id: "extension", name: "Extension Programs", type: "distribution", color: "#FFEAA7", size: 10 },
        { id: "online", name: "Digital Platforms", type: "distribution", color: "#FFEAA7", size: 10 },
        { id: "mobile-units", name: "Mobile Services", type: "distribution", color: "#FFEAA7", size: 10 },
        { id: "nonprofits", name: "Nonprofit Partners", type: "distribution", color: "#FFEAA7", size: 10 },
        { id: "workforce", name: "Workforce Centers", type: "distribution", color: "#FFEAA7", size: 10 },
        { id: "rural", name: "Rural Communities", type: "community", color: "#DDA0DD", size: 8, population: "60M", needs: ["Healthcare", "Broadband", "Economic Development"] },
        { id: "urban", name: "Urban Communities", type: "community", color: "#DDA0DD", size: 8, population: "80M", needs: ["Housing", "Education", "Healthcare"] },
        { id: "seniors", name: "Senior Citizens", type: "community", color: "#DDA0DD", size: 8, population: "54M", needs: ["Healthcare", "Technology", "Social Services"] },
        { id: "students", name: "Students", type: "community", color: "#DDA0DD", size: 8, population: "76M", needs: ["Education", "Financial Aid", "Career Prep"] },
        { id: "entrepreneurs", name: "Entrepreneurs", type: "community", color: "#DDA0DD", size: 8, population: "2M", needs: ["Funding", "Mentorship", "Market Access"] },
        { id: "chronic-patients", name: "Chronic Disease Patients", type: "community", color: "#DDA0DD", size: 8, population: "133M", needs: ["Care Coordination", "Medication", "Support"] },
        { id: "underserved", name: "Underserved Populations", type: "community", color: "#DDA0DD", size: 8, population: "50M", needs: ["Access to Services", "Equity", "Representation"] }
      ],
      links: [
        { source: "root", target: "gov", type: "structure" },
        { source: "root", target: "edu", type: "structure" },
        { source: "root", target: "biz", type: "structure" },
        { source: "gov", target: "fed", type: "structure" },
        { source: "gov", target: "state", type: "structure" },
        { source: "edu", target: "research", type: "structure" },
        { source: "edu", target: "community", type: "structure" },
        { source: "biz", target: "corp", type: "structure" },
        { source: "biz", target: "sme", type: "structure" },
        { source: "fed", target: "hhs", type: "structure" },
        { source: "fed", target: "doe", type: "structure" },
        { source: "state", target: "sba", type: "structure" },
        { source: "research", target: "nsf", type: "structure" },
        { source: "research", target: "nih", type: "structure" },
        { source: "corp", target: "tech-corps", type: "structure" },
        { source: "corp", target: "health-corps", type: "structure" },
        { source: "hhs", target: "health-centers", type: "grant-flow" },
        { source: "doe", target: "schools", type: "grant-flow" },
        { source: "doe", target: "libraries", type: "grant-flow" },
        { source: "sba", target: "workforce", type: "grant-flow" },
        { source: "nsf", target: "extension", type: "grant-flow" },
        { source: "nih", target: "health-centers", type: "grant-flow" },
        { source: "tech-corps", target: "online", type: "grant-flow" },
        { source: "tech-corps", target: "schools", type: "grant-flow" },
        { source: "health-corps", target: "mobile-units", type: "grant-flow" },
        { source: "health-centers", target: "rural", type: "service-flow" },
        { source: "health-centers", target: "seniors", type: "service-flow" },
        { source: "health-centers", target: "chronic-patients", type: "service-flow" },
        { source: "schools", target: "students", type: "service-flow" },
        { source: "schools", target: "underserved", type: "service-flow" },
        { source: "libraries", target: "rural", type: "service-flow" },
        { source: "libraries", target: "seniors", type: "service-flow" },
        { source: "community-centers", target: "urban", type: "service-flow" },
        { source: "community-centers", target: "underserved", type: "service-flow" },
        { source: "extension", target: "rural", type: "service-flow" },
        { source: "online", target: "students", type: "service-flow" },
        { source: "online", target: "entrepreneurs", type: "service-flow" },
        { source: "mobile-units", target: "rural", type: "service-flow" },
        { source: "mobile-units", target: "underserved", type: "service-flow" },
        { source: "workforce", target: "entrepreneurs", type: "service-flow" },
        { source: "research", target: "extension", type: "knowledge-flow" },
        { source: "community", target: "workforce", type: "knowledge-flow" },
        { source: "nsf", target: "schools", type: "knowledge-flow" },
        { source: "nih", target: "mobile-units", type: "knowledge-flow" },
        { source: "tech-corps", target: "community-centers", type: "knowledge-flow" },
        { source: "extension", target: "entrepreneurs", type: "knowledge-flow" },
        { source: "online", target: "rural", type: "knowledge-flow" },
        { source: "hhs", target: "health-corps", type: "knowledge-flow" },
        { source: "doe", target: "tech-corps", type: "knowledge-flow" },
        { source: "nsf", target: "tech-corps", type: "knowledge-flow" },
        { source: "community-centers", target: "nonprofits", type: "service-flow" },
        { source: "nonprofits", target: "underserved", type: "service-flow" },
        { source: "nonprofits", target: "seniors", type: "service-flow" }
      ]
    });

    // Modal drag and resize handlers
    const getEventCoordinates = (e: MouseEvent | TouchEvent) => {
      if ('touches' in e && e.touches.length > 0) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
      return { x: (e as MouseEvent).clientX, y: (e as MouseEvent).clientY };
    };

    const handleModalMouseDown = (e: React.MouseEvent) => {
      if (!controlModalRef.current) return;
      
      const rect = controlModalRef.current.getBoundingClientRect();
      setModalDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDraggingModal(true);
    };

    const handleModalTouchStart = (e: React.TouchEvent) => {
      if (!controlModalRef.current || e.touches.length !== 1) return;
      
      const rect = controlModalRef.current.getBoundingClientRect();
      const touch = e.touches[0];
      setModalDragOffset({
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      });
      setIsDraggingModal(true);
    };

    const handleModalResizeStart = (e: React.MouseEvent) => {
      e.stopPropagation();
      setModalResizeStart({
        x: e.clientX,
        y: e.clientY,
        width: controlModalSize.width,
        height: controlModalSize.height
      });
      setIsResizingModal(true);
    };

    const handleModalResizeTouchStart = (e: React.TouchEvent) => {
      e.stopPropagation();
      if (e.touches.length !== 1) return;
      
      const touch = e.touches[0];
      setModalResizeStart({
        x: touch.clientX,
        y: touch.clientY,
        width: controlModalSize.width,
        height: controlModalSize.height
      });
      setIsResizingModal(true);
    };

    // Modal drag/resize effect
    useEffect(() => {
      const handleMove = (e: MouseEvent | TouchEvent) => {
        const coords = getEventCoordinates(e);
        
        if (isDraggingModal) {
          const newX = coords.x - modalDragOffset.x;
          const newY = coords.y - modalDragOffset.y;
          
          const maxX = window.innerWidth - controlModalSize.width;
          const maxY = window.innerHeight - controlModalSize.height;
          
          setControlModalPosition({
            x: Math.max(0, Math.min(newX, maxX)),
            y: Math.max(0, Math.min(newY, maxY))
          });
        } else if (isResizingModal) {
          const deltaX = coords.x - modalResizeStart.x;
          const deltaY = coords.y - modalResizeStart.y;
          
          const newWidth = Math.max(320, Math.min(600, modalResizeStart.width + deltaX));
          const newHeight = Math.max(400, Math.min(700, modalResizeStart.height + deltaY));
          
          setControlModalSize({ width: newWidth, height: newHeight });
        }
      };

      const handleEnd = () => {
        setIsDraggingModal(false);
        setIsResizingModal(false);
      };

      if (isDraggingModal || isResizingModal) {
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
    }, [isDraggingModal, isResizingModal, modalDragOffset, modalResizeStart, controlModalSize]);

    // Responsive dimensions calculation
    useEffect(() => {
      const updateDimensions = () => {
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          const newWidth = rect.width;
          const newHeight = rect.height;
          
          setDimensions({ width: newWidth, height: newHeight });
        }
      };

      updateDimensions();
      window.addEventListener('resize', updateDimensions);
      
      return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    // Mouse and touch controls for rotation and panning
    useEffect(() => {
      const handleStart = (clientX: number, clientY: number, button: number = 0) => {
        setMouseState({
          isDown: true,
          lastX: clientX,
          lastY: clientY,
          button: button
        });
      };

      const handleMove = (clientX: number, clientY: number) => {
        if (!mouseState.isDown) return;
        
        const deltaX = clientX - mouseState.lastX;
        const deltaY = clientY - mouseState.lastY;
        
        if (interactionMode === 'rotate') {
          setTransform(prev => ({
            ...prev,
            rotation: prev.rotation + deltaX * 0.5
          }));
        } else if (interactionMode === 'pan-zoom') {
          setTransform(prev => ({
            ...prev,
            translateX: prev.translateX + deltaX,
            translateY: prev.translateY + deltaY
          }));
        }
        
        setMouseState(prev => ({
          ...prev,
          lastX: clientX,
          lastY: clientY
        }));
      };

      const handleEnd = () => {
        setMouseState(prev => ({ ...prev, isDown: false }));
      };

      // Mouse events
      const handleMouseDown = (e: MouseEvent) => {
        if (showControlModal && controlModalRef.current?.contains(e.target as Element)) return;
        e.preventDefault();
        handleStart(e.clientX, e.clientY, e.button);
      };

      const handleMouseMove = (e: MouseEvent) => {
        handleMove(e.clientX, e.clientY);
      };

      // Touch events
      const handleTouchStart = (e: TouchEvent) => {
        if (showControlModal && controlModalRef.current?.contains(e.target as Element)) return;
        e.preventDefault();
        if (e.touches.length === 1) {
          const touch = e.touches[0];
          handleStart(touch.clientX, touch.clientY);
        }
      };

      const handleTouchMove = (e: TouchEvent) => {
        e.preventDefault();
        if (e.touches.length === 1) {
          const touch = e.touches[0];
          handleMove(touch.clientX, touch.clientY);
        }
      };

      const handleTouchEnd = (e: TouchEvent) => {
        e.preventDefault();
        handleEnd();
      };

      // Wheel/pinch for zoom (only in pan-zoom mode)
      const handleWheel = (e: WheelEvent) => {
        if (interactionMode !== 'pan-zoom') return;
        e.preventDefault();
        
        const zoomDelta = e.deltaY > 0 ? 0.9 : 1.1;
        setTransform(prev => ({
          ...prev,
          scale: Math.max(0.1, Math.min(3, prev.scale * zoomDelta))
        }));
      };

      if (containerRef.current) {
        const container = containerRef.current;
        
        // Mouse events
        container.addEventListener('mousedown', handleMouseDown);
        container.addEventListener('mousemove', handleMouseMove);
        container.addEventListener('mouseup', handleEnd);
        container.addEventListener('wheel', handleWheel, { passive: false });
        container.addEventListener('contextmenu', (e) => e.preventDefault());
        
        // Touch events
        container.addEventListener('touchstart', handleTouchStart, { passive: false });
        container.addEventListener('touchmove', handleTouchMove, { passive: false });
        container.addEventListener('touchend', handleTouchEnd, { passive: false });
        
        return () => {
          container.removeEventListener('mousedown', handleMouseDown);
          container.removeEventListener('mousemove', handleMouseMove);
          container.removeEventListener('mouseup', handleEnd);
          container.removeEventListener('wheel', handleWheel);
          container.removeEventListener('contextmenu', (e) => e.preventDefault());
          container.removeEventListener('touchstart', handleTouchStart);
          container.removeEventListener('touchmove', handleTouchMove);
          container.removeEventListener('touchend', handleTouchEnd);
        };
      }
    }, [mouseState.isDown, mouseState.lastX, mouseState.lastY, mouseState.button, interactionMode, showControlModal]);

    // Reset transform function
    const resetView = () => {
      setTransform({
        rotation: 0,
        scale: 1,
        translateX: 0,
        translateY: 0
      });
      toast({
        title: "View Reset",
        description: "Graph view has been reset to default position",
      });
    };

    const updateVisibleLinks = (linkTypes: string[]) => {
      console.log("Updating visible links to:", linkTypes);
      setVisibleLinkTypes(linkTypes);
    };

    const updateLinkDistances = (distances: any) => {
      console.log("Updating distances:", distances);
      setLinkDistances(distances);
      if (simulation) {
        const visibleLinks = networkData.links.filter(link => visibleLinkTypes.includes(link.type));
        
        simulation.force("link", d3.forceLink(visibleLinks).id((d: any) => d.id).distance(d => {
          const scaledDistance = (distances[d.type] || 100) * Math.min(dimensions.width, dimensions.height) / 1000;
          return Math.max(scaledDistance, 30); // Minimum distance
        }));
        simulation.alpha(0.3).restart();
      }
    };

    const handleLinkTypeToggle = (linkType: string, enabled: boolean) => {
      if (linkType === 'structure') return; // Don't allow disabling structure links
      
      setVisibleLinkTypes(prev => {
        const newTypes = enabled 
          ? [...prev, linkType]
          : prev.filter(type => type !== linkType);
        updateVisibleLinks(newTypes);
        return newTypes;
      });
    };

    const handleDistanceChange = (linkType: string, distance: number[]) => {
      const newDistances = { ...linkDistances, [linkType]: distance[0] };
      setLinkDistances(newDistances);
      updateLinkDistances(newDistances);
    };

    useImperativeHandle(ref, () => ({
      downloadGraph: () => {
        const dataStr = JSON.stringify(networkData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `network-graph-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      },
      addDataToNetwork: (data: any) => {
        console.log("Adding data to network:", data);
      },
      updateVisibleLinks,
      updateLinkDistances
    }));

    const initializeRadialPositions = () => {
      const centerX = dimensions.width / 2;
      const centerY = dimensions.height / 2;
      
      // Scale distances based on screen size for hierarchical layout
      const baseDistance = Math.min(dimensions.width, dimensions.height) * 0.12;
      const sectorDistance = Math.min(dimensions.width, dimensions.height) * 0.20;
      const organizationDistance = Math.min(dimensions.width, dimensions.height) * 0.28;
      const distributionDistance = Math.min(dimensions.width, dimensions.height) * 0.36;
      const communityDistance = Math.min(dimensions.width, dimensions.height) * 0.44;
      
      const sectorAngles = {
        'gov': -Math.PI / 2,
        'edu': -Math.PI / 2 + (2 * Math.PI / 3),
        'biz': -Math.PI / 2 + (4 * Math.PI / 3)
      };

      networkData.nodes.forEach(node => {
        if (node.type === 'root') {
          node.x = centerX;
          node.y = centerY;
          node.fx = centerX;
          node.fy = centerY;
        } else if (node.type === 'sector') {
          const angle = sectorAngles[node.id as keyof typeof sectorAngles];
          if (angle !== undefined) {
            node.x = centerX + Math.cos(angle) * baseDistance;
            node.y = centerY + Math.sin(angle) * baseDistance;
            node.fx = node.x;
            node.fy = node.y;
          }
        } else if (node.type === 'subsector') {
          const parentSector = node.id.startsWith('fed') || node.id.startsWith('state') ? 'gov' :
                              node.id.startsWith('research') || node.id.startsWith('community') ? 'edu' :
                              node.id.startsWith('corp') || node.id.startsWith('sme') ? 'biz' : null;
          
          if (parentSector) {
            const angle = sectorAngles[parentSector as keyof typeof sectorAngles];
            const offset = node.id.includes('fed') || node.id.includes('research') || node.id.includes('corp') ? -0.3 : 0.3;
            node.x = centerX + Math.cos(angle + offset) * sectorDistance;
            node.y = centerY + Math.sin(angle + offset) * sectorDistance;
          }
        } else if (node.type === 'organization') {
          // Position organizations in their sector's area at organization distance
          const sectorMap = {
            'hhs': 'gov', 'doe': 'gov', 'sba': 'gov',
            'nsf': 'edu', 'nih': 'edu',
            'tech-corps': 'biz', 'health-corps': 'biz'
          };
          const parentSector = sectorMap[node.id as keyof typeof sectorMap];
          if (parentSector) {
            const angle = sectorAngles[parentSector as keyof typeof sectorMap];
            const angleOffset = (Math.random() - 0.5) * 0.8; // Random spread within sector
            node.x = centerX + Math.cos(angle + angleOffset) * organizationDistance;
            node.y = centerY + Math.sin(angle + angleOffset) * organizationDistance;
          }
        } else if (node.type === 'distribution') {
          // Position distribution nodes closer to center
          const angle = Math.random() * 2 * Math.PI;
          node.x = centerX + Math.cos(angle) * distributionDistance;
          node.y = centerY + Math.sin(angle) * distributionDistance;
        } else if (node.type === 'community') {
          // Position communities on the outermost ring for strategic analysis
          const angle = Math.random() * 2 * Math.PI;
          node.x = centerX + Math.cos(angle) * communityDistance;
          node.y = centerY + Math.sin(angle) * communityDistance;
        }
      });
    };

    useEffect(() => {
      if (!svgRef.current || dimensions.width === 0 || dimensions.height === 0) return;

      const svg = d3.select(svgRef.current);
      
      if (!simulation) {
        svg.selectAll("*").remove();
      }
      
      const g = svg.select("g").empty() ? svg.append("g") : svg.select("g");

      // Apply rotation and pan transformations
      const transformString = `
        translate(${dimensions.width/2 + transform.translateX}, ${dimensions.height/2 + transform.translateY})
        scale(${transform.scale})
        rotate(${transform.rotation})
        translate(${-dimensions.width/2}, ${-dimensions.height/2})
      `;
      
      g.attr("transform", transformString);

      if (!simulation) {
        initializeRadialPositions();
      }

      // Scale forces based on screen size
      const forceStrength = Math.min(dimensions.width, dimensions.height) / 1000;

      const newSimulation = simulation || d3.forceSimulation(networkData.nodes)
        .force("link", d3.forceLink(networkData.links).id((d: any) => d.id).distance(d => {
          const scaledDistance = (linkDistances[d.type] || 100) * forceStrength;
          return Math.max(scaledDistance, 30);
        }))
        .force("charge", d3.forceManyBody().strength(d => {
          const baseStrength = forceStrength * -200;
          switch(d.type) {
            case 'root': return baseStrength * 6;
            case 'sector': return baseStrength * 4;
            case 'subsector': return baseStrength * 3;
            case 'organization': return baseStrength * 2;
            case 'distribution': return baseStrength * 1.5;
            case 'community': return baseStrength * 0.8;
            default: return baseStrength;
          }
        }))
        .force("center", d3.forceCenter(dimensions.width / 2, dimensions.height / 2))
        .force("collision", d3.forceCollide().radius(d => {
          const scaledSize = d.size * forceStrength + 8;
          return Math.max(scaledSize, 12);
        }));

      // Always include structure links to maintain consistent hierarchy
      const structureLinks = networkData.links.filter(link => link.type === 'structure');
      const otherVisibleLinks = networkData.links.filter(link => link.type !== 'structure' && visibleLinkTypes.includes(link.type));
      const allVisibleLinks = [...structureLinks, ...otherVisibleLinks];
      
      console.log("Visible links count:", allVisibleLinks.length, "Types:", [...new Set(allVisibleLinks.map(l => l.type))]);

      const linkSelection = g.selectAll("line")
        .data(allVisibleLinks, (d: any) => `${d.source.id || d.source}-${d.target.id || d.target}`);

      linkSelection.exit().remove();

      const linkEnter = linkSelection.enter().append("line");

      const link = linkEnter.merge(linkSelection)
        .attr("stroke", d => {
          switch(d.type) {
            case "grant-flow": return "#4CAF50";
            case "service-flow": return "#2196F3";
            case "knowledge-flow": return "#FF9800";
            default: return "#666";
          }
        })
        .attr("stroke-opacity", d => d.type === 'structure' ? 0.4 : 0.7)
        .attr("stroke-width", d => {
          const baseWidth = Math.max(2 * forceStrength, 1);
          return d.type === 'structure' ? baseWidth : baseWidth * 1.5;
        })
        .attr("stroke-dasharray", d => d.type === 'structure' ? "0" : "5,5")
        .style("animation", d => d.type !== 'structure' ? "flow 2s linear infinite" : "none");

      if (!document.querySelector('#flow-animation-style')) {
        const style = document.createElement('style');
        style.id = 'flow-animation-style';
        style.textContent = `
          @keyframes flow {
            0% { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: 20; }
          }
        `;
        document.head.appendChild(style);
      }

      if (!simulation) {
        const nodeSelection = g.selectAll(".node-group")
          .data(networkData.nodes, (d: any) => d.id);

        const nodeEnter = nodeSelection.enter().append("g")
          .attr("class", "node-group cursor-pointer")
          .call(d3.drag<any, any>()
            .on("start", (event, d) => {
              if (!event.active) newSimulation.alphaTarget(0.3).restart();
              d.fx = d.x;
              d.fy = d.y;
            })
            .on("drag", (event, d) => {
              d.fx = event.x;
              d.fy = event.y;
            })
            .on("end", (event, d) => {
              if (!event.active) newSimulation.alphaTarget(0);
              if (d.type === 'root' || d.type === 'sector') {
                d.fx = d.x;
                d.fy = d.y;
              } else {
                d.fx = null;
                d.fy = null;
              }
            }));

        nodeEnter.append("circle")
          .attr("r", (d: Node) => {
            const baseSize = Math.max(d.size * forceStrength, 8);
            // Ensure size hierarchy is maintained
            switch(d.type) {
              case 'root': return Math.max(baseSize, 16);
              case 'sector': return Math.max(baseSize, 14);
              case 'subsector': return Math.max(baseSize, 12);
              case 'organization': return Math.max(baseSize, 10);
              case 'distribution': return Math.max(baseSize, 8);
              case 'community': return Math.max(baseSize, 6);
              default: return baseSize;
            }
          })
          .attr("fill", (d: Node) => d.color)
          .attr("stroke", (d: Node) => d.color)
          .attr("stroke-width", Math.max(2 * forceStrength, 1));

        nodeEnter.append("text")
          .text((d: Node) => {
            const maxLength = dimensions.width < 768 ? 12 : 20;
            return d.name.length > maxLength ? d.name.substring(0, maxLength - 3) + "..." : d.name;
          })
          .attr("dy", (d: Node) => {
            const radius = Math.max(d.size * forceStrength, 8);
            const sizeAdjustedRadius = d.type === 'root' ? Math.max(radius, 16) :
                                    d.type === 'sector' ? Math.max(radius, 14) :
                                    d.type === 'subsector' ? Math.max(radius, 12) :
                                    d.type === 'organization' ? Math.max(radius, 10) :
                                    d.type === 'distribution' ? Math.max(radius, 8) :
                                    Math.max(radius, 6);
            return sizeAdjustedRadius + 15;
          })
          .attr("text-anchor", "middle")
          .style("font-size", `${Math.max(10 * forceStrength, 8)}px`)
          .style("fill", "white");

        const node = nodeEnter.merge(nodeSelection);

        node.on("click", (event, d) => {
          onNodeSelect(d);
        });

        newSimulation.on("tick", () => {
          link
            .attr("x1", (d: any) => d.source.x)
            .attr("y1", (d: any) => d.source.y)
            .attr("x2", (d: any) => d.target.x)
            .attr("y2", (d: any) => d.target.y);

          node.attr("transform", (d: Node) => `translate(${d.x},${d.y})`);
        });
      } else {
        newSimulation.force("link", d3.forceLink(allVisibleLinks).id((d: any) => d.id).distance(d => {
          const scaledDistance = (linkDistances[d.type] || 100) * forceStrength;
          return Math.max(scaledDistance, 30);
        }));
        
        newSimulation.alpha(0.3).restart();
        
        newSimulation.on("tick", () => {
          link
            .attr("x1", (d: any) => d.source.x)
            .attr("y1", (d: any) => d.source.y)
            .attr("x2", (d: any) => d.target.x)
            .attr("y2", (d: any) => d.target.y);

          g.selectAll(".node-group").attr("transform", (d: Node) => `translate(${d.x},${d.y})`);
        });
      }

      setSimulation(newSimulation);

      return () => {
        if (!simulation) {
          newSimulation.stop();
        }
      };
    }, [networkData, isTraversalMode, traversalPath, onNodeSelect, onTraversalPathUpdate, toast, visibleLinkTypes, linkDistances, dimensions, transform]);

    return (
      <div ref={containerRef} className="w-full h-full bg-slate-900 rounded-lg overflow-hidden relative">
        {/* Simplified Top Controls */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <Button
            onClick={() => setShowControlModal(!showControlModal)}
            className="px-3 py-1 rounded text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            <Settings className="w-4 h-4 mr-1" />
            Controls
          </Button>
          <Button
            onClick={resetView}
            className="px-3 py-1 rounded text-sm font-medium bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors"
          >
            Reset View
          </Button>
        </div>

        {/* Enhanced Control Modal */}
        {showControlModal && (
          <div
            ref={controlModalRef}
            className="fixed z-50 select-none touch-none"
            style={{
              left: `${controlModalPosition.x}px`,
              top: `${controlModalPosition.y}px`,
              width: `${controlModalSize.width}px`,
              height: `${controlModalSize.height}px`,
              transform: isDraggingModal || isResizingModal ? 'scale(1.02)' : 'scale(1)',
              transition: isDraggingModal || isResizingModal ? 'none' : 'transform 0.2s ease'
            }}
          >
            <Card className="bg-slate-800/95 border-slate-600 backdrop-blur-sm shadow-2xl h-full flex flex-col">
              <CardHeader 
                className="pb-2 cursor-move flex-shrink-0"
                onMouseDown={handleModalMouseDown}
                onTouchStart={handleModalTouchStart}
              >
                <CardTitle className="text-blue-300 text-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-slate-400" />
                    Graph Controls
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowControlModal(false)}
                    className="text-slate-400 hover:text-white p-1 h-auto"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 flex-1 overflow-y-auto">
                {/* Interaction Mode */}
                <div>
                  <h4 className="text-white font-medium mb-3">Interaction Mode</h4>
                  <div className="space-y-2">
                    <Button
                      variant={interactionMode === 'pan-zoom' ? "default" : "outline"}
                      onClick={() => setInteractionMode('pan-zoom')}
                      className="w-full justify-start text-sm py-2"
                    >
                      <Move className="w-4 h-4 mr-2" />
                      Pan & Zoom Mode
                    </Button>
                    <Button
                      variant={interactionMode === 'rotate' ? "default" : "outline"}
                      onClick={() => setInteractionMode('rotate')}
                      className="w-full justify-start text-sm py-2"
                    >
                      <RotateCw className="w-4 h-4 mr-2" />
                      Rotate Mode
                    </Button>
                  </div>
                  <div className="text-xs text-slate-400 mt-2">
                    {interactionMode === 'pan-zoom' 
                      ? "Drag to pan • Scroll/pinch to zoom"
                      : "Drag to rotate the entire graph"
                    }
                  </div>
                </div>

                {/* Link Visibility */}
                <div>
                  <h4 className="text-white font-medium mb-3">Link Types</h4>
                  <div className="space-y-3">
                    {[
                      { type: 'structure', label: 'Structure', color: '#666', description: 'Organizational hierarchy' },
                      { type: 'grant-flow', label: 'Grant Flow', color: '#4CAF50', description: 'Funding distribution' },
                      { type: 'service-flow', label: 'Service Flow', color: '#2196F3', description: 'Service delivery' },
                      { type: 'knowledge-flow', label: 'Knowledge Flow', color: '#FF9800', description: 'Information sharing' }
                    ].map(({ type, label, color, description }) => (
                      <div key={type} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Switch
                            checked={visibleLinkTypes.includes(type)}
                            onCheckedChange={(checked) => handleLinkTypeToggle(type, checked)}
                            disabled={type === 'structure'}
                          />
                          <div>
                            <div className="text-sm text-white flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: color }}
                              />
                              {label}
                            </div>
                            <div className="text-xs text-slate-400">{description}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Link Distances */}
                <div>
                  <h4 className="text-white font-medium mb-3">Link Distances</h4>
                  <div className="space-y-4">
                    {Object.entries(linkDistances).map(([type, distance]) => (
                      <div key={type}>
                        <div className="flex justify-between items-center mb-2">
                          <Label className="text-sm text-slate-300 capitalize">
                            {type.replace('-', ' ')}
                          </Label>
                          <span className="text-xs text-slate-400">{distance}</span>
                        </div>
                        <Slider
                          value={[distance]}
                          onValueChange={(value) => handleDistanceChange(type, value)}
                          max={300}
                          min={50}
                          step={10}
                          className="w-full"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Current Transform */}
                <div>
                  <h4 className="text-white font-medium mb-2">Current Transform</h4>
                  <div className="text-xs text-slate-300 space-y-1">
                    <div>Rotation: {Math.round(transform.rotation)}°</div>
                    <div>Scale: {transform.scale.toFixed(2)}x</div>
                    <div>Position: ({Math.round(transform.translateX)}, {Math.round(transform.translateY)})</div>
                  </div>
                </div>
              </CardContent>
              
              {/* Resize Handle */}
              <div
                className="absolute bottom-0 right-0 w-6 h-6 cursor-se-resize touch-none"
                onMouseDown={handleModalResizeStart}
                onTouchStart={handleModalResizeTouchStart}
              >
                <Maximize2 className="w-4 h-4 text-slate-400 absolute bottom-1 right-1" />
              </div>
            </Card>
          </div>
        )}

        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          className="w-full h-full cursor-move"
          style={{ minHeight: '100%' }}
        />
      </div>
    );
  }
);

NetworkGraph.displayName = "NetworkGraph";
