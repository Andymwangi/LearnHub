"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SettingsForm, SettingsFormValues } from "@/components/settings/settings-form";
import { Heading } from "@/components/heading";
import { Card } from "@/components/ui/card";
import { Settings, Palette, Type, UserRound, BarChart } from "lucide-react";
import { toast } from "sonner";
import { useAppTheme } from "@/components/providers/theme-provider";

// Define the user settings interface
interface UserSettings extends SettingsFormValues {
  theme: "light" | "dark" | "system";
  fontSize: number;
  fontFamily: string;
  notifications: boolean;
  emailNotifications: boolean;
  language: "en" | "es" | "fr";
}

export default function SettingsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { setTheme } = useAppTheme();
  const [activeTab, setActiveTab] = useState("appearance");
  const [settings, setSettings] = useState<Partial<UserSettings>>({
    theme: "system",
    fontSize: 16,
    fontFamily: "Inter, sans-serif",
    notifications: true,
    emailNotifications: false,
    language: "en",
  });
  
  // Load saved settings from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSettings = localStorage.getItem("userSettings");
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      } else {
        // Apply default settings based on role
        const userRole = session?.user?.role || "STUDENT";
        applyDefaultSettingsByRole(userRole);
      }
    }
  }, [session]);

  // Apply default settings based on user role
  const applyDefaultSettingsByRole = (role: string) => {
    const baseSettings: Partial<UserSettings> = {
      theme: "system",
      fontSize: 16,
      fontFamily: "Inter, sans-serif",
      notifications: true,
      emailNotifications: false,
      language: "en",
    };

    let roleSpecificSettings: Partial<UserSettings> = {};

    switch (role) {
      case "ADMIN":
        roleSpecificSettings = {
          showAnalytics: true,
          enableUserManagement: true,
          enableContentModeration: true,
        };
        break;
      case "TEACHER":
        roleSpecificSettings = {
          showStudentProgress: true,
          enableCourseAnalytics: true,
          autoPublishChapters: false,
        };
        break;
      case "STUDENT":
        roleSpecificSettings = {
          showProgress: true,
          enableStudyReminders: true,
          autoPlayVideos: true,
        };
        break;
    }

    const combinedSettings = { ...baseSettings, ...roleSpecificSettings };
    setSettings(combinedSettings);
    localStorage.setItem("userSettings", JSON.stringify(combinedSettings));
  };

  // Save settings to localStorage
  const saveSettings = (values: Partial<UserSettings>) => {
    const updatedSettings = { ...settings, ...values };
    setSettings(updatedSettings);
    
    // Apply the settings immediately after saving
    if (updatedSettings.theme) {
      setTheme(updatedSettings.theme);
    }
    
    if (updatedSettings.fontSize) {
      document.documentElement.style.fontSize = `${updatedSettings.fontSize}px`;
    }
    
    if (updatedSettings.fontFamily) {
      document.documentElement.style.fontFamily = updatedSettings.fontFamily;
    }
    
    // Store the role-specific settings
    const userRole = session?.user?.role?.toLowerCase() || "student";
    localStorage.setItem(`${userRole}Settings`, JSON.stringify(updatedSettings));
    localStorage.setItem("userSettings", JSON.stringify(updatedSettings));
    
    // Force refresh local state to ensure UI reflects changes
    setSettings({ ...updatedSettings });
    
    toast.success("Settings saved successfully", {
      description: "Your preferences have been updated.",
    });
  };

  // Get appearance settings
  const getAppearanceSettings = () => {
    return {
      theme: settings.theme,
      fontSize: settings.fontSize,
      fontFamily: settings.fontFamily,
    };
  };

  // Get notification settings
  const getNotificationSettings = () => {
    return {
      notifications: settings.notifications,
      emailNotifications: settings.emailNotifications,
    };
  };

  // Get account settings
  const getAccountSettings = () => {
    return {
      language: settings.language,
    };
  };

  // Get admin settings
  const getAdminSettings = () => {
    return {
      showAnalytics: settings.showAnalytics,
      enableUserManagement: settings.enableUserManagement,
      enableContentModeration: settings.enableContentModeration,
    };
  };

  // Get teacher settings
  const getTeacherSettings = () => {
    return {
      showStudentProgress: settings.showStudentProgress,
      enableCourseAnalytics: settings.enableCourseAnalytics,
      autoPublishChapters: settings.autoPublishChapters,
    };
  };

  // Get student settings
  const getStudentSettings = () => {
    return {
      showProgress: settings.showProgress,
      enableStudyReminders: settings.enableStudyReminders,
      autoPlayVideos: settings.autoPlayVideos,
    };
  };

  // Check if user has role
  const hasRole = (role: string) => {
    return session?.user?.role === role;
  };

  return (
    <div className="container mx-auto py-10">
      <Heading
        title="Settings"
        description="Manage your account settings and preferences."
        icon={Settings}
        iconColor="text-gray-700"
        bgColor="bg-gray-100"
      />

      <Tabs
        defaultValue="appearance"
        value={activeTab}
        onValueChange={setActiveTab}
        className="mt-6"
      >
        <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden md:inline">Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden md:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="account" className="flex items-center gap-2">
            <UserRound className="h-4 w-4" />
            <span className="hidden md:inline">Account</span>
          </TabsTrigger>
          
          {hasRole("ADMIN") && (
            <TabsTrigger value="admin" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              <span className="hidden md:inline">Admin</span>
            </TabsTrigger>
          )}
          
          {hasRole("TEACHER") && (
            <TabsTrigger value="teacher" className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              <span className="hidden md:inline">Teacher</span>
            </TabsTrigger>
          )}
          
          {hasRole("STUDENT") && (
            <TabsTrigger value="student" className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              <span className="hidden md:inline">Student</span>
            </TabsTrigger>
          )}
        </TabsList>

        <Card className="mt-6 p-6">
          <TabsContent value="appearance" className="space-y-4">
            <h2 className="text-xl font-semibold">Appearance Settings</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Customize how the application looks and feels.
            </p>
            <SettingsForm 
              initialValues={getAppearanceSettings()} 
              onSave={saveSettings} 
            />
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <h2 className="text-xl font-semibold">Notification Preferences</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Control how and when you receive notifications.
            </p>
            <SettingsForm 
              initialValues={getNotificationSettings()} 
              onSave={saveSettings} 
            />
          </TabsContent>

          <TabsContent value="account" className="space-y-4">
            <h2 className="text-xl font-semibold">Account Settings</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Manage your account preferences and language settings.
            </p>
            <SettingsForm 
              initialValues={getAccountSettings()} 
              onSave={saveSettings} 
            />
          </TabsContent>

          {hasRole("ADMIN") && (
            <TabsContent value="admin" className="space-y-4">
              <h2 className="text-xl font-semibold">Admin Settings</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Configure admin-specific features and preferences.
              </p>
              <SettingsForm 
                initialValues={getAdminSettings()} 
                onSave={saveSettings} 
              />
            </TabsContent>
          )}

          {hasRole("TEACHER") && (
            <TabsContent value="teacher" className="space-y-4">
              <h2 className="text-xl font-semibold">Teacher Settings</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Configure teacher-specific features and preferences.
              </p>
              <SettingsForm 
                initialValues={getTeacherSettings()} 
                onSave={saveSettings} 
              />
            </TabsContent>
          )}
          
          {hasRole("STUDENT") && (
            <TabsContent value="student" className="space-y-4">
              <h2 className="text-xl font-semibold">Student Settings</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Configure student-specific features and preferences.
              </p>
              <SettingsForm 
                initialValues={getStudentSettings()} 
                onSave={saveSettings} 
              />
            </TabsContent>
          )}
        </Card>
      </Tabs>
    </div>
  );
} 