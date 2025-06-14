
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Network, Brain, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate authentication delay
    setTimeout(() => {
      if (username === "autonateai" && password === "LearnAIWithAutoNate") {
        toast({
          title: "Authentication Successful",
          description: "Welcome to the AutoNateAI Strategic Network Graph",
        });
        navigate("/graph");
      } else {
        toast({
          title: "Authentication Failed",
          description: "Invalid credentials. Please check your username and password.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center">
              <Network className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Strategic Graph Access</h1>
          <p className="text-blue-300">Market Capital Transformations</p>
          <div className="flex items-center justify-center mt-2 text-sm text-gray-400">
            <Brain className="w-4 h-4 mr-1" />
            <span>Powered by AutoNateAI</span>
          </div>
        </div>

        {/* Login Form */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-white">Secure Access Portal</CardTitle>
            <CardDescription className="text-gray-300">
              Enter your credentials to access the network graph tool
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-white">Password</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowHint(!showHint)}
                    className="text-blue-400 hover:text-blue-300 text-xs"
                  >
                    {showHint ? "Hide Hint" : "Show Hint"}
                  </Button>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {showHint && (
                <Alert className="bg-blue-900/30 border-blue-600">
                  <AlertDescription className="text-blue-200 text-sm">
                    <strong>Dev Environment Hint:</strong><br />
                    Username: autonateai<br />
                    Password: LearnAIWithAutoNate
                  </AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700" 
                disabled={isLoading}
              >
                {isLoading ? "Authenticating..." : "Access Graph Tool"}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-700">
              <div className="text-center text-sm text-gray-400">
                <p>Authorized Personnel Only</p>
                <p className="mt-1">Defense & Government Network Analysis</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back to Landing */}
        <div className="text-center mt-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="text-blue-400 hover:text-blue-300"
          >
            ← Back to Landing Page
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
