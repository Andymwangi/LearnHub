"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { createCourse } from "@/lib/teacher-actions";

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateCoursePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { register, handleSubmit, formState: { errors } } = form;

  const onSubmit = async (values: FormValues) => {
    if (!session?.user?.id) {
      toast.error("You must be logged in to create a course");
      return;
    }
    
    try {
      setIsCreating(true);
      
      const result = await createCourse(values.title, session.user.id);
      
      if (result.success) {
        toast.success("Course created successfully");
        router.push(`/dashboard/teacher/courses/${result.courseId}`);
      } else {
        toast.error(result.error || "Failed to create course");
      }
    } catch (error) {
      console.error("Error creating course:", error);
      toast.error("Something went wrong");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <Link 
        href="/dashboard/teacher"
        className="flex items-center text-sm hover:opacity-75 transition mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to dashboard
      </Link>
      
      <div className="bg-card border rounded-lg p-8 shadow-sm">
        <h1 className="text-2xl font-bold mb-8">
          Create New Course
        </h1>
        
        <div className="space-y-4">
          <div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-2">
                <label
                  htmlFor="title"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Course Title
                </label>
                <Input
                  id="title"
                  placeholder="e.g. 'Advanced Web Development'"
                  {...register("title")}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">
                    {errors.title.message}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  What will you teach in this course?
                </p>
              </div>
              
              <div className="flex items-center gap-x-2">
                <Link href="/dashboard/teacher">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  disabled={isCreating}
                >
                  {isCreating && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  Create
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 