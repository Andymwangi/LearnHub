"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { 
  BookOpen, 
  Home, 
  User, 
  Settings, 
  Heart, 
  ShoppingCart, 
  Users, 
  CreditCard,
  LogOut
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarLinkProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
}

const SidebarLink = ({ href, label, icon, isActive }: SidebarLinkProps) => {
  return (
    <Link href={href}>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-2 font-normal",
          isActive ? "bg-muted" : "hover:bg-transparent hover:text-primary"
        )}
      >
        {icon}
        <span>{label}</span>
      </Button>
    </Link>
  );
};

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/dashboard" && pathname === "/dashboard") {
      return true;
    }
    
    return pathname.startsWith(path) && path !== "/dashboard";
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const links = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <Home className="h-5 w-5" />,
    },
    {
      href: "/dashboard/courses",
      label: "My Courses",
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      href: "/dashboard/profile",
      label: "Profile",
      icon: <User className="h-5 w-5" />,
    },
    {
      href: "/dashboard/cart",
      label: "Cart",
      icon: <ShoppingCart className="h-5 w-5" />,
    },
    {
      href: "/dashboard/wishlist",
      label: "Wishlist",
      icon: <Heart className="h-5 w-5" />,
    },
    {
      href: "/dashboard/payment-methods",
      label: "Payment Methods",
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      href: "/dashboard/settings",
      label: "Settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  // Add admin/teacher links if needed
  const adminLinks = [
    {
      href: "/dashboard/admin",
      label: "Admin Dashboard",
      icon: <Users className="h-5 w-5" />,
    },
    {
      href: "/dashboard/teacher",
      label: "Teacher Dashboard",
      icon: <BookOpen className="h-5 w-5" />,
    },
  ];

  return (
    <div className="h-full flex flex-col border-r bg-card">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-8 w-8 flex items-center justify-center bg-primary rounded-md text-primary-foreground">
            <BookOpen className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-bold">LearnHub</h1>
        </Link>
      </div>
      
      <div className="flex-1 px-3 py-4">
        <div className="space-y-1">
          {links.map((link) => (
            <SidebarLink
              key={link.href}
              href={link.href}
              label={link.label}
              icon={link.icon}
              isActive={isActive(link.href)}
            />
          ))}
        </div>
        
        {/* Conditionally show admin links */}
        {pathname.includes("/dashboard/admin") || pathname.includes("/dashboard/teacher") ? (
          <div className="mt-6 pt-6 border-t">
            <h3 className="px-3 text-sm font-medium text-muted-foreground mb-2">Admin</h3>
            <div className="space-y-1">
              {adminLinks.map((link) => (
                <SidebarLink
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  icon={link.icon}
                  isActive={isActive(link.href)}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
      
      <div className="p-4 border-t">
        <Button 
          variant="outline" 
          className="w-full justify-start gap-2"
          onClick={handleSignOut}
        >
          <LogOut className="h-5 w-5" />
          <span>Sign Out</span>
        </Button>
      </div>
    </div>
  );
} 