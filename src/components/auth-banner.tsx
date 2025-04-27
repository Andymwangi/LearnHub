"use client";

import { LucideBookOpen, LucideGraduationCap, LucideAward, LucideUsers } from "lucide-react";
import { useEffect, useState } from "react";

const features = [
  {
    icon: LucideBookOpen,
    title: "Extensive Course Library",
    description: "Access a wide range of courses across multiple disciplines and topics."
  },
  {
    icon: LucideGraduationCap,
    title: "Learn at Your Pace",
    description: "Flexible learning paths designed to fit your schedule and learning style."
  },
  {
    icon: LucideAward,
    title: "Earn Certificates",
    description: "Receive recognition for your achievements with shareable certificates."
  },
  {
    icon: LucideUsers,
    title: "Join a Community",
    description: "Connect with fellow learners and instructors in an engaging environment."
  }
];

export function AuthBanner() {
  const [activeFeature, setActiveFeature] = useState(0);
  
  // Auto-rotate through features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="hidden lg:flex flex-col justify-between h-full bg-primary/5 p-10 overflow-hidden relative">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-32 -mt-16" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/10 rounded-full -ml-40 -mb-40" />
      
      {/* Logo section */}
      <div className="relative z-10">
        <h1 className="text-4xl font-bold">
          Learn<span className="text-primary">Hub</span>
        </h1>
        <p className="mt-2 text-xl text-muted-foreground">Your gateway to knowledge</p>
      </div>
      
      {/* Main illustration */}
      <div className="relative z-10 flex items-center justify-center py-8">
        <div className="relative w-full max-w-md aspect-square">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2/3 h-2/3 rounded-full bg-primary/20 animate-pulse" />
          </div>
          
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const angle = (index * (360 / features.length) * Math.PI) / 180;
            const isActive = index === activeFeature;
            
            // Position in a circle
            const radius = 40; // percentage of container
            const left = 50 + radius * Math.cos(angle);
            const top = 50 + radius * Math.sin(angle);
            
            return (
              <div
                key={index}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-in-out ${
                  isActive ? "scale-125" : "scale-100"
                }`}
                style={{ left: `${left}%`, top: `${top}%` }}
              >
                <div className={`rounded-full p-3 ${
                  isActive ? "bg-primary text-primary-foreground" : "bg-background text-foreground"
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            );
          })}
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Icon className="w-12 h-12 mx-auto text-primary" />
              <h3 className="text-xl font-semibold mt-4">{features[activeFeature].title}</h3>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features list */}
      <div className="relative z-10 space-y-6">
        <h2 className="text-2xl font-bold">Why choose LearnHub?</h2>
        <div className="space-y-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isActive = index === activeFeature;
            
            return (
              <div 
                key={index}
                className={`flex items-start space-x-3 p-3 rounded-lg transition-colors ${
                  isActive ? "bg-primary/10" : ""
                }`}
              >
                <div className={`rounded-full p-2 ${
                  isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-medium">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Helper component for the active feature
function Icon({ className }: { className?: string }) {
  const ActiveIcon = features[0].icon;
  return <ActiveIcon className={className} />;
} 