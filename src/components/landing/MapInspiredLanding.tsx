
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Home, Building2, Zap, Star, ArrowRight, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export const MapInspiredLanding = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6 }
    }
  };

  const features = [
    {
      icon: <Home className="h-6 w-6" />,
      title: "Premium Properties",
      description: "Curated selection of luxury real estate in Baja California"
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Prime Locations",
      description: "Strategic locations with high investment potential"
    },
    {
      icon: <Building2 className="h-6 w-6" />,
      title: "Expert Guidance",
      description: "Professional real estate advisory services"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Fast Transactions",
      description: "Streamlined processes for quick property deals"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 via-cyan-500/10 to-blue-500/10" />
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-teal-400/30 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              x: [null, Math.random() * window.innerWidth]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        ))}
      </div>

      {/* Mouse follower */}
      <motion.div
        className="fixed w-96 h-96 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle, rgba(20, 184, 166, 0.15) 0%, transparent 70%)',
          left: mousePosition.x - 192,
          top: mousePosition.y - 192
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{
          duration: 2,
          repeat: Infinity
        }}
      />

      <motion.div
        className="relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.header 
          className="px-6 py-8"
          variants={itemVariants}
        >
          <nav className="flex items-center justify-between max-w-7xl mx-auto">
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-lg flex items-center justify-center">
                <MapPin className="h-6 w-6 text-slate-900" />
              </div>
              <span className="text-2xl font-bold text-white">INMA</span>
            </motion.div>
            
            <div className="hidden md:flex space-x-8">
              {['Properties', 'About', 'Services', 'Contact'].map((item) => (
                <motion.a
                  key={item}
                  href="#"
                  className="text-slate-300 hover:text-teal-400 transition-colors font-medium"
                  whileHover={{ y: -2 }}
                >
                  {item}
                </motion.a>
              ))}
            </div>
          </nav>
        </motion.header>

        {/* Hero Section */}
        <motion.section 
          className="px-6 py-20"
          variants={itemVariants}
        >
          <div className="max-w-7xl mx-auto text-center">
            <motion.h1 
              className="text-6xl md:text-8xl font-bold text-white mb-8"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              Digital{' '}
              <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Territory
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto"
              variants={itemVariants}
            >
              Explore interconnected digital landscapes and discover exceptional properties in Baja California
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              variants={itemVariants}
            >
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-2xl shadow-teal-500/25 group"
              >
                Explore Properties
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-teal-400/50 text-teal-400 hover:bg-teal-400/10 px-8 py-4 text-lg font-semibold rounded-xl backdrop-blur-sm"
              >
                Learn More
              </Button>
            </motion.div>
          </div>
        </motion.section>

        {/* Features Grid */}
        <motion.section 
          className="px-6 py-20"
          variants={itemVariants}
        >
          <div className="max-w-7xl mx-auto">
            <motion.h2 
              className="text-4xl md:text-5xl font-bold text-white text-center mb-16"
              variants={itemVariants}
            >
              Why Choose{' '}
              <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                INMA
              </span>
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.05,
                    rotateY: 5
                  }}
                  className="group"
                >
                  <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm hover:border-teal-400/50 transition-all duration-300 h-full">
                    <CardContent className="p-6">
                      <motion.div 
                        className="w-12 h-12 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-lg flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-teal-400/25 transition-all"
                        whileHover={{ rotate: 5 }}
                      >
                        <div className="text-slate-900">
                          {feature.icon}
                        </div>
                      </motion.div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-slate-400">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Interactive Map Preview */}
        <motion.section 
          className="px-6 py-20"
          variants={itemVariants}
        >
          <div className="max-w-7xl mx-auto">
            <motion.div 
              className="bg-slate-800/30 rounded-3xl p-8 backdrop-blur-sm border border-slate-700/50"
              whileHover={{ scale: 1.01 }}
            >
              <h3 className="text-3xl font-bold text-white text-center mb-8">
                Interactive Property Map
              </h3>
              
              <div className="relative h-96 bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-2xl overflow-hidden">
                {/* Simulated map interface */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="text-6xl text-teal-400/50"
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity 
                    }}
                  >
                    <MapPin />
                  </motion.div>
                </div>
                
                {/* Floating property markers */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-4 h-4 bg-teal-400 rounded-full shadow-lg shadow-teal-400/50"
                    style={{
                      left: `${20 + Math.random() * 60}%`,
                      top: `${20 + Math.random() * 60}%`
                    }}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{
                      duration: 2 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 2
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Contact CTA */}
        <motion.section 
          className="px-6 py-20"
          variants={itemVariants}
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2 
              className="text-4xl md:text-5xl font-bold text-white mb-8"
              variants={itemVariants}
            >
              Ready to Find Your{' '}
              <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                Dream Property?
              </span>
            </motion.h2>
            
            <motion.p 
              className="text-xl text-slate-300 mb-12"
              variants={itemVariants}
            >
              Connect with our expert agents today and discover the perfect property for your needs.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              variants={itemVariants}
            >
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-2xl shadow-teal-500/25 group"
              >
                <Phone className="mr-2 h-5 w-5" />
                Call Now
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-teal-400/50 text-teal-400 hover:bg-teal-400/10 px-8 py-4 text-lg font-semibold rounded-xl backdrop-blur-sm group"
              >
                <Mail className="mr-2 h-5 w-5" />
                Email Us
              </Button>
            </motion.div>
          </div>
        </motion.section>
      </motion.div>
    </div>
  );
};
