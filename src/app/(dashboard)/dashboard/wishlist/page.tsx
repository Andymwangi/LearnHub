"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CourseCard } from "@/components/course-card";
import { Course } from "@/types";
import { useToast } from "@/hooks/use-toast";

// Mock wishlist data
const wishlistCourses: (Course & {
  category: { name: string } | null;
  chapters: { id: string }[];
})[] = [
  {
    id: "3",
    userId: "user1",
    title: "Ultimate AWS Certified Solutions Architect Associate",
    description: "Master the fundamentals of AWS and pass the Solutions Architect Associate exam with confidence",
    imageUrl: "https://images.unsplash.com/photo-1451187863213-d1bcbaae3fa3",
    price: 7999,
    isPublished: true,
    categoryId: "cat3",
    createdAt: new Date(),
    updatedAt: new Date(),
    category: { name: "Cloud Computing" },
    chapters: Array(12).fill({ id: "ch1" }),
  },
  {
    id: "4",
    userId: "user1",
    title: "Complete JavaScript Course 2023: From Zero to Expert",
    description: "Master JavaScript with the most complete course on the market. Projects, challenges, and theory for modern JS development",
    imageUrl: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a",
    price: 5999,
    isPublished: true,
    categoryId: "cat1",
    createdAt: new Date(),
    updatedAt: new Date(),
    category: { name: "Programming" },
    chapters: Array(24).fill({ id: "ch1" }),
  },
  {
    id: "5",
    userId: "user1",
    title: "iOS App Development with Swift UI",
    description: "Learn to build beautiful iOS 15 apps with Swift UI and become a professional iOS developer",
    imageUrl: "https://images.unsplash.com/photo-1563203369-26f2e4a5ccb7",
    price: 8999,
    isPublished: true,
    categoryId: "cat4",
    createdAt: new Date(),
    updatedAt: new Date(),
    category: { name: "Mobile Development" },
    chapters: Array(15).fill({ id: "ch1" }),
  },
];

export default function WishlistPage() {
  const { toast } = useToast();
  const [courses, setCourses] = useState(wishlistCourses);

  const removeFromWishlist = (courseId: string) => {
    setCourses(courses.filter(course => course.id !== courseId));
    toast.success("Removed from wishlist");
  };

  const addToCart = (courseId: string) => {
    toast.success("Added to cart");
    // In a real app, this would make an API call to add to cart
  };

  return (
    <div className="container p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Wishlist</h1>
          <p className="text-muted-foreground">
            Courses you're interested in for future learning
          </p>
        </div>
        <Link href="/dashboard/cart">
          <Button variant="outline" className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" />
            View Cart
          </Button>
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-medium mb-2">Your wishlist is empty</h2>
          <p className="text-muted-foreground mb-6">
            Save courses you're interested in by clicking the heart icon
          </p>
          <Link href="/courses">
            <Button>Browse Courses</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="relative group">
              <CourseCard course={course} />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-200 rounded-lg pointer-events-none" />
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button 
                  size="icon" 
                  variant="destructive"
                  className="h-8 w-8 rounded-full bg-white text-red-500 border border-red-200 hover:bg-red-50"
                  onClick={() => removeFromWishlist(course.id)}
                >
                  <Heart className="h-4 w-4 fill-current" />
                </Button>
                <Button 
                  size="icon" 
                  className="h-8 w-8 rounded-full"
                  onClick={() => addToCart(course.id)}
                >
                  <ShoppingBag className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 