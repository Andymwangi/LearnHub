"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ArrowLeft, ChevronLeft, ChevronRight, Lock } from "lucide-react";

import { VideoPlayer } from "@/components/video-player";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { ChapterContent } from "@/components/chapter-content";

interface ChapterPageProps {
  params: {
    courseId: string;
    chapterId: string;
  };
}

export default function ChapterPage({ params }: ChapterPageProps) {
  const { courseId, chapterId } = params;
  const [isLoading, setIsLoading] = useState(true);
  const [chapter, setChapter] = useState<any>(null);
  const [course, setCourse] = useState<any>(null);
  const [nextChapter, setNextChapter] = useState<any>(null);
  const [previousChapter, setPreviousChapter] = useState<any>(null);
  const [chapterIndex, setChapterIndex] = useState(0);
  const [totalChapters, setTotalChapters] = useState(0);
  const [userProgress, setUserProgress] = useState<any>(null);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const { data } = await axios.get(
          `/api/courses/${courseId}/chapters/${chapterId}`
        );
        
        setChapter(data.chapter);
        setCourse(data.course);
        setNextChapter(data.nextChapter);
        setPreviousChapter(data.previousChapter);
        setChapterIndex(data.chapterIndex);
        setTotalChapters(data.totalChapters);
        setUserProgress(data.userProgress);
        setHasPurchased(data.hasPurchased);
        
      } catch (error: any) {
        console.error("Error fetching chapter:", error);
        
        if (error.response?.status === 403) {
          setError("You need to purchase this course to access this chapter");
        } else if (error.response?.status === 404) {
          setError("Chapter not found");
        } else {
          setError("Something went wrong");
        }
        
        toast.error(error.response?.data?.error || "Failed to load chapter");
        
      } finally {
        setIsLoading(false);
      }
    };

    if (courseId && chapterId) {
      fetchChapter();
    }
  }, [courseId, chapterId, toast]);

  const onComplete = async () => {
    try {
      // In a real implementation, update chapter completion status
      toast.success("Progress updated!");
      
      if (nextChapter?.id) {
        router.push(`/courses/${courseId}/chapters/${nextChapter.id}`);
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  if (isLoading) {
    return (
      <div className="container max-w-5xl py-8">
        <div className="flex flex-col gap-4">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="aspect-video w-full rounded-xl" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-5xl py-8">
        <div className="flex flex-col items-center justify-center gap-4 py-12">
          <Lock className="h-12 w-12 text-muted-foreground" />
          <h2 className="text-xl font-semibold">{error}</h2>
          <Button
            onClick={() => router.push(`/courses/${courseId}`)}
            variant="outline"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to course
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl py-8">
      <Button
        onClick={() => router.push(`/courses/${courseId}`)}
        variant="ghost"
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to course
      </Button>

      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">
          {chapter?.title}
        </h1>
        
        {chapter?.videoUrl && (
          <div className="w-full overflow-hidden rounded-lg">
            <VideoPlayer
              videoUrl={chapter.videoUrl}
              courseId={courseId}
              chapterId={chapterId}
              onComplete={onComplete}
            />
          </div>
        )}
        
        <div className="p-4 border rounded-lg bg-muted/30">
          <h3 className="font-semibold mb-2">About this lesson</h3>
          <div className="text-muted-foreground space-y-4">
            {chapter?.description ? (
              <ChapterContent content={chapter.description} />
            ) : (
              <p>No description available.</p>
            )}
            
            {/* Chapter content section */}
            <div className="mt-6 pt-6 border-t border-border">
              <h4 className="font-semibold mb-4">Chapter Content</h4>
              <div className="prose prose-sm prose-invert max-w-none">
                {/* Render chapter content based on what chapter is selected */}
                {chapterIndex === 0 && (
                  <>
                    <h3>Introduction to the Course</h3>
                    <p>Welcome to this comprehensive course! In this chapter, we'll cover:</p>
                    <ul>
                      <li>Course overview and expectations</li>
                      <li>Setting up your development environment</li>
                      <li>Understanding the technology stack we'll be using</li>
                      <li>How to get the most out of this course</li>
                    </ul>
                    <p>By the end of this chapter, you'll have everything ready to start your learning journey.</p>
                    
                    <div className="bg-primary/10 p-4 rounded-md mt-4">
                      <h4 className="font-medium mb-2">Key Points:</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Make sure to complete all exercises</li>
                        <li>Join our community forum for support</li>
                        <li>Watch each video fully before moving to the next</li>
                      </ul>
                    </div>
                  </>
                )}
                
                {chapterIndex === 1 && (
                  <>
                    <h3>Getting Started with Core Concepts</h3>
                    <p>Now that you're set up, let's dive into the fundamental concepts that will serve as the foundation for the rest of the course.</p>
                    
                    <h4 className="mt-4">Core Principles</h4>
                    <p>Understanding these core principles is crucial:</p>
                    <ol>
                      <li>
                        <strong>Modularity</strong> - Breaking down complex systems into manageable, independent components
                      </li>
                      <li>
                        <strong>Separation of Concerns</strong> - Organizing code so that each part handles a specific aspect
                      </li>
                      <li>
                        <strong>Reusability</strong> - Writing code that can be used in multiple contexts
                      </li>
                    </ol>
                    
                    <p className="mt-4">Let's put these concepts into practice with a simple example:</p>
                    
                    <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                      <code>{`// Example code showing modular design
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}

function applyDiscount(total, discountPercent) {
  return total * (1 - discountPercent / 100);
}

// Usage
const cartItems = [
  { name: "Product 1", price: 29.99 },
  { name: "Product 2", price: 49.99 }
];

const subtotal = calculateTotal(cartItems);
const finalPrice = applyDiscount(subtotal, 10); // 10% discount`}</code>
                    </pre>
                    
                    <div className="bg-primary/10 p-4 rounded-md mt-4">
                      <h4 className="font-medium mb-2">Practice Exercise:</h4>
                      <p>Try modifying the example code to add a tax calculation function that applies after the discount.</p>
                    </div>
                  </>
                )}
                
                {chapterIndex > 1 && (
                  <div className="text-center py-8">
                    <Lock className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium mb-2">Premium Content</h3>
                    <p className="max-w-md mx-auto mb-6">
                      This chapter is available for enrolled students only. Purchase the course to unlock all content.
                    </p>
                    <Button 
                      onClick={() => router.push(`/courses/${courseId}`)}
                      variant="default"
                    >
                      Get Full Access
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            Lesson {chapterIndex + 1} of {totalChapters}
          </div>
          
          <div className="flex gap-2">
            {previousChapter && (
              <Button
                variant="outline"
                onClick={() => router.push(`/courses/${courseId}/chapters/${previousChapter.id}`)}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
            )}
            
            {nextChapter && (
              <Button
                onClick={() => router.push(`/courses/${courseId}/chapters/${nextChapter.id}`)}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
        
        {!hasPurchased && chapterIndex === 0 && (
          <div className="bg-primary/10 p-4 rounded-lg border mt-8">
            <h3 className="font-semibold text-primary">Enjoying the free preview?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Purchase this course to unlock all chapters and continue learning!
            </p>
            <Button
              onClick={() => router.push(`/courses/${courseId}`)}
            >
              Get Full Access
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 