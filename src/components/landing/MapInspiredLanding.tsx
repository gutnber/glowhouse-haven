
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Map, Navigation, Globe, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export const MapInspiredLanding = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      {/* Animated Background Grid */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(20, 184, 166, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(20, 184, 166, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'grid-move 20s linear infinite'
        }}
      />

      {/* Dynamic Mouse Cursor Effect */}
      <div 
        className="fixed w-96 h-96 rounded-full pointer-events-none z-10 opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(20, 184, 166, 0.4) 0%, transparent 70%)',
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
          transition: 'all 0.1s ease-out'
        }}
      />

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-teal-400 rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className={`relative z-20 container mx-auto px-6 pt-32 pb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="inline-block mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full blur-xl opacity-50 animate-pulse" />
              <div className="relative bg-slate-800 border border-teal-400/30 rounded-full p-4">
                <Map className="h-8 w-8 text-teal-400" />
              </div>
            </div>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-white via-teal-100 to-cyan-200 bg-clip-text text-transparent animate-fade-in">
            Explore the
            <span className="block bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
              Digital Territory
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-12 opacity-0 animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
            Navigate through interconnected nodes of innovation, where every connection tells a story and every path leads to discovery.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center opacity-0 animate-fade-in" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
            <Button 
              asChild
              size="lg" 
              className="group bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white border-0 shadow-lg hover:shadow-teal-500/25 transition-all duration-300 rounded-full px-8 py-6 text-lg font-semibold"
            >
              <Link to="/properties" className="flex items-center gap-3">
                Begin Journey
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="group border-teal-400/50 text-teal-400 hover:bg-teal-500/10 hover:border-teal-400 transition-all duration-300 rounded-full px-8 py-6 text-lg backdrop-blur-sm"
            >
              <Navigation className="h-5 w-5 mr-3 group-hover:rotate-12 transition-transform" />
              View Map
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {[
            {
              icon: Globe,
              title: "Global Network",
              description: "Connected nodes spanning across digital landscapes, creating infinite possibilities for exploration and discovery.",
              delay: "0.2s"
            },
            {
              icon: Navigation,
              title: "Smart Navigation",
              description: "Intelligent pathfinding algorithms that adapt to your journey, ensuring optimal routes through complex territories.",
              delay: "0.4s"
            },
            {
              icon: Zap,
              title: "Real-time Sync",
              description: "Live updates and dynamic connections that evolve with your interactions, powered by cutting-edge technology.",
              delay: "0.6s"
            }
          ].map((feature, index) => (
            <div 
              key={index}
              className={`group relative bg-slate-800/50 backdrop-blur-xl border border-teal-400/20 rounded-2xl p-8 hover:border-teal-400/50 transition-all duration-500 hover:scale-105 opacity-0 animate-fade-in`}
              style={{ animationDelay: feature.delay, animationFillMode: 'forwards' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-cyan-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative">
                <div className="inline-block mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-400/20 to-cyan-400/20 rounded-full blur-lg group-hover:blur-xl transition-all duration-500" />
                    <div className="relative bg-slate-700/50 border border-teal-400/30 rounded-full p-4 group-hover:border-teal-400/50 transition-colors duration-300">
                      <feature.icon className="h-8 w-8 text-teal-400 group-hover:text-teal-300 transition-colors duration-300" />
                    </div>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-teal-100 transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-slate-300 leading-relaxed group-hover:text-slate-200 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Network Visualization */}
        <div className="relative h-96 bg-slate-800/30 backdrop-blur-xl rounded-3xl border border-teal-400/20 overflow-hidden mb-20">
          <div className="absolute inset-0 opacity-40">
            <svg className="w-full h-full">
              {/* Animated connection lines */}
              {[...Array(8)].map((_, i) => (
                <g key={i}>
                  <line
                    x1={`${20 + i * 10}%`}
                    y1="20%"
                    x2={`${60 + i * 5}%`}
                    y2="80%"
                    stroke="url(#gradient)"
                    strokeWidth="2"
                    opacity="0.6"
                    className="animate-pulse"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                  <circle
                    cx={`${20 + i * 10}%`}
                    cy="20%"
                    r="4"
                    fill="#14b8a6"
                    opacity="0.8"
                    className="animate-pulse"
                    style={{ animationDelay: `${i * 0.3}s` }}
                  />
                </g>
              ))}
              
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.2" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-white mb-4">
                Live Network Activity
              </h3>
              <p className="text-slate-300 text-lg">
                Watch connections form in real-time
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="inline-block relative">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-400/20 to-cyan-400/20 rounded-full blur-2xl animate-pulse" />
            <Button 
              asChild
              size="lg"
              className="relative group bg-gradient-to-r from-slate-800 to-slate-700 border border-teal-400/50 text-teal-400 hover:from-teal-500 hover:to-cyan-500 hover:text-white hover:border-transparent transition-all duration-500 rounded-full px-12 py-6 text-xl font-semibold shadow-2xl"
            >
              <Link to="/contact" className="flex items-center gap-3">
                Connect With Us
                <div className="w-3 h-3 bg-teal-400 rounded-full group-hover:bg-white animate-pulse" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
