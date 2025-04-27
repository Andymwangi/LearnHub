"use client";

import { useState } from "react";
import Image from "next/image";
import { User } from "lucide-react";

interface UserAvatarProps {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export function UserAvatar({ name, email, image }: UserAvatarProps) {
  // Get initials from name or email
  const getInitials = (): string => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
    }
    
    if (email) {
      return email[0].toUpperCase();
    }
    
    return "U";
  };

  return (
    <div className="relative">
      <div className="h-9 w-9 rounded-full overflow-hidden border">
        {image ? (
          <Image
            src={image}
            alt={name || email || "User"}
            width={36}
            height={36}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-primary/10 flex items-center justify-center">
            {getInitials() ? (
              <span className="text-sm font-medium text-primary">{getInitials()}</span>
            ) : (
              <User className="h-5 w-5 text-primary" />
            )}
          </div>
        )}
      </div>
    </div>
  );
} 