
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Network, Users, TrendingUp, Shield, Brain, Target } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Header */}
      <header className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <Network className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Market Capital Transformations</h1>
              <p className="text-blue-300 text-sm">Powered by AutoNateAI Strategy Networks</p>
            </div>
          </div>
          <Button 
            onClick={() => navigate('/login')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Access Graph Tool
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-white mb-6">
            Strategic Network Intelligence for
            <span className="text-blue-400 block mt-2">Defense & Government Operations</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Visualize, analyze, and optimize complex networks of resources, services, and stakeholder relationships
            across defense and government sectors with AI-powered strategic insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/login')}
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3"
            >
              Launch Graph Tool
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white text-lg px-8 py-3"
            >
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-white mb-4">Powered by AutoNateAI Intelligence</h3>
          <p className="text-gray-300 text-lg">Advanced AI-driven network analysis for strategic decision making</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
            <CardHeader>
              <Network className="w-12 h-12 text-blue-400 mb-4" />
              <CardTitle className="text-white">Network Visualization</CardTitle>
              <CardDescription className="text-gray-300">
                Interactive D3.js powered graph visualization with hierarchical layouts and real-time dynamics
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
            <CardHeader>
              <Users className="w-12 h-12 text-green-400 mb-4" />
              <CardTitle className="text-white">Stakeholder Mapping</CardTitle>
              <CardDescription className="text-gray-300">
                Map complex relationships between government, education, business, and community sectors
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
            <CardHeader>
              <TrendingUp className="w-12 h-12 text-yellow-400 mb-4" />
              <CardTitle className="text-white">Flow Analysis</CardTitle>
              <CardDescription className="text-gray-300">
                Track grant flows, service distribution, and knowledge transfer across networks
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
            <CardHeader>
              <Shield className="w-12 h-12 text-red-400 mb-4" />
              <CardTitle className="text-white">Security-First Design</CardTitle>
              <CardDescription className="text-gray-300">
                Built for defense and government use with secure authentication and data handling
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
            <CardHeader>
              <Brain className="w-12 h-12 text-purple-400 mb-4" />
              <CardTitle className="text-white">AI-Powered Insights</CardTitle>
              <CardDescription className="text-gray-300">
                AutoNateAI algorithms identify optimal paths, disconnects, and strategic opportunities
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
            <CardHeader>
              <Target className="w-12 h-12 text-orange-400 mb-4" />
              <CardTitle className="text-white">Path Optimization</CardTitle>
              <CardDescription className="text-gray-300">
                Build and visualize strategic pathways, identify gaps, and optimize resource allocation
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="bg-slate-800/30 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-8">Network Impact Metrics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">200M+</div>
              <div className="text-gray-300">People Reached</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">$50B+</div>
              <div className="text-gray-300">Resources Tracked</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-yellow-400 mb-2">1000+</div>
              <div className="text-gray-300">Network Nodes</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">24/7</div>
              <div className="text-gray-300">Real-time Analysis</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 border-t border-slate-700">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-semibold">Powered by AutoNateAI</span>
          </div>
          <div className="text-gray-400 text-sm">
            © 2024 Market Capital Transformations. Strategic AI Solutions for Defense & Government.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
