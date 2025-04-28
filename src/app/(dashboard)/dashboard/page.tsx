"use client";

import Link from "next/link";
import { BookMarked, BookOpen, GraduationCap, Medal, Globe, Clock, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CourseCard } from "@/components/course-card";
import { Course } from "@/types";

// Define interfaces for our data
interface CourseWithProgress extends Course {
  category: { name: string } | null;
  chapters: { id: string }[];
  progress: number;
}

interface RecommendedCourse {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  category: { name: string };
}

// Mock courses data with Kenyan and international context
const myCourses: CourseWithProgress[] = [
  {
    id: "1",
    userId: "user1",
    title: "Digital Marketing for East African Businesses",
    description: "Learn how to leverage digital platforms to grow your business in the East African market",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
    price: 2999,
    isPublished: true,
    categoryId: "cat1",
    createdAt: new Date(),
    updatedAt: new Date(),
    category: { name: "Business" },
    chapters: Array(8).fill({ id: "ch1" }),
    progress: 35,
  },
  {
    id: "2",
    userId: "user1",
    title: "Global Software Development",
    description: "Master modern software development practices with a focus on international collaboration",
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
    price: 4999,
    isPublished: true,
    categoryId: "cat2",
    createdAt: new Date(),
    updatedAt: new Date(),
    category: { name: "Technology" },
    chapters: Array(12).fill({ id: "ch1" }),
    progress: 10,
  },
  {
    id: "3",
    userId: "user1",
    title: "Agribusiness Management",
    description: "Learn modern farming techniques and business management for sustainable agriculture",
    imageUrl: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854",
    price: 3999,
    isPublished: true,
    categoryId: "cat3",
    createdAt: new Date(),
    updatedAt: new Date(),
    category: { name: "Agriculture" },
    chapters: Array(10).fill({ id: "ch1" }),
    progress: 0,
  }
];

// Recommended courses with local and international focus
const recommendedCourses: RecommendedCourse[] = [
  {
    id: "4",
    title: "Mobile Money Solutions",
    description: "Understanding and developing mobile payment systems for the African market",
    imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3",
    price: 3499,
    category: { name: "Finance" }
  },
  {
    id: "5",
    title: "International Trade Law",
    description: "Navigate global trade regulations and opportunities for African businesses",
    imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f",
    price: 4499,
    category: { name: "Law" }
  },
  {
    id: "6",
    title: "Renewable Energy Systems",
    description: "Implementing sustainable energy solutions for East African communities",
    imageUrl: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d",
    price: 3999,
    category: { name: "Engineering" }
  }
];

export default function StudentDashboard() {
  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome to LearnHub Kenya
          </h1>
          <p className="text-muted-foreground">
            Your gateway to global knowledge with local relevance
          </p>
        </div>
        <Link href="/courses">
          <Button className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Explore Courses
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
            <h3 className="font-medium">Active Courses</h3>
          </div>
          <p className="text-3xl font-bold mt-4">3</p>
          <p className="text-sm text-muted-foreground">in progress</p>
        </div>
        
        <div className="bg-card rounded-lg p-6 border shadow-sm">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-primary/10">
              <BookMarked className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-medium">Completed</h3>
          </div>
          <p className="text-3xl font-bold mt-4">2</p>
          <p className="text-sm text-muted-foreground">courses</p>
        </div>
        
        <div className="bg-card rounded-lg p-6 border shadow-sm">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-primary/10">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-medium">Learning Hours</h3>
          </div>
          <p className="text-3xl font-bold mt-4">24.5</p>
          <p className="text-sm text-muted-foreground">this month</p>
        </div>
        
        <div className="bg-card rounded-lg p-6 border shadow-sm">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-medium">Community</h3>
          </div>
          <p className="text-3xl font-bold mt-4">1.2K</p>
          <p className="text-sm text-muted-foreground">active learners</p>
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
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Recommended for You</h2>
          <Link href="/courses" className="text-primary text-sm hover:underline">
            Browse all
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>

      {/* Global Learning Community */}
      <div className="bg-muted/50 p-8 rounded-lg text-center">
        <Globe className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Join Our Global Learning Community</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Connect with learners from Kenya and around the world. Share experiences, collaborate on projects, and grow together.
        </p>
        <Link href="/community">
          <Button>
            Join Community
          </Button>
        </Link>
      </div>
    </div>
  );
} 