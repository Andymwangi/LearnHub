import { type } from "os";
import { ButtonProps } from "@/components/ui/button";
import { LucideProps } from "lucide-react";
import * as React from "react";

export interface Course {
  id: string;
  userId: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  isPublished: boolean;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  courses: Course[];
}

export interface Chapter {
  id: string;
  title: string;
  description?: string | null;
  videoUrl?: string | null;
  position: number;
  isPublished: boolean;
  isFree: boolean;
  courseId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProgress {
  id: string;
  userId: string;
  chapterId: string;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseCardProps {
  course: Course & {
    category?: { name: string } | null;
    chapters: { id: string }[];
    progress?: number | null;
    ratings?: number;
    students?: number;
  };
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      div: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
      h1: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
      h2: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
      h3: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
      p: React.DetailedHTMLProps<React.HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>;
      span: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;
    }
  }
}

export interface ButtonPropsWithClassName extends ButtonProps {
  className?: string;
}

export interface LucidePropsWithClassName extends LucideProps {
  className?: string;
} 