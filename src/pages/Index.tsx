
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Network, Users, TrendingUp, Shield, Brain, Target } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 overflow-x-hidden">
      {/* Header */}
      <header className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Network className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-white truncate">Market Capital Transformations</h1>
                <p className="text-blue-300 text-xs sm:text-sm truncate">Powered by AutoNateAI Strategy Networks</p>
              </div>
            </div>
            <Button 
              onClick={() => navigate('/login')}
              className="bg-blue-600 hover:bg-blue-700 text-sm sm:text-base w-full sm:w-auto flex-shrink-0"
              size="sm"
            >
              <span className="sm:hidden">Access Tool</span>
              <span className="hidden sm:inline">Access Graph Tool</span>
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            Strategic Network Intelligence for
            <span className="text-blue-400 block mt-1 sm:mt-2">Defense & Government Operations</span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-6 sm:mb-8 leading-relaxed px-2">
            Visualize, analyze, and optimize complex networks of resources, services, and stakeholder relationships
            across defense and government sectors with AI-powered strategic insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/login')}
              className="bg-blue-600 hover:bg-blue-700 text-base sm:text-lg px-6 sm:px-8 py-3 w-full sm:w-auto"
            >
              Launch Graph Tool
              <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white text-base sm:text-lg px-6 sm:px-8 py-3 w-full sm:w-auto"
            >
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">Powered by AutoNateAI Intelligence</h3>
            <p className="text-gray-300 text-base sm:text-lg px-2">Advanced AI-driven network analysis for strategic decision making</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
              <CardHeader className="pb-3 sm:pb-4">
                <Network className="w-10 h-10 sm:w-12 sm:h-12 text-blue-400 mb-3 sm:mb-4" />
                <CardTitle className="text-white text-lg sm:text-xl">Network Visualization</CardTitle>
                <CardDescription className="text-gray-300 text-sm sm:text-base">
                  Interactive D3.js powered graph visualization with hierarchical layouts and real-time dynamics
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
              <CardHeader className="pb-3 sm:pb-4">
                <Users className="w-10 h-10 sm:w-12 sm:h-12 text-green-400 mb-3 sm:mb-4" />
                <CardTitle className="text-white text-lg sm:text-xl">Stakeholder Mapping</CardTitle>
                <CardDescription className="text-gray-300 text-sm sm:text-base">
                  Map complex relationships between government, education, business, and community sectors
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
              <CardHeader className="pb-3 sm:pb-4">
                <TrendingUp className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-400 mb-3 sm:mb-4" />
                <CardTitle className="text-white text-lg sm:text-xl">Flow Analysis</CardTitle>
                <CardDescription className="text-gray-300 text-sm sm:text-base">
                  Track grant flows, service distribution, and knowledge transfer across networks
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
              <CardHeader className="pb-3 sm:pb-4">
                <Shield className="w-10 h-10 sm:w-12 sm:h-12 text-red-400 mb-3 sm:mb-4" />
                <CardTitle className="text-white text-lg sm:text-xl">Security-First Design</CardTitle>
                <CardDescription className="text-gray-300 text-sm sm:text-base">
                  Built for defense and government use with secure authentication and data handling
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
              <CardHeader className="pb-3 sm:pb-4">
                <Brain className="w-10 h-10 sm:w-12 sm:h-12 text-purple-400 mb-3 sm:mb-4" />
                <CardTitle className="text-white text-lg sm:text-xl">AI-Powered Insights</CardTitle>
                <CardDescription className="text-gray-300 text-sm sm:text-base">
                  AutoNateAI algorithms identify optimal paths, disconnects, and strategic opportunities
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
              <CardHeader className="pb-3 sm:pb-4">
                <Target className="w-10 h-10 sm:w-12 sm:h-12 text-orange-400 mb-3 sm:mb-4" />
                <CardTitle className="text-white text-lg sm:text-xl">Path Optimization</CardTitle>
                <CardDescription className="text-gray-300 text-sm sm:text-base">
                  Build and visualize strategic pathways, identify gaps, and optimize resource allocation
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="bg-slate-800/30 rounded-2xl p-6 sm:p-8 text-center">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-6 sm:mb-8">Network Impact Metrics</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              <div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-400 mb-2">200M+</div>
                <div className="text-gray-300 text-sm sm:text-base">People Reached</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-400 mb-2">$50B+</div>
                <div className="text-gray-300 text-sm sm:text-base">Resources Tracked</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-yellow-400 mb-2">1000+</div>
                <div className="text-gray-300 text-sm sm:text-base">Network Nodes</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-purple-400 mb-2">24/7</div>
                <div className="text-gray-300 text-sm sm:text-base">Real-time Analysis</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 border-t border-slate-700">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Brain className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <span className="text-white font-semibold text-sm sm:text-base">Powered by AutoNateAI</span>
            </div>
            <div className="text-gray-400 text-xs sm:text-sm text-center sm:text-right">
              © 2024 Market Capital Transformations. Strategic AI Solutions for Defense & Government.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
