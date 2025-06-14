
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
}

interface NodeModalProps {
  node: Node | null;
  isOpen: boolean;
  onClose: () => void;
}

export const NodeModal = ({ node, isOpen, onClose }: NodeModalProps) => {
  if (!node) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div 
              className="w-4 h-4 rounded-full" 
              style={{ backgroundColor: node.color }}
            />
            {node.name}
            <Badge variant="outline" className="border-slate-600 text-slate-300">
              {node.type}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {node.description && (
            <Card className="bg-slate-700/50 border-slate-600">
              <CardHeader>
                <CardTitle className="text-lg text-blue-300">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">{node.description}</p>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {node.funding && (
              <Card className="bg-slate-700/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-sm text-green-300">Funding</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white font-semibold">{node.funding}</p>
                </CardContent>
              </Card>
            )}

            {node.population && (
              <Card className="bg-slate-700/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-sm text-blue-300">Population Served</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white font-semibold">{node.population}</p>
                </CardContent>
              </Card>
            )}

            {node.channels && (
              <Card className="bg-slate-700/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-sm text-yellow-300">Distribution Channels</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white font-semibold">{node.channels}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {node.grants && node.grants.length > 0 && (
            <Card className="bg-slate-700/50 border-slate-600">
              <CardHeader>
                <CardTitle className="text-lg text-green-300">Grants & Programs</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {node.grants.map((grant, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">•</span>
                      <span className="text-gray-300">{grant}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {node.needs && node.needs.length > 0 && (
            <Card className="bg-slate-700/50 border-slate-600">
              <CardHeader>
                <CardTitle className="text-lg text-orange-300">Key Needs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {node.needs.map((need, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="border-orange-600 text-orange-300"
                    >
                      {need}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="bg-slate-700/50 border-slate-600">
            <CardHeader>
              <CardTitle className="text-lg text-gray-300">Technical Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Node ID:</span>
                <span className="text-white font-mono text-sm">{node.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Size:</span>
                <span className="text-white">{node.size}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Color:</span>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded border border-gray-600" 
                    style={{ backgroundColor: node.color }}
                  />
                  <span className="text-white font-mono text-sm">{node.color}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
