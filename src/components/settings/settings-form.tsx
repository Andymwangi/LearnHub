"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { useState, useEffect } from "react";
import { ToastAction } from "@/components/ui/toast";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

// Extended form schema to include role-specific settings
export const formSchema = z.object({
  // Common settings
  theme: z.enum(["light", "dark", "system"]).optional(),
  fontSize: z.number().min(12).max(24).optional(),
  fontFamily: z.string().optional(),
  notifications: z.boolean().optional(),
  emailNotifications: z.boolean().optional(),
  language: z.enum(["en", "es", "fr"]).optional(),
  
  // Admin specific settings
  showAnalytics: z.boolean().optional(),
  enableUserManagement: z.boolean().optional(),
  enableContentModeration: z.boolean().optional(),
  
  // Teacher specific settings
  showStudentProgress: z.boolean().optional(),
  enableCourseAnalytics: z.boolean().optional(),
  autoPublishChapters: z.boolean().optional(),
  
  // Student specific settings
  showProgress: z.boolean().optional(),
  enableStudyReminders: z.boolean().optional(),
  autoPlayVideos: z.boolean().optional(),
});

export type SettingsFormValues = z.infer<typeof formSchema>;

const fontOptions = [
  { value: "Inter, sans-serif", label: "Inter" },
  { value: "Roboto, sans-serif", label: "Roboto" },
  { value: "Poppins, sans-serif", label: "Poppins" },
  { value: "Open Sans, sans-serif", label: "Open Sans" },
  { value: "Lato, sans-serif", label: "Lato" },
  { value: "Montserrat, sans-serif", label: "Montserrat" },
  { value: "Source Code Pro, monospace", label: "Source Code Pro" },
];

interface SettingsFormProps {
  initialValues: Partial<SettingsFormValues>;
  onSave: (values: Partial<SettingsFormValues>) => void;
}

export function SettingsForm({ initialValues, onSave }: SettingsFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { setTheme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark" | "system">(initialValues.theme as "light" | "dark" | "system" || "system");

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
    mode: "onChange"
  });

  // Ensure theme changes take effect immediately
  useEffect(() => {
    if (currentTheme) {
      // Apply the theme through next-themes
      setTheme(currentTheme);
    }
  }, [currentTheme, setTheme]);

  async function onSubmit(values: SettingsFormValues) {
    try {
      setIsLoading(true);
      
      // Apply theme changes immediately
      if (values.theme) {
        setCurrentTheme(values.theme as "light" | "dark" | "system");
      }
      
      await onSave(values);
    } catch (error) {
      toast.error("Failed to save settings", {
        description: "Please try again later or contact support if the issue persists.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Helper to determine if the form should show specific fields
  const shouldShowField = (fieldName: keyof SettingsFormValues) => {
    return fieldName in initialValues;
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Theme Selection */}
      {shouldShowField("theme") && (
        <FormField
          control={form.control}
          name="theme"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Theme</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  // Apply theme change immediately
                  setCurrentTheme(value as "light" | "dark" | "system");
                }}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Choose the theme for the application
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {/* Font Family Selection */}
      {shouldShowField("fontFamily") && (
        <FormField
          control={form.control}
          name="fontFamily"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Font Family</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  // Apply font family change immediately
                  document.documentElement.style.fontFamily = value;
                }}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select font" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {fontOptions.map((font) => (
                    <SelectItem key={font.value} value={font.value}>
                      {font.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Choose the font family for the application
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {/* Font Size Slider */}
      {shouldShowField("fontSize") && (
        <FormField
          control={form.control}
          name="fontSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Font Size: {field.value}px</FormLabel>
              <div className="pt-2 pb-4">
                <FormControl>
                  <Slider
                    min={12}
                    max={24}
                    step={1}
                    defaultValue={[field.value || 16]}
                    value={[field.value || 16]}
                    onValueChange={(values) => {
                      const newValue = values[0];
                      field.onChange(newValue);
                      // Apply font size change immediately
                      document.documentElement.style.fontSize = `${newValue}px`;
                    }}
                  />
                </FormControl>
              </div>
              <FormDescription>
                Adjust the font size of the application
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {/* Notifications Toggle */}
      {shouldShowField("notifications") && (
        <FormField
          control={form.control}
          name="notifications"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Notifications</FormLabel>
                <FormDescription>
                  Enable in-app notifications for new content and updates
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {/* Email Notifications Toggle */}
      {shouldShowField("emailNotifications") && (
        <FormField
          control={form.control}
          name="emailNotifications"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Email Notifications</FormLabel>
                <FormDescription>
                  Receive email notifications about important updates
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {/* Language Selection */}
      {shouldShowField("language") && (
        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Language</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Choose your preferred language
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {/* Admin-specific settings */}
      {shouldShowField("showAnalytics") && (
        <FormField
          control={form.control}
          name="showAnalytics"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Show Analytics</FormLabel>
                <FormDescription>
                  Display analytics and usage statistics in admin dashboard
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {shouldShowField("enableUserManagement") && (
        <FormField
          control={form.control}
          name="enableUserManagement"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">User Management</FormLabel>
                <FormDescription>
                  Enable user management features in the admin panel
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {shouldShowField("enableContentModeration") && (
        <FormField
          control={form.control}
          name="enableContentModeration"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Content Moderation</FormLabel>
                <FormDescription>
                  Enable content moderation tools and notifications
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {/* Teacher-specific settings */}
      {shouldShowField("showStudentProgress") && (
        <FormField
          control={form.control}
          name="showStudentProgress"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Student Progress</FormLabel>
                <FormDescription>
                  Show student progress tracking in your dashboard
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {shouldShowField("enableCourseAnalytics") && (
        <FormField
          control={form.control}
          name="enableCourseAnalytics"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Course Analytics</FormLabel>
                <FormDescription>
                  Enable detailed analytics for your courses
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {shouldShowField("autoPublishChapters") && (
        <FormField
          control={form.control}
          name="autoPublishChapters"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Auto-Publish Chapters</FormLabel>
                <FormDescription>
                  Automatically publish new chapters when they're created
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {/* Student-specific settings */}
      {shouldShowField("showProgress") && (
        <FormField
          control={form.control}
          name="showProgress"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Show Progress</FormLabel>
                <FormDescription>
                  Display your learning progress in the dashboard
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {shouldShowField("enableStudyReminders") && (
        <FormField
          control={form.control}
          name="enableStudyReminders"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Study Reminders</FormLabel>
                <FormDescription>
                  Receive reminders to continue your learning
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {shouldShowField("autoPlayVideos") && (
        <FormField
          control={form.control}
          name="autoPlayVideos"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Auto-Play Videos</FormLabel>
                <FormDescription>
                  Automatically play videos when you open a lesson
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <Button type="submit" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          "Save Settings"
        )}
      </Button>
    </form>
  );
} 