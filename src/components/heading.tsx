"use client";

import { LucideIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const headingVariants = cva(
  "flex items-center gap-x-3 py-4",
  {
    variants: {
      size: {
        default: "mb-5",
        sm: "mb-2",
      }
    },
    defaultVariants: {
      size: "default",
    },
  }
);

const iconVariants = cva(
  "rounded-md p-2",
  {
    variants: {
      size: {
        default: "h-10 w-10",
        sm: "h-8 w-8",
      }
    },
    defaultVariants: {
      size: "default",
    },
  }
);

interface HeadingProps extends VariantProps<typeof headingVariants> {
  title: string;
  description?: string;
  icon?: LucideIcon;
  iconColor?: string;
  bgColor?: string;
}

export const Heading = ({
  title,
  description,
  icon: Icon,
  iconColor,
  bgColor,
  size,
}: HeadingProps) => {
  return (
    <div className={headingVariants({ size })}>
      {Icon && (
        <div className={cn(iconVariants({ size }), bgColor)}>
          <Icon className={cn("h-6 w-6", iconColor)} />
        </div>
      )}
      <div>
        <h2 className="font-semibold text-xl">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}; 