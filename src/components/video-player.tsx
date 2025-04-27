"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VideoPlayerProps {
  videoUrl: string;
  courseId: string;
  chapterId: string;
  onComplete?: () => void;
}

export function VideoPlayer({
  videoUrl,
  courseId,
  chapterId,
  onComplete
}: VideoPlayerProps) {
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const onVideoEnd = async () => {
    try {
      // In a real implementation, make an API call to mark chapter as completed
      // await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, { completed: true });
      toast.success("Progress updated!");
      
      if (onComplete) {
        onComplete();
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  // Mock video player functionality
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Mock progress tracking
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev === 100) {
            setIsPlaying(false);
            clearInterval(interval);
            onVideoEnd();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  if (!isReady) {
    return (
      <div className="aspect-video flex items-center justify-center bg-muted">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // This is a mock video player UI, in a real app you would use a library like react-player
  return (
    <div className="relative aspect-video bg-black">
      {videoUrl ? (
        <div className="relative h-full">
          {/* Placeholder for an actual video player */}
          <div 
            className="absolute inset-0 flex flex-col items-center justify-center" 
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {!isPlaying ? (
              <button className="bg-primary text-primary-foreground rounded-full p-4 opacity-90 hover:opacity-100 transition">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            ) : (
              <div className="text-white text-xl font-semibold">Video is playing...</div>
            )}
          </div>
          
          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
            <div 
              className="h-full bg-primary" 
              style={{ width: `${progress}%` }} 
            />
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-white">
          No video available
        </div>
      )}
    </div>
  );
} 