import Link from "next/link";
import { AwaitedReactNode, JSXElementConstructor, Key, ReactElement, ReactNode, Suspense } from "react";
import { Search } from "lucide-react";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { CourseCard } from "@/components/course-card";
import { CourseSkeletonGrid } from "@/components/course-skeleton";
import { db } from "@/lib/db";
import { Course } from "@/types";

interface CoursesPageProps {
  searchParams: {
    category?: string;
    search?: string;
  };
}

export default async function CoursesPage({
  searchParams,
}: CoursesPageProps) {
  // Fetch all categories
  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  // Fetch courses with filtering
  const courses = await db.course.findMany({
    where: {
      isPublished: true,
      ...(searchParams.category ? {
        category: {
          name: searchParams.category,
        },
      } : {}),
      ...(searchParams.search ? {
        OR: [
          {
            title: {
              contains: searchParams.search,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: searchParams.search,
              mode: "insensitive",
            },
          },
        ],
      } : {}),
    },
    include: {
      category: true,
      chapters: {
        where: {
          isPublished: true,
        },
        select: {
          id: true,
        },
      },
      user: {
        select: {
          name: true,
        },
      },
      _count: {
        select: {
          purchases: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Handle search form submission
  const handleSearch = async (formData: FormData) => {
    "use server";
    
    const search = formData.get("search") as string;
    
    if (!search) {
      return redirect("/courses");
    }
    
    return redirect(`/courses?search=${search}`);
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <header className="w-full border-b border-neutral-200 dark:border-neutral-800">
        <div className="container flex justify-between items-center py-4">
          <Link href="/" className="text-2xl font-bold">
            LearnHub
          </Link>
          <nav className="hidden md:flex gap-6 items-center">
            <Link href="/courses" className="text-foreground hover:text-foreground transition font-medium">
              Browse Courses
            </Link>
            <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition">
              Pricing
            </Link>
            <Link href="/about" className="text-muted-foreground hover:text-foreground transition">
              About
            </Link>
          </nav>
          <div className="flex gap-2">
            <Link href="/sign-in">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-muted/40 py-12">
        <div className="container">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-8">
            <h1 className="text-4xl font-bold mb-4">Browse Our Courses</h1>
            <p className="text-muted-foreground text-lg mb-6">
              Discover high-quality courses across various categories taught by expert instructors
            </p>
            
            {/* Search Bar - Server Action Form */}
            <form action={handleSearch} className="w-full max-w-lg relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <input 
                type="text"
                name="search"
                placeholder="Search for courses..."
                defaultValue={searchParams.search || ""}
                className="w-full h-12 pl-10 pr-4 rounded-md border border-input bg-background"
              />
              <button type="submit" className="sr-only">Search</button>
            </form>
          </div>
          
          {/* Categories */}
          <div className="flex overflow-x-auto gap-2 pb-2 mb-8">
            <Link href="/courses">
              <Button 
                variant={!searchParams.category ? "default" : "outline"} 
                className="rounded-full"
              >
                All Courses
              </Button>
            </Link>
            
            {categories.map((category: { id: Key | null | undefined; name: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<AwaitedReactNode> | null | undefined; }) => (
              <Link 
                key={category.id} 
                href={`/courses?category=${category.name}`}
              >
                <Button 
                  variant={searchParams.category === category.name ? "default" : "outline"}
                  className="rounded-full whitespace-nowrap"
                >
                  {category.name}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Courses Section */}
      <section className="py-12">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8">
            {searchParams.category ? `${searchParams.category} Courses` : 
             searchParams.search ? `Search Results for "${searchParams.search}"` : 
             "All Courses"}
            {searchParams.search && <span className="ml-2 text-sm text-muted-foreground">({courses.length} results)</span>}
          </h2>
          
          <Suspense fallback={<CourseSkeletonGrid count={6} />}>
            {courses.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No courses found</h3>
                <p className="text-muted-foreground mb-6">
                  {searchParams.search ? 
                    `We couldn't find any courses matching "${searchParams.search}"` : 
                    `No courses available in ${searchParams.category || "this category"} yet`}
                </p>
                <Link href="/courses">
                  <Button>Browse All Courses</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course: Course & { 
                  category?: { name: string; } | null; 
                  chapters: { id: string; }[]; 
                  progress?: number | null; 
                  ratings?: number; 
                  students?: number;
                  _count: { 
                    purchases: number 
                  }
                }, index: number) => (
                  <CourseCard 
                    key={course.id} 
                    course={{
                      ...course,
                      chapters: course.chapters,
                      students: course._count.purchases,
                      ratings: 4.5 + (Math.random() * 0.5) // Random rating between 4.5-5.0
                    }}
                    featured={index === 0 && !searchParams.search && !searchParams.category}
                  />
                ))}
              </div>
            )}
          </Suspense>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 py-8">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground">
            © {new Date().getFullYear()} LearnHub. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/terms" className="text-muted-foreground hover:text-foreground transition">
              Terms
            </Link>
            <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition">
              Privacy
            </Link>
            <Link href="/contact" className="text-muted-foreground hover:text-foreground transition">
              Contact Us
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
} 