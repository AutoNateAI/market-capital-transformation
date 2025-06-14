
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileText, Clipboard } from "lucide-react";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (data: any) => void;
}

export const UploadModal = ({ isOpen, onClose, onUpload }: UploadModalProps) => {
  const [uploadMethod, setUploadMethod] = useState<'file' | 'text'>('file');
  const [jsonText, setJsonText] = useState('');
  const [status, setStatus] = useState<{type: 'success' | 'error' | 'info', message: string} | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        onUpload(data);
        setStatus({ type: 'success', message: 'File uploaded successfully!' });
        setTimeout(() => onClose(), 2000);
      } catch (error) {
        setStatus({ type: 'error', message: 'Invalid JSON file format.' });
      }
    };
    reader.readAsText(file);
  };

  const handleTextUpload = () => {
    try {
      const data = JSON.parse(jsonText);
      onUpload(data);
      setStatus({ type: 'success', message: 'Data uploaded successfully!' });
      setTimeout(() => onClose(), 2000);
    } catch (error) {
      setStatus({ type: 'error', message: 'Invalid JSON format.' });
    }
  };

  const loadExample = () => {
    const exampleData = {
      "metadata": {
        "name": "Food Security Network",
        "description": "Regional food banks and nutrition assistance programs",
        "version": "1.0",
        "author": "Community Integration Team"
      },
      "nodes": [
        {
          "id": "food-banks",
          "name": "Regional Food Banks",
          "type": "distribution",
          "color": "#FFEAA7",
          "size": 8,
          "description": "Network of food distribution centers serving multiple communities",
          "funding": "$2.3B annually",
          "population": "40M people served"
        }
      ],
      "links": [
        {
          "source": "gov",
          "target": "food-banks",
          "type": "grant-flow",
          "description": "Federal nutrition program funding"
        }
      ]
    };
    
    setJsonText(JSON.stringify(exampleData, null, 2));
    setUploadMethod('text');
    setStatus({ type: 'info', message: 'Example data loaded! Review and upload.' });
  };

  const handleClose = () => {
    setJsonText('');
    setStatus(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload Network Data
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Button
              variant={uploadMethod === 'file' ? 'default' : 'outline'}
              onClick={() => setUploadMethod('file')}
              className={uploadMethod === 'file' ? 'bg-blue-600' : 'border-slate-600 text-white hover:bg-slate-700'}
            >
              <FileText className="w-4 h-4 mr-2" />
              Upload File
            </Button>
            <Button
              variant={uploadMethod === 'text' ? 'default' : 'outline'}
              onClick={() => setUploadMethod('text')}
              className={uploadMethod === 'text' ? 'bg-blue-600' : 'border-slate-600 text-white hover:bg-slate-700'}
            >
              <Clipboard className="w-4 h-4 mr-2" />
              Paste JSON
            </Button>
            <Button
              variant="outline"
              onClick={loadExample}
              className="border-slate-600 text-white hover:bg-slate-700"
            >
              Load Example
            </Button>
          </div>

          {uploadMethod === 'file' ? (
            <div className="space-y-2">
              <label className="block text-sm text-gray-300">Choose JSON file:</label>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="w-full p-3 bg-slate-700 border border-slate-600 rounded-md text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
              />
            </div>
          ) : (
            <div className="space-y-2">
              <label className="block text-sm text-gray-300">Paste JSON data:</label>
              <Textarea
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                placeholder="Paste your JSON data here..."
                className="bg-slate-700 border-slate-600 text-white min-h-[200px] font-mono text-sm"
              />
              <Button
                onClick={handleTextUpload}
                disabled={!jsonText.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Upload Data
              </Button>
            </div>
          )}

          {status && (
            <Alert className={`${
              status.type === 'success' ? 'bg-green-900/30 border-green-600' :
              status.type === 'error' ? 'bg-red-900/30 border-red-600' :
              'bg-blue-900/30 border-blue-600'
            }`}>
              <AlertDescription className={`${
                status.type === 'success' ? 'text-green-300' :
                status.type === 'error' ? 'text-red-300' :
                'text-blue-300'
              }`}>
                {status.message}
              </AlertDescription>
            </Alert>
          )}

          <div className="bg-slate-700/50 p-4 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-300 mb-2">Expected Format:</h4>
            <pre className="text-xs text-gray-300 overflow-x-auto">
{`{
  "metadata": {
    "name": "Network Name",
    "description": "Description"
  },
  "nodes": [
    {
      "id": "unique-id",
      "name": "Node Name",
      "type": "organization",
      "color": "#FF6B6B",
      "size": 8
    }
  ],
  "links": [
    {
      "source": "source-id",
      "target": "target-id",
      "type": "grant-flow"
    }
  ]
}`}
            </pre>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
