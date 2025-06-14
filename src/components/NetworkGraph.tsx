
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
}

export const NetworkGraph = forwardRef<NetworkGraphRef, NetworkGraphProps>(
  ({ onNodeSelect, isTraversalMode, traversalPath, onTraversalPathUpdate }, ref) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const { toast } = useToast();
    const [simulation, setSimulation] = useState<d3.Simulation<Node, Link> | null>(null);
    const [networkData, setNetworkData] = useState<NetworkData>({
      nodes: [
        { id: "root", name: "Community Distribution Network", type: "root", color: "#FFFFFF", size: 15 },
        { id: "gov", name: "Government Sector", type: "sector", color: "#FF6B6B", size: 12, description: "Policy makers and public service providers", funding: "$50B+", population: "328M citizens" },
        { id: "edu", name: "Higher Education", type: "sector", color: "#4ECDC4", size: 12, description: "Universities, colleges, and research institutions", funding: "$70B+", population: "20M students" },
        { id: "biz", name: "Business Sector", type: "sector", color: "#45B7D1", size: 12, description: "Private companies and corporate entities", funding: "$25B+ CSR", population: "160M employees" },
      ],
      links: [
        { source: "root", target: "gov", type: "structure" },
        { source: "root", target: "edu", type: "structure" },
        { source: "root", target: "biz", type: "structure" },
      ]
    });

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
        // Implementation for adding data to network
        console.log("Adding data to network:", data);
      }
    }));

    useEffect(() => {
      if (!svgRef.current) return;

      const width = 800;
      const height = 600;
      
      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove();
      
      const g = svg.append("g");

      const newSimulation = d3.forceSimulation(networkData.nodes)
        .force("link", d3.forceLink(networkData.links).id((d: any) => d.id).distance(100))
        .force("charge", d3.forceManyBody().strength(-300))
        .force("center", d3.forceCenter(width / 2, height / 2));

      const link = g.append("g")
        .selectAll("line")
        .data(networkData.links)
        .join("line")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .attr("stroke-width", 2);

      const node = g.append("g")
        .selectAll("g")
        .data(networkData.nodes)
        .join("g")
        .attr("class", "cursor-pointer")
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
            d.fx = null;
            d.fy = null;
          }));

      node.append("circle")
        .attr("r", (d: Node) => d.size)
        .attr("fill", (d: Node) => d.color)
        .attr("stroke", (d: Node) => d.color)
        .attr("stroke-width", 2);

      node.append("text")
        .text((d: Node) => d.name.length > 20 ? d.name.substring(0, 18) + "..." : d.name)
        .attr("dy", (d: Node) => d.size + 15)
        .attr("text-anchor", "middle")
        .style("font-size", "10px")
        .style("fill", "white");

      node.on("click", (event, d) => {
        if (isTraversalMode) {
          const newPath = [...traversalPath, d];
          onTraversalPathUpdate(newPath);
          toast({
            title: "Node Added to Path",
            description: `${d.name} added to traversal path (${newPath.length} nodes)`,
          });
        } else {
          onNodeSelect(d);
        }
      });

      newSimulation.on("tick", () => {
        link
          .attr("x1", (d: any) => d.source.x)
          .attr("y1", (d: any) => d.source.y)
          .attr("x2", (d: any) => d.target.x)
          .attr("y2", (d: any) => d.target.y);

        node.attr("transform", (d: Node) => `translate(${d.x},${d.y})`);
      });

      setSimulation(newSimulation);

      return () => {
        newSimulation.stop();
      };
    }, [networkData, isTraversalMode, traversalPath, onNodeSelect, onTraversalPathUpdate, toast]);

    return (
      <div className="w-full h-full bg-slate-900 rounded-lg overflow-hidden">
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          viewBox="0 0 800 600"
          className="w-full h-full"
        />
      </div>
    );
  }
);

NetworkGraph.displayName = "NetworkGraph";
