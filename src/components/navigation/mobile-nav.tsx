"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  GraduationCap, 
  BookOpen, 
  Home, 
  CreditCard, 
  Users, 
  Info, 
  LogIn, 
  UserPlus,
  X,
  Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <Button 
        variant="ghost" 
        size="icon" 
        className="text-muted-foreground hover:text-foreground transition-colors"
        onClick={() => setIsOpen(true)}
        aria-label="Open mobile menu"
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Mobile navigation overlay */}
      <div 
        className={`fixed inset-0 bg-background/80 backdrop-blur-sm z-50 transition-all duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div 
          className={`fixed right-0 top-0 h-full w-full max-w-xs bg-background border-l border-neutral-200 dark:border-neutral-800 p-6 shadow-xl transition-transform duration-500 ease-in-out ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between mb-8">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-2xl font-bold"
              onClick={() => setIsOpen(false)}
            >
              <GraduationCap className="h-6 w-6 text-primary" />
              <span>LearnHub</span>
            </Link>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsOpen(false)}
              aria-label="Close mobile menu"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="flex flex-col gap-1">
            <NavItem href="/" icon={<Home className="h-4 w-4 mr-3" />} onClick={() => setIsOpen(false)}>
              Home
            </NavItem>
            <NavItem href="/courses" icon={<BookOpen className="h-4 w-4 mr-3" />} onClick={() => setIsOpen(false)}>
              Browse Courses
            </NavItem>
            <NavItem href="/pricing" icon={<CreditCard className="h-4 w-4 mr-3" />} onClick={() => setIsOpen(false)}>
              Pricing
            </NavItem>
            <NavItem href="/community" icon={<Users className="h-4 w-4 mr-3" />} onClick={() => setIsOpen(false)}>
              Community
            </NavItem>
            <NavItem href="/about" icon={<Info className="h-4 w-4 mr-3" />} onClick={() => setIsOpen(false)}>
              About
            </NavItem>
          </nav>

          <div className="mt-8 pt-8 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
            <Link href="/sign-in" onClick={() => setIsOpen(false)}>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <LogIn className="h-4 w-4 mr-2" /> Sign In
              </Button>
            </Link>
            <Link href="/sign-up" onClick={() => setIsOpen(false)}>
              <Button className="w-full justify-start" size="sm">
                <UserPlus className="h-4 w-4 mr-2" /> Get Started
              </Button>
            </Link>
          </div>

          <div className="absolute bottom-6 left-6 right-6">
            <p className="text-xs text-muted-foreground text-center">
              &copy; {new Date().getFullYear()} LearnHub. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
}

function NavItem({ href, icon, children, onClick }: NavItemProps) {
  return (
    <Link 
      href={href} 
      className="flex items-center py-3 px-4 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      onClick={onClick}
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
} 