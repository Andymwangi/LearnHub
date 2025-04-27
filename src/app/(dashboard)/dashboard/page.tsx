"use client";

import Link from "next/link";
import { BookMarked, BookOpen, GraduationCap, Medal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CourseCard } from "@/components/course-card";
import { Course } from "@/types";

// Mock courses data
const myCourses: (Course & {
  category: { name: string } | null;
  chapters: { id: string }[];
  progress: number;
})[] = [
  {
    id: "1",
    userId: "user1",
    title: "Advanced Web Development",
    description: "Learn modern web development with React, Node.js, and MongoDB",
    imageUrl: "https://images.unsplash.com/photo-1587620962725-abab7fe55159",
    price: 1999,
    isPublished: true,
    categoryId: "cat1",
    createdAt: new Date(),
    updatedAt: new Date(),
    category: { name: "Programming" },
    chapters: Array(8).fill({ id: "ch1" }),
    progress: 35,
  },
  {
    id: "2",
    userId: "user1",
    title: "Data Science Fundamentals",
    description: "Master the basics of data analysis, visualization, and machine learning",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
    price: 1499,
    isPublished: true,
    categoryId: "cat2",
    createdAt: new Date(),
    updatedAt: new Date(),
    category: { name: "Data Science" },
    chapters: Array(10).fill({ id: "ch1" }),
    progress: 10,
  },
];

export default function StudentDashboard() {
  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            My Learning Dashboard
          </h1>
          <p className="text-muted-foreground">
            Track your progress and continue learning
          </p>
        </div>
        <Link href="/courses">
          <Button className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Browse Courses
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-card rounded-lg p-6 border shadow-sm">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-primary/10">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-medium">In Progress</h3>
          </div>
          <p className="text-3xl font-bold mt-4">2</p>
          <p className="text-sm text-muted-foreground">courses</p>
        </div>
        
        <div className="bg-card rounded-lg p-6 border shadow-sm">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-primary/10">
              <BookMarked className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-medium">Completed</h3>
          </div>
          <p className="text-3xl font-bold mt-4">0</p>
          <p className="text-sm text-muted-foreground">courses</p>
        </div>
        
        <div className="bg-card rounded-lg p-6 border shadow-sm">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-primary/10">
              <Medal className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-medium">Certificates</h3>
          </div>
          <p className="text-3xl font-bold mt-4">0</p>
          <p className="text-sm text-muted-foreground">earned</p>
        </div>
        
        <div className="bg-card rounded-lg p-6 border shadow-sm">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-primary/10">
              <GraduationCap className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-medium">Total Hours</h3>
          </div>
          <p className="text-3xl font-bold mt-4">8.5</p>
          <p className="text-sm text-muted-foreground">of learning</p>
        </div>
      </div>

      {/* In Progress Courses */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Continue Learning</h2>
          <Link href="/dashboard/courses" className="text-primary text-sm hover:underline">
            View all
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>

      {/* Recommended Courses */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Recommended for You</h2>
          <Link href="/courses" className="text-primary text-sm hover:underline">
            Browse all
          </Link>
        </div>
        
        <div className="bg-muted/50 p-8 rounded-lg text-center">
          <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Discover More Courses</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Explore our catalog to find the perfect courses to expand your skills
          </p>
          <Link href="/courses">
            <Button>
              Browse Courses
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 