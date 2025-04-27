"use client";

import Image from "next/image";
import Link from "next/link";
import { BookOpen, Star, Users, Clock, Award, Tag } from "lucide-react";
import { motion } from "framer-motion";

import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Course } from "@/types";

// Define animation variants
const slideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

interface CourseCardProps {
  course: Course & {
    category?: { name: string } | null;
    chapters: { id: string }[];
    progress?: number | null;
    ratings?: number;
    students?: number;
  };
  featured?: boolean;
}

export function CourseCard({ course, featured = false }: CourseCardProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={slideUp}
      transition={{ duration: 0.3 }}
    >
      <Card className={`group overflow-hidden border-neutral-200/30 dark:border-neutral-800/30 h-full flex flex-col ${featured ? 'shadow-md' : ''}`}>
        <div className="aspect-video relative overflow-hidden">
          {course.imageUrl ? (
            <Image
              fill
              className="object-cover transition-all duration-500 group-hover:scale-105"
              alt={course.title}
              src={course.imageUrl}
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-muted">
              <BookOpen className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Wishlist button */}
          <button 
            className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/90 dark:bg-black/70 shadow-md flex items-center justify-center text-muted-foreground hover:text-primary transition-colors opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
            aria-label="Add to wishlist"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          {/* Course level badge */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            <Badge variant="secondary" className="font-medium shadow-md backdrop-blur-sm bg-secondary/80 text-xs">
              {course.category?.name || "Course"}
            </Badge>
            
            {featured && (
              <Badge variant="default" className="font-medium shadow-md backdrop-blur-sm bg-primary/90 text-xs gap-1 flex items-center">
                <Award className="h-3 w-3" /> Bestseller
              </Badge>
            )}
          </div>
          
          {/* Preview button on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button variant="secondary" size="sm" className="shadow-lg">
              Preview
            </Button>
          </div>
        </div>
        
        <CardContent className="p-4 pt-5 flex-1 flex flex-col gap-3">
          <div className="flex items-start justify-between">
            <h3 className="font-bold leading-tight text-base group-hover:text-primary transition-colors duration-300 line-clamp-2">
              {course.title}
            </h3>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2">
            {course.description}
          </p>
          
          <div className="flex items-center gap-1 text-sm">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{course.ratings || 4.5}</span>
            {course.students && (
              <>
                <span className="text-muted-foreground mx-1">•</span>
                <span className="text-muted-foreground text-sm">
                  {course.students.toLocaleString()} students
                </span>
              </>
            )}
          </div>
          
          {course.progress !== undefined && (
            <div className="mt-1">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-muted-foreground">Your progress</span>
                <span className="font-medium">{course.progress}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${course.progress || 0}%` }} 
                />
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-3 mt-auto pt-1">
            <div className="font-bold">
              {course.price ? formatPrice(course.price) : 
                <Badge variant="success" className="shadow-sm">Free</Badge>
              }
            </div>
            
            <div className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
              <Clock className="h-3.5 w-3.5" />
              <span>{course.chapters.length * 10}+ min</span>
            </div>
            
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <BookOpen className="h-3.5 w-3.5" />
              <span>{course.chapters.length} {course.chapters.length === 1 ? "lesson" : "lessons"}</span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="px-4 pb-4 pt-0">
          <Link href={`/courses/${course.id}`} className="w-full">
            <Button 
              className="w-full transition-all duration-300 group-hover:shadow-md" 
              variant={course.progress !== undefined ? "default" : "outline"}
              size="sm"
            >
              {course.progress !== undefined ? "Continue Learning" : "View Course"}
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
} 