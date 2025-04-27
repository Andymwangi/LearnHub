"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { Star, Users, Clock, Tag, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { PaymentMethods } from "@/components/payment-methods";
import { CourseChapters } from "@/components/course-chapters";

interface CourseDetailPageProps {
  params: {
    courseId: string;
  };
}

export default function CourseDetailPage({ params }: CourseDetailPageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [course, setCourse] = useState<any>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setIsLoading(true);
        // Fetch actual course data from API
        const { data } = await axios.get(`/api/courses/${params.courseId}`);
        setCourse(data);
      } catch (error) {
        toast.error("Failed to load course details");
        // Fallback to mock data if API call fails
        setCourse({
          id: params.courseId,
          title: "Modern Full-Stack Web Development Bootcamp",
          description: "A comprehensive bootcamp covering HTML, CSS, JavaScript, React, Node.js, Express, and MongoDB. Build and deploy real-world web applications from scratch. Perfect for beginners and intermediate developers looking to expand their skills.",
          imageUrl: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8",
          price: 129.99,
          isPublished: true,
          category: { name: "Web Development" },
          instructor: {
            name: "John Smith",
            bio: "Full-stack developer with 10+ years of experience in web technologies.",
            avatarUrl: "https://randomuser.me/api/portraits/men/1.jpg",
          },
          students: 4235,
          rating: 4.7,
          totalHours: 42,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [params.courseId, toast]);

  if (isLoading) {
    return (
      <div className="container grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
        <div className="md:col-span-2 space-y-6">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-32 w-full" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Course not found</h1>
        <p className="text-muted-foreground mb-8">
          The course you're looking for doesn't exist or has been removed.
        </p>
        <button 
          onClick={() => router.push("/courses")}
          className="text-primary hover:underline"
        >
          Browse our courses
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-2xl md:text-3xl font-bold mb-4">{course.title}</h1>
            
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                <span>{course.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{course.students} students</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{course.totalHours} hours</span>
              </div>
              <div className="flex items-center gap-1">
                <Tag className="h-4 w-4" />
                <span>{course.category?.name || "Uncategorized"}</span>
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-2">About this course</h2>
              <p className="text-gray-300 leading-relaxed">{course.description}</p>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Instructor</h2>
              <div className="flex items-start gap-4">
                <Image
                  src={course.instructor?.avatarUrl || "https://randomuser.me/api/portraits/men/1.jpg"}
                  alt={course.instructor?.name || "Instructor"}
                  width={64}
                  height={64}
                  className="rounded-full"
                />
                <div>
                  <h3 className="font-semibold">{course.instructor?.name || "Instructor"}</h3>
                  <p className="text-gray-300 text-sm mt-1">{course.instructor?.bio || "No bio available."}</p>
                </div>
              </div>
            </div>
            
            {/* Course preview section for smaller screens */}
            <div className="block lg:hidden mb-8">
              <Image
                src={course.imageUrl}
                alt={course.title}
                width={600}
                height={400}
                className="rounded-lg w-full h-auto object-cover mb-6"
              />
              
              <div className="flex justify-center mb-6">
                <Button 
                  onClick={() => {
                    // Fetch the first chapter ID and navigate to it
                    axios.get(`/api/courses/${course.id}/chapters`)
                      .then(response => {
                        const chapters = response.data.chapters;
                        if (chapters && chapters.length > 0) {
                          router.push(`/courses/${course.id}/chapters/${chapters[0].id}`);
                        }
                      })
                      .catch(error => {
                        toast.error("Failed to load course chapters");
                      });
                  }}
                  variant="outline"
                  className="w-full"
                >
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Preview Free Chapter
                </Button>
              </div>
              
              <PaymentMethods 
                courseId={course.id} 
                courseTitle={course.title} 
                price={course.price} 
              />
            </div>
          </div>
          
          {/* Course sidebar for larger screens */}
          <div className="space-y-6 hidden lg:block">
            <div className="bg-black/30 p-6 rounded-xl border border-white/10">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full">
                  <PaymentMethods 
                    courseId={course.id} 
                    courseTitle={course.title} 
                    price={course.price} 
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-black/30 p-6 rounded-xl border border-white/10 mb-4">
              <Image
                src={course.imageUrl}
                alt={course.title}
                width={600}
                height={400}
                className="rounded-lg w-full h-auto object-cover mb-6"
              />
              
              <div className="flex justify-center">
                <Button 
                  onClick={() => {
                    // Fetch the first chapter ID and navigate to it
                    axios.get(`/api/courses/${course.id}/chapters`)
                      .then(response => {
                        const chapters = response.data.chapters;
                        if (chapters && chapters.length > 0) {
                          router.push(`/courses/${course.id}/chapters/${chapters[0].id}`);
                        }
                      })
                      .catch(error => {
                        toast.error("Failed to load course chapters");
                      });
                  }}
                  variant="outline"
                  className="w-full"
                >
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Preview Free Chapter
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Course chapters section (full width) */}
        <div className="mt-8 bg-black/30 p-6 rounded-xl border border-white/10">
          <CourseChapters courseId={params.courseId} />
        </div>
      </div>
    </div>
  );
} 