import { forwardRef, useImperativeHandle, useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { useToast } from "@/hooks/use-toast";

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
    
    const [networkData, setNetworkData] = useState<NetworkData>({
      nodes: [
        { id: "root", name: "Community Distribution Network", type: "root", color: "#FFFFFF", size: 15 },
        { id: "gov", name: "Government Sector", type: "sector", color: "#FF6B6B", size: 12, description: "Policy makers and public service providers", funding: "$50B+", population: "328M citizens" },
        { id: "edu", name: "Higher Education", type: "sector", color: "#4ECDC4", size: 12, description: "Universities, colleges, and research institutions", funding: "$70B+", population: "20M students" },
        { id: "biz", name: "Business Sector", type: "sector", color: "#45B7D1", size: 12, description: "Private companies and corporate entities", funding: "$25B+ CSR", population: "160M employees" },
        { id: "fed", name: "Federal Agencies", type: "subsector", color: "#FF8A8A", size: 10 },
        { id: "state", name: "State & Local", type: "subsector", color: "#FF8A8A", size: 10 },
        { id: "research", name: "Research Universities", type: "subsector", color: "#6ED7D3", size: 10 },
        { id: "community", name: "Community Colleges", type: "subsector", color: "#6ED7D3", size: 10 },
        { id: "corp", name: "Large Corporations", type: "subsector", color: "#69C3E7", size: 10 },
        { id: "sme", name: "Small-Medium Enterprises", type: "subsector", color: "#69C3E7", size: 10 },
        { id: "hhs", name: "Health & Human Services", type: "organization", color: "#96CEB4", size: 8, grants: ["Community Health: $2.1B", "Mental Health: $1.8B"], channels: 4 },
        { id: "doe", name: "Department of Education", type: "organization", color: "#96CEB4", size: 8, grants: ["Title I: $18.4B", "STEM: $3.2B"], channels: 3 },
        { id: "sba", name: "Small Business Admin", type: "organization", color: "#96CEB4", size: 8, grants: ["Small Business: $500M", "Innovation: $300M"], channels: 5 },
        { id: "nsf", name: "National Science Foundation", type: "organization", color: "#96CEB4", size: 8, grants: ["Research Grants: $8.5B"], channels: 3 },
        { id: "nih", name: "National Institutes of Health", type: "organization", color: "#96CEB4", size: 8, grants: ["Medical Research: $42B"], channels: 4 },
        { id: "tech-corps", name: "Tech Companies", type: "organization", color: "#96CEB4", size: 8, grants: ["Digital Equity: $2.5B", "STEM Ed: $1.2B"], channels: 6 },
        { id: "health-corps", name: "Healthcare Companies", type: "organization", color: "#96CEB4", size: 8, grants: ["Health Equity: $1.8B"], channels: 3 },
        { id: "health-centers", name: "Community Health Centers", type: "distribution", color: "#FFEAA7", size: 6 },
        { id: "schools", name: "Educational Institutions", type: "distribution", color: "#FFEAA7", size: 6 },
        { id: "libraries", name: "Public Libraries", type: "distribution", color: "#FFEAA7", size: 6 },
        { id: "community-centers", name: "Community Centers", type: "distribution", color: "#FFEAA7", size: 6 },
        { id: "extension", name: "Extension Programs", type: "distribution", color: "#FFEAA7", size: 6 },
        { id: "online", name: "Digital Platforms", type: "distribution", color: "#FFEAA7", size: 6 },
        { id: "mobile-units", name: "Mobile Services", type: "distribution", color: "#FFEAA7", size: 6 },
        { id: "nonprofits", name: "Nonprofit Partners", type: "distribution", color: "#FFEAA7", size: 6 },
        { id: "workforce", name: "Workforce Centers", type: "distribution", color: "#FFEAA7", size: 6 },
        { id: "rural", name: "Rural Communities", type: "community", color: "#DDA0DD", size: 5, population: "60M", needs: ["Healthcare", "Broadband", "Economic Development"] },
        { id: "urban", name: "Urban Communities", type: "community", color: "#DDA0DD", size: 5, population: "80M", needs: ["Housing", "Education", "Healthcare"] },
        { id: "seniors", name: "Senior Citizens", type: "community", color: "#DDA0DD", size: 5, population: "54M", needs: ["Healthcare", "Technology", "Social Services"] },
        { id: "students", name: "Students", type: "community", color: "#DDA0DD", size: 5, population: "76M", needs: ["Education", "Financial Aid", "Career Prep"] },
        { id: "entrepreneurs", name: "Entrepreneurs", type: "community", color: "#DDA0DD", size: 5, population: "2M", needs: ["Funding", "Mentorship", "Market Access"] },
        { id: "chronic-patients", name: "Chronic Disease Patients", type: "community", color: "#DDA0DD", size: 5, population: "133M", needs: ["Care Coordination", "Medication", "Support"] },
        { id: "underserved", name: "Underserved Populations", type: "community", color: "#DDA0DD", size: 5, population: "50M", needs: ["Access to Services", "Equity", "Representation"] }
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
      
      // Scale distances based on screen size
      const baseDistance = Math.min(dimensions.width, dimensions.height) * 0.15;
      const sectorDistance = Math.min(dimensions.width, dimensions.height) * 0.25;
      
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

      if (!svg.property("__zoom_added__")) {
        const zoom = d3.zoom()
          .scaleExtent([0.1, 3])
          .on("zoom", (event) => {
            g.attr("transform", event.transform);
          });

        svg.call(zoom);
        svg.property("__zoom_added__", true);
      }

      if (!simulation) {
        initializeRadialPositions();
      }

      // Scale forces based on screen size
      const forceStrength = Math.min(dimensions.width, dimensions.height) / 1000;

      const newSimulation = simulation || d3.forceSimulation(networkData.nodes)
        .force("link", d3.forceLink(networkData.links).id((d: any) => d.id).distance(d => {
          const scaledDistance = (linkDistances[d.type] || 100) * forceStrength;
          return Math.max(scaledDistance, 30); // Minimum distance
        }))
        .force("charge", d3.forceManyBody().strength(d => {
          const baseStrength = forceStrength * -200;
          switch(d.type) {
            case 'root': return baseStrength * 4;
            case 'sector': return baseStrength * 3;
            case 'subsector': return baseStrength * 2;
            case 'organization': return baseStrength * 1.5;
            case 'distribution': return baseStrength * 1.25;
            case 'community': return baseStrength;
            default: return baseStrength;
          }
        }))
        .force("center", d3.forceCenter(dimensions.width / 2, dimensions.height / 2))
        .force("collision", d3.forceCollide().radius(d => {
          const scaledSize = d.size * forceStrength + 5;
          return Math.max(scaledSize, 10);
        }));

      const visibleLinks = networkData.links.filter(link => visibleLinkTypes.includes(link.type));
      console.log("Visible links count:", visibleLinks.length, "Types:", visibleLinkTypes);

      const linkSelection = g.selectAll("line")
        .data(visibleLinks, (d: any) => `${d.source.id || d.source}-${d.target.id || d.target}`);

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
        .attr("stroke-opacity", 0.6)
        .attr("stroke-width", Math.max(2 * forceStrength, 1))
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
          .attr("r", (d: Node) => Math.max(d.size * forceStrength, 8))
          .attr("fill", (d: Node) => d.color)
          .attr("stroke", (d: Node) => d.color)
          .attr("stroke-width", Math.max(2 * forceStrength, 1));

        nodeEnter.append("text")
          .text((d: Node) => {
            const maxLength = dimensions.width < 768 ? 12 : 20;
            return d.name.length > maxLength ? d.name.substring(0, maxLength - 3) + "..." : d.name;
          })
          .attr("dy", (d: Node) => Math.max(d.size * forceStrength, 8) + 15)
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
        newSimulation.force("link", d3.forceLink(visibleLinks).id((d: any) => d.id).distance(d => {
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
    }, [networkData, isTraversalMode, traversalPath, onNodeSelect, onTraversalPathUpdate, toast, visibleLinkTypes, linkDistances, dimensions]);

    return (
      <div ref={containerRef} className="w-full h-full bg-slate-900 rounded-lg overflow-hidden">
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
