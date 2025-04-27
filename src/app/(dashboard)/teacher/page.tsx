"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  BarChart2, 
  BookOpen, 
  Banknote, 
  Plus, 
  Users 
} from "lucide-react";

import { Button } from "@/components/ui/button";

export default function TeacherDashboard() {
  const [isLoading] = useState(false);

  const stats = [
    {
      icon: BookOpen,
      label: "Total Courses",
      value: "4",
      description: "courses created",
    },
    {
      icon: Users,
      label: "Total Students",
      value: "219",
      description: "enrolled in your courses",
    },
    {
      icon: BarChart2,
      label: "Course Rating",
      value: "4.8",
      description: "average rating",
    },
    {
      icon: Banknote,
      label: "Total Revenue",
      value: "KES 45,690",
      description: "earnings this month",
    },
  ];

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Teacher Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage your courses and view your analytics
          </p>
        </div>
        <Link href="/teacher/create">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create New Course
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-card rounded-lg p-6 border shadow-sm"
          >
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-primary/10">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-medium">{stat.label}</h3>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">
                {stat.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-lg border shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-6">Your Courses</h2>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <div className="grid grid-cols-5 p-4 text-sm font-medium text-muted-foreground bg-muted/50">
              <div>Title</div>
              <div>Status</div>
              <div>Price</div>
              <div>Students</div>
              <div>Actions</div>
            </div>
            
            {/* Course rows placeholder */}
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="grid grid-cols-5 p-4 items-center text-sm border-t"
              >
                <div className="font-medium">Web Development Basics</div>
                <div>
                  <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
                    Published
                  </span>
                </div>
                <div>KES 3,999</div>
                <div>78</div>
                <div className="flex items-center gap-2">
                  <Link href={`/teacher/courses/${index}`}>
                    <Button size="sm">Edit</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 