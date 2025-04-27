"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2, Upload, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  bio: z.string().max(500, {
    message: "Bio cannot exceed 500 characters.",
  }).optional(),
});

type FormValues = z.infer<typeof formSchema>;

type UserProfile = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  avatarUrl: string | null;
  bio: string | null;
  role: string;
};

export default function ProfilePage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      bio: "",
    },
  });

  const { register, handleSubmit, reset, formState: { errors, isDirty } } = form;

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsFetching(true);
        const response = await fetch("/api/user/profile");
        
        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }
        
        const data = await response.json();
        setUserProfile(data);
        
        // Update form with fetched data
        reset({
          name: data.name || "",
          email: data.email || "",
          bio: data.bio || "",
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile data");
      } finally {
        setIsFetching(false);
      }
    };

    fetchUserProfile();
  }, [toast, reset]);

  const onSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);
      
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          bio: values.bio,
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update profile");
      }
      
      const updatedProfile = await response.json();
      setUserProfile(updatedProfile);
      
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    if (!files || files.length === 0) {
      return;
    }
    
    const file = files[0];
    const formData = new FormData();
    formData.append("file", file);
    
    try {
      setIsImageUploading(true);
      
      const response = await fetch("/api/user/profile/upload", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error("Failed to upload image");
      }
      
      const data = await response.json();
      setUserProfile(prev => prev ? { ...prev, avatarUrl: data.user.avatarUrl, image: data.user.image } : null);
      
      toast.success("Profile picture updated");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload profile picture");
    } finally {
      setIsImageUploading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="container p-6 flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container p-6">
      <h1 className="text-2xl font-bold mb-8">My Profile</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Profile image section */}
        <div className="lg:col-span-1">
          <div className="bg-card border rounded-lg p-6 text-center">
            <div className="relative mx-auto mb-4 w-32 h-32 rounded-full overflow-hidden border-4 border-background">
              {userProfile?.avatarUrl || userProfile?.image ? (
                <Image
                  src={userProfile.avatarUrl || userProfile.image || ""}
                  alt={userProfile.name || "User"}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                  <User className="h-12 w-12 text-primary" />
                </div>
              )}
              
              {isImageUploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 text-white animate-spin" />
                </div>
              )}
            </div>
            
            <h2 className="font-medium text-lg">{userProfile?.name}</h2>
            <p className="text-sm text-muted-foreground mb-4">{userProfile?.role}</p>
            
            <label>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                disabled={isImageUploading}
              />
              <Button
                type="button"
                variant="outline"
                className="w-full cursor-pointer"
                disabled={isImageUploading}
                asChild
              >
                <span>
                  <Upload className="h-4 w-4 mr-2" />
                  Change Photo
                </span>
              </Button>
            </label>
          </div>
        </div>
        
        {/* Profile form section */}
        <div className="lg:col-span-3">
          <div className="bg-card border rounded-lg p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Full Name
                  </label>
                  <Input
                    id="name"
                    {...register("name")}
                    placeholder="Your full name"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    {...register("email")}
                    placeholder="Your email"
                    disabled
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Email cannot be changed
                  </p>
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="bio" className="text-sm font-medium">
                    Bio
                  </label>
                  <Textarea
                    id="bio"
                    rows={4}
                    {...register("bio")}
                    placeholder="Tell us about yourself"
                  />
                  {errors.bio && (
                    <p className="text-sm text-red-500">{errors.bio.message}</p>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isLoading || !isDirty}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 