"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, BarChart, FileText, Plus, Pencil, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getTeacherCourses, getTeacherStats } from "@/lib/teacher-actions";
import { formatPrice } from "@/lib/payment-utils";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// Define types for our data
interface TeacherStats {
  totalCourses: number;
  totalStudents: number;
  totalRevenue: number;
}

interface Chapter {
  id: string;
  title: string;
  isPublished: boolean;
}

interface Course {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  price: number | null;
  isPublished: boolean;
  chapters: Chapter[];
  category: {
    id: string;
    name: string;
    description: string | null;
  } | null;
  _count: {
    purchases: number;
  };
}

export default function TeacherDashboard() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<TeacherStats>({ totalCourses: 0, totalStudents: 0, totalRevenue: 0 });
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch stats and courses in parallel
        const [statsResult, coursesResult] = await Promise.all([
          getTeacherStats(),
          getTeacherCourses()
        ]);

        if (statsResult.success) {
          setStats({
            totalCourses: statsResult.totalCourses || 0,
            totalStudents: statsResult.totalStudents || 0,
            totalRevenue: statsResult.totalRevenue || 0
          });
        }

        if (coursesResult.success && coursesResult.courses) {
          setCourses(coursesResult.courses);
        }
      } catch (error) {
        console.error("Error fetching teacher data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchData();
    }
  }, [session]);

  if (isLoading) {
    return <TeacherDashboardSkeleton />;
  }

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6">Teacher Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">My Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCourses}</div>
            <p className="text-xs text-muted-foreground mt-1">Created courses</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground mt-1">Across all courses</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(stats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground mt-1">Total earnings</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {courses.length > 0 
                ? Math.round(
                    (courses.filter(course => course.isPublished).length / courses.length) * 100
                  ) + "%"
                : "N/A"
              }
            </div>
            <p className="text-xs text-muted-foreground mt-1">Published courses</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">My Courses</h2>
        <Button asChild className="gap-2">
          <Link href="/dashboard/teacher/create">
            <Plus className="h-4 w-4" /> Create New Course
          </Link>
        </Button>
      </div>
      
      {courses.length === 0 ? (
        <div className="border rounded-lg p-8 text-center">
          <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-primary/10">
            <BookOpen className="h-8 w-8 text-primary"/>
          </div>
          <h3 className="text-lg font-medium mb-2">No courses yet</h3>
          <p className="text-muted-foreground mb-4">You haven't created any courses yet. Get started by creating your first course.</p>
          <Button asChild>
            <Link href="/dashboard/teacher/create">Create Your First Course</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <Card key={course.id} className="overflow-hidden">
              <div className="aspect-video relative bg-muted">
                {course.imageUrl ? (
                  <img 
                    src={course.imageUrl} 
                    alt={course.title} 
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-muted">
                    <BookOpen className="h-10 w-10 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <Badge variant={course.isPublished ? "success" : "secondary"}>
                    {course.isPublished ? "Published" : "Draft"}
                  </Badge>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-1">{course.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {course.description || "No description provided"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm mb-2">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>{course._count.purchases} students</span>
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>{course.chapters.length} chapters</span>
                  </div>
                  <div>
                    {course.price ? formatPrice(course.price) : "Free"}
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <Button asChild variant="secondary" className="w-full">
                    <Link href={`/dashboard/teacher/courses/${course.id}`}>
                      <Pencil className="h-4 w-4 mr-2" /> Edit Course
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/courses/${course.id}`}>
                      <FileText className="h-4 w-4 mr-2" /> View
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function TeacherDashboardSkeleton() {
  return (
    <div className="container py-10">
      <Skeleton className="h-8 w-48 mb-6" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-9 w-40" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="aspect-video w-full" />
            <CardHeader>
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex items-center gap-2 mt-4">
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 