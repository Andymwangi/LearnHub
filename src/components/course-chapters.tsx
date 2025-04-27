"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BookOpen, CheckCircle, Lock, PlayCircle } from "lucide-react";
import DOMPurify from "isomorphic-dompurify";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface CourseChaptersProps {
  courseId: string;
}

type Chapter = {
  id: string;
  title: string;
  description: string | null;
  position: number;
  isFree: boolean;
  isAccessible: boolean;
  videoUrl: string | null;
};

export function CourseChapters({ courseId }: CourseChaptersProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [courseTitle, setCourseTitle] = useState("");
  const [hasPurchased, setHasPurchased] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`/api/courses/${courseId}/chapters`);
        setChapters(data.chapters);
        setCourseTitle(data.courseTitle);
        setHasPurchased(data.hasPurchased);
      } catch (error) {
        toast.error("Failed to load course content");
      } finally {
        setIsLoading(false);
      }
    };

    if (courseId) {
      fetchChapters();
    }
  }, [courseId, toast]);

  const startCourse = () => {
    if (chapters.length > 0) {
      router.push(`/courses/${courseId}/chapters/${chapters[0].id}`);
    }
  };

  const freePreviewCount = chapters.filter((chapter, index) => index < 1 || chapter.isFree).length;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-8 w-24" />
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-4 border rounded-lg">
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Course Content</h3>
        {freePreviewCount > 0 && !hasPurchased && (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {freePreviewCount} free {freePreviewCount === 1 ? 'chapter' : 'chapters'}
          </Badge>
        )}
      </div>

      {chapters.length === 0 ? (
        <p className="text-muted-foreground">No chapters available yet.</p>
      ) : (
        <>
          <ul className="space-y-2 mb-6 w-full">
            {chapters.map((chapter, index) => {
              const isFreePreview = index < 1 || chapter.isFree;
              return (
                <li key={chapter.id} className="border rounded-lg overflow-hidden w-full">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-start gap-3 mb-2 sm:mb-0">
                      <div className="flex-shrink-0 mt-0.5">
                        {hasPurchased ? (
                          <CheckCircle className="h-5 w-5 text-primary" />
                        ) : isFreePreview ? (
                          <PlayCircle className="h-5 w-5 text-blue-600" />
                        ) : (
                          <Lock className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium">
                            {index + 1}. {chapter.title}
                          </span>
                          {isFreePreview && !hasPurchased && (
                            <Badge variant="secondary" className="text-xs">
                              Free Preview
                            </Badge>
                          )}
                        </div>
                        {chapter.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5 max-w-prose">
                            {chapter.description.replace(/<[^>]*>/g, '')}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="ml-8 sm:ml-0">
                      {chapter.isAccessible ? (
                        <Link href={`/courses/${courseId}/chapters/${chapter.id}`}>
                          <Button variant="ghost" size="sm" className="w-full sm:w-auto">
                            {hasPurchased ? "Continue" : "Preview"}
                          </Button>
                        </Link>
                      ) : (
                        <Button variant="ghost" size="sm" disabled className="w-full sm:w-auto">
                          Locked
                        </Button>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          {!hasPurchased && (
            <div className="bg-muted/30 p-4 rounded-lg border w-full">
              <div className="flex items-center gap-2 mb-2 text-primary">
                <BookOpen className="h-5 w-5" />
                <h4 className="font-semibold">Free Trial Available</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                You can preview the first chapter of this course for free. Purchase the course to get access to all content, including assignments and certificates.
              </p>
              <div className="flex gap-2">
                <Button onClick={startCourse} className="w-full sm:w-auto">
                  Start Free Preview
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
} 