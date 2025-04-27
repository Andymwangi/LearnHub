"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { 
  Users, 
  BookOpen, 
  Banknote, 
  BarChart, 
  UserPlus, 
  Tags, 
  PlusCircle, 
  ArrowUpRight,
  ArrowDownRight,
  Briefcase,
  Layers,
  Search,
  Award,
  FileText,
  Settings,
  AlertCircle
} from "lucide-react";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import DashboardChart from "@/components/admin/dashboard-chart";
import { getDashboardData } from "@/lib/admin-actions";
import { formatPrice } from "@/lib/payment-utils";

// Helper function to get role color
function getRoleColor(role: string) {
  switch (role) {
    case "ADMIN":
      return "bg-destructive text-destructive-foreground";
    case "TEACHER":
      return "bg-success text-success-foreground";
    case "STUDENT":
    default:
      return "bg-secondary text-secondary-foreground";
  }
}

// Format date to readable format
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}

// Get initials from name
function getInitials(name: string) {
  if (!name) return "U";
  return name
    .split(" ")
    .map(part => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Wait for session to be loaded
    if (status === "loading") return;
    
    // Redirect if not an admin
    if (status === "authenticated") {
      if (session?.user?.role !== "ADMIN") {
        router.push("/dashboard");
        return;
      }
      
      // Fetch dashboard data only when confirmed as admin
      async function fetchData() {
        try {
          setIsLoading(true);
          setError(null);
          const dashboardData = await getDashboardData();
          console.log("Dashboard data:", dashboardData);
          
          // Check if there was an error in the server action
          if (dashboardData.error) {
            setError(dashboardData.error);
            if (dashboardData.error === "Not authorized to access admin data") {
              // If not authorized, redirect to dashboard
              router.push("/dashboard");
            }
            return;
          }
          
          setData(dashboardData);
        } catch (error: any) {
          console.error("Error fetching dashboard data:", error);
          setError(error?.message || "Failed to load dashboard data. Please try again later.");
        } finally {
          setIsLoading(false);
        }
      }
      
      fetchData();
    } else if (status === "unauthenticated") {
      // Not logged in
      router.push("/sign-in?callbackUrl=/dashboard/admin");
    }
  }, [status, session, router]);

  // Show loading state while checking authentication or loading data
  if (status === "loading" || isLoading) {
    return <AdminDashboardSkeleton />;
  }

  // Don't render anything while redirecting
  if (!session || session?.user?.role !== "ADMIN") {
    return null;
  }

  // Show error state
  if (error) {
    return (
      <div className="container py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button 
          onClick={() => window.location.reload()} 
          className="mt-4"
        >
          Retry
        </Button>
      </div>
    );
  }

  // Ensure we have data before rendering the dashboard
  if (!data) {
    return <AdminDashboardSkeleton />;
  }

  // Transform data for charts
  const roleData = [
    { name: "Students", value: data?.usersRoleData.STUDENT || 0, color: "#3b82f6" },
    { name: "Teachers", value: data?.usersRoleData.TEACHER || 0, color: "#22c55e" },
    { name: "Admins", value: data?.usersRoleData.ADMIN || 0, color: "#ef4444" }
  ];

  const chartData = {
    userSignups: data?.userSignupsByDate || [],
    purchases: data?.purchasesByDate || [],
    roleData
  };

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Overview and manage your learning platform</p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/dashboard/admin/reports">
              <FileText className="h-4 w-4 mr-2" />
              Reports
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Users</p>
                <h2 className="text-3xl font-bold">{data?.totalUsers || 0}</h2>
                <div className="flex items-center mt-1 text-xs">
                  <Badge variant="secondary" className="gap-1 py-0 h-5">
                    <ArrowUpRight className="h-3 w-3" />
                    <span>+{data?.userSignupsByDate?.reduce((acc: number, item: any) => acc + item.count, 0) || 0} new this month</span>
                  </Badge>
                </div>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Courses</p>
                <h2 className="text-3xl font-bold">{data?.totalCourses || 0}</h2>
                <div className="flex items-center mt-1 text-xs">
                  <Badge variant="secondary" className="gap-1 py-0 h-5">
                    <BookOpen className="h-3 w-3" />
                    <span>{data?.publishedCourses || 0} published</span>
                  </Badge>
                </div>
              </div>
              <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Revenue</p>
                <h2 className="text-3xl font-bold">{data?.formattedRevenue || "KES 0"}</h2>
                <div className="flex items-center mt-1 text-xs">
                  <Badge variant="secondary" className="gap-1 py-0 h-5">
                    <Banknote className="h-3 w-3" />
                    <span>{data?.totalPurchases || 0} purchases</span>
                  </Badge>
                </div>
              </div>
              <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <Banknote className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Categories</p>
                <h2 className="text-3xl font-bold">{data?.totalCategories || 0}</h2>
                <div className="flex items-center mt-1 text-xs">
                  <Badge variant="secondary" className="gap-1 py-0 h-5">
                    <Layers className="h-3 w-3" />
                    <span>Course organization</span>
                  </Badge>
                </div>
              </div>
              <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                <Tags className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and analytics */}
      <div className="grid grid-cols-1 gap-6 mb-8">
        <DashboardChart data={chartData} />
      </div>

      {/* Users and Categories sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-xl">Recent Users</CardTitle>
              <CardDescription>Latest user registrations</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm" className="gap-1">
              <Link href="/dashboard/admin/users">
                <Users className="h-4 w-4 mr-1" /> View All
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[320px]">
              {data?.recentUsers && data.recentUsers.length > 0 ? (
                <div className="divide-y">
                  {data.recentUsers.map((user: any) => (
                    <div key={user.id} className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.image || ""} alt={user.name || "User"} />
                          <AvatarFallback>{getInitials(user.name || "")}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium line-clamp-1">{user.name || "Unnamed User"}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                        <p className="text-xs text-muted-foreground whitespace-nowrap">{formatDate(user.createdAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center">
                  <p className="text-muted-foreground">No users registered yet</p>
                  <Button asChild size="sm" className="mt-2 gap-1">
                    <Link href="/dashboard/admin/users/new">
                      <UserPlus className="h-4 w-4" /> Add User
                    </Link>
                  </Button>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-xl">Popular Categories</CardTitle>
              <CardDescription>Categories with the most courses</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm" className="gap-1">
              <Link href="/dashboard/admin/categories">
                <Tags className="h-4 w-4 mr-1" /> View All
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {data?.popularCategories && data.popularCategories.length > 0 ? (
              <div className="divide-y">
                {data.popularCategories.map((category: any) => (
                  <div key={category.id} className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-medium">{category.name}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {category.description || "No description"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="whitespace-nowrap">
                        {category._count.courses} {category._count.courses === 1 ? "course" : "courses"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center">
                <p className="text-muted-foreground">No categories created yet</p>
                <Button asChild size="sm" className="mt-2 gap-1">
                  <Link href="/dashboard/admin/categories/new">
                    <PlusCircle className="h-4 w-4" /> Add Category
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Purchases and Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-xl">Recent Purchases</CardTitle>
              <CardDescription>Latest course enrollments</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/admin/purchases">
                View All
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {data?.recentPurchases && data.recentPurchases.length > 0 ? (
              <div className="divide-y">
                {data.recentPurchases.map((purchase: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-medium line-clamp-1">{purchase.course.title}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {purchase.user.name || purchase.user.email}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {formatPrice(purchase.course.price || 0)}
                      </Badge>
                      <p className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatDate(purchase.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center">
                <p className="text-muted-foreground">No purchases yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Quick Links</CardTitle>
            <CardDescription>Common admin tasks</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-1 divide-y">
              <Link 
                href="/dashboard/admin/users/new" 
                className="flex items-center gap-3 p-4 hover:bg-muted transition-colors"
              >
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <UserPlus className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Add New User</p>
                  <p className="text-sm text-muted-foreground">Create student or teacher accounts</p>
                </div>
              </Link>
              <Link 
                href="/dashboard/admin/categories/new" 
                className="flex items-center gap-3 p-4 hover:bg-muted transition-colors"
              >
                <div className="h-9 w-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Tags className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium">Add Category</p>
                  <p className="text-sm text-muted-foreground">Organize your courses</p>
                </div>
              </Link>
              <Link 
                href="/dashboard/admin/courses" 
                className="flex items-center gap-3 p-4 hover:bg-muted transition-colors"
              >
                <div className="h-9 w-9 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Award className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="font-medium">Manage Courses</p>
                  <p className="text-sm text-muted-foreground">Review and edit courses</p>
                </div>
              </Link>
              <Link 
                href="/dashboard/admin/reports" 
                className="flex items-center gap-3 p-4 hover:bg-muted transition-colors"
              >
                <div className="h-9 w-9 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <BarChart className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="font-medium">View Reports</p>
                  <p className="text-sm text-muted-foreground">Analytics and insights</p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Skeleton loader for admin dashboard
function AdminDashboardSkeleton() {
  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <Skeleton className="h-10 w-[250px] mb-2" />
          <Skeleton className="h-4 w-[350px]" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-[120px]" />
          <Skeleton className="h-9 w-[120px]" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {Array(4).fill(0).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-4 w-[120px] mb-3" />
              <Skeleton className="h-9 w-[80px] mb-2" />
              <Skeleton className="h-4 w-[150px]" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mb-8">
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {Array(2).fill(0).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-[150px]" />
                <Skeleton className="h-9 w-[100px]" />
              </div>
              <Skeleton className="h-4 w-[200px] mt-1" />
            </CardHeader>
            <CardContent>
              {Array(4).fill(0).map((_, j) => (
                <div key={j} className="flex justify-between items-center mb-4 last:mb-0">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-[150px] mb-2" />
                      <Skeleton className="h-3 w-[100px]" />
                    </div>
                  </div>
                  <Skeleton className="h-5 w-[80px]" />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 