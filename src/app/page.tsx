"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  GraduationCap, 
  BookOpenText, 
  PenTool, 
  ArrowRight, 
  ChevronRight, 
  Star, 
  Users, 
  Globe,
  Check,
  TrendingUp,
  BrainCircuit,
  Map,
  Globe2,
  MousePointerClick
} from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

import { CourseCard } from "@/components/course-card";
import { CourseSkeletonGrid } from "@/components/course-skeleton";
import { MobileNav } from "@/components/navigation/mobile-nav";
import { Course } from "@/types";

// Define animation variants
const slideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 }
};

// Mock courses data
const popularCourses: (Course & {
  category: { name: string } | null;
  chapters: { id: string }[];
  ratings?: number;
  students?: number;
})[] = [
  {
    id: "1",
    userId: "user1",
    title: "100 Days of Code: The Complete Python Pro Bootcamp",
    description: "Master Python by building 100 projects in 100 days. Learn data science, automation, build websites, games and apps!",
    imageUrl: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?q=80&w=500&auto=format&fit=crop",
    price: 1899,
    isPublished: true,
    categoryId: "cat1",
    createdAt: new Date(),
    updatedAt: new Date(),
    category: { name: "Programming" },
    chapters: Array(100).fill({ id: "ch1" }),
    ratings: 4.7,
    students: 365383,
  },
  {
    id: "2",
    userId: "user2",
    title: "The Complete Full-Stack Web Development Bootcamp",
    description: "Learn HTML5, CSS3, JavaScript, React, Node.js, MongoDB, Express and more!",
    imageUrl: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=500&auto=format&fit=crop",
    price: 1599,
    isPublished: true,
    categoryId: "cat1",
    createdAt: new Date(),
    updatedAt: new Date(),
    category: { name: "Programming" },
    chapters: Array(24).fill({ id: "ch1" }),
    ratings: 4.7,
    students: 434455,
  },
  {
    id: "3",
    userId: "user3",
    title: "[NEW] Ultimate AWS Certified Cloud Practitioner CLF-C02",
    description: "Full practice exam included + explanations | Learn all AWS Cloud Practitioner topics",
    imageUrl: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=500&auto=format&fit=crop",
    price: 1999,
    isPublished: true,
    categoryId: "cat3",
    createdAt: new Date(),
    updatedAt: new Date(),
    category: { name: "Cloud Computing" },
    chapters: Array(19).fill({ id: "ch1" }),
    ratings: 4.7,
    students: 246478,
  },
  {
    id: "4",
    userId: "user3",
    title: "Ultimate AWS Certified Solutions Architect Associate",
    description: "Full practice exam included | Learn to design systems on AWS and ace the AWS Solutions Architect Associate exam",
    imageUrl: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=500&auto=format&fit=crop",
    price: 8499,
    isPublished: true,
    categoryId: "cat3",
    createdAt: new Date(),
    updatedAt: new Date(),
    category: { name: "Cloud Computing" },
    chapters: Array(20).fill({ id: "ch1" }),
    ratings: 4.7,
    students: 255673,
  },
  {
    id: "5",
    userId: "user4",
    title: "The Complete Python Bootcamp From Zero to Hero in Python",
    description: "Learn Python like a Professional! Start from the basics and go all the way to creating your own applications and games!",
    imageUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=500&auto=format&fit=crop",
    price: 7499,
    isPublished: true,
    categoryId: "cat1",
    createdAt: new Date(),
    updatedAt: new Date(),
    category: { name: "Programming" },
    chapters: Array(22).fill({ id: "ch1" }),
    ratings: 4.6,
    students: 534773,
  },
  {
    id: "10",
    userId: "user9", 
    title: "UI/UX Design Masterclass: Complete UX Research & Design",
    description: "Learn to create beautiful user interfaces and delightful user experiences for your products and services",
    imageUrl: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=500&auto=format&fit=crop", 
    price: 7999,
    isPublished: true,
    categoryId: "cat9",
    createdAt: new Date(),
    updatedAt: new Date(), 
    category: { name: "Design" },
    chapters: Array(28).fill({ id: "ch1" }),
    ratings: 4.8,
    students: 178350,
  },
  {
    id: "11", 
    userId: "user10",
    title: "Adobe Photoshop CC: Complete Guide to Photo Editing",
    description: "Master photo editing and digital design with Adobe Photoshop CC - for beginners and intermediate users",
    imageUrl: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?q=80&w=500&auto=format&fit=crop",
    price: 6499,
    isPublished: true, 
    categoryId: "cat9",
    createdAt: new Date(),
    updatedAt: new Date(),
    category: { name: "Design" },
    chapters: Array(35).fill({ id: "ch1" }),
    ratings: 4.6,
    students: 192784,
  },
];

const developmentCourses: (Course & {
  category: { name: string } | null;
  chapters: { id: string }[];
})[] = [
  {
    id: "6",
    userId: "user5",
    title: "Complete React Developer Zero to Mastery",
    description: "Become a React Developer and build modern React apps with Hooks, Context API, Redux, and more!",
    imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=500&auto=format&fit=crop",
    price: 7999,
    isPublished: true,
    categoryId: "cat1",
    createdAt: new Date(),
    updatedAt: new Date(),
    category: { name: "Programming" },
    chapters: Array(38).fill({ id: "ch1" }),
  },
  {
    id: "7",
    userId: "user6",
    title: "JavaScript - The Complete Guide 2023 (Beginner + Advanced)",
    description: "Modern JavaScript from the beginning - all the way up to expert level! JavaScript is THE most important language in web development.",
    imageUrl: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?q=80&w=500&auto=format&fit=crop",
    price: 6999,
    isPublished: true,
    categoryId: "cat1",
    createdAt: new Date(),
    updatedAt: new Date(),
    category: { name: "Programming" },
    chapters: Array(52).fill({ id: "ch1" }),
  },
  {
    id: "8",
    userId: "user7",
    title: "NodeJS - The Complete Guide (MVC, REST APIs, GraphQL)",
    description: "Master Node.js by building a real-world application with Node, Express, MongoDB, JWT and more!",
    imageUrl: "https://images.unsplash.com/photo-1589149098258-3e9102cd63d3?q=80&w=500&auto=format&fit=crop",
    price: 7499,
    isPublished: true,
    categoryId: "cat1",
    createdAt: new Date(),
    updatedAt: new Date(),
    category: { name: "Programming" },
    chapters: Array(40).fill({ id: "ch1" }),
  },
  {
    id: "9",
    userId: "user8",
    title: "Angular - The Complete Guide (2023 Edition)",
    description: "Master Angular 17 (formerly \"Angular 2\") and build awesome, reactive web apps with the successor of Angular.js",
    imageUrl: "https://images.unsplash.com/photo-1616469829941-c7200edec809?q=80&w=500&auto=format&fit=crop",
    price: 6999,
    isPublished: true,
    categoryId: "cat1",
    createdAt: new Date(),
    updatedAt: new Date(),
    category: { name: "Programming" },
    chapters: Array(34).fill({ id: "ch1" }),
  },
];

// Categories for the user to browse
const categories = [
  { id: "cat1", name: "Web Development", icon: "🌐" },
  { id: "cat2", name: "Data Science", icon: "📊" },
  { id: "cat3", name: "Cloud Computing", icon: "☁️" },
  { id: "cat4", name: "Mobile Development", icon: "📱" },
  { id: "cat5", name: "DevOps", icon: "🛠️" },
  { id: "cat6", name: "Game Development", icon: "🎮" },
  { id: "cat7", name: "Cybersecurity", icon: "🔒" },
  { id: "cat8", name: "Machine Learning", icon: "🤖" },
];

const MotionDiv = motion.div;

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("all");
  
  // Filter courses based on the active category
  const filteredCourses = popularCourses.filter(course => {
    if (activeCategory === "all") return true;
    if (activeCategory === "programming" && course.category?.name === "Programming") return true;
    if (activeCategory === "cloud" && course.category?.name === "Cloud Computing") return true;
    if (activeCategory === "design" && course.category?.name === "Design") return true;
    return false;
  });
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Main content */}
      <main>
        {/* Hero Section with Modern Design */}
        <section className="relative overflow-hidden bg-gradient-to-b from-background to-primary/5 py-12 md:py-20">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="container relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <MotionDiv
                initial="hidden"
                animate="visible"
                variants={slideUp}
                transition={{ duration: 0.5 }}
                className="flex flex-col gap-6"
              >
                <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm text-primary font-medium">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="h-3.5 w-3.5" />
                    Accelerate your career
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  Learning that gets <span className="text-primary">you</span>
                </h1>
                <p className="text-muted-foreground text-lg max-w-md">
                  Skills for your present (and your future). Get started with us.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 pt-3">
                  <Button asChild size="lg" className="gap-2 font-medium">
                    <Link href="/courses">
                      Explore Courses <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="font-medium">
                    <Link href="/sign-up">
                      Try for Free
                    </Link>
                  </Button>
                </div>
                
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground mt-4">
                  <div className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">4.8/5 Ratings</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="h-4 w-4" />
                    <span className="font-medium">10K+ Students</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Globe className="h-4 w-4" />
                    <span className="font-medium">Global Community</span>
                  </div>
                </div>
              </MotionDiv>
              
              <MotionDiv
                initial="hidden"
                animate="visible"
                variants={scaleIn}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative h-full min-h-[400px] rounded-xl overflow-hidden shadow-2xl"
              >
                <Image
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop"
                  alt="People learning online"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/95 dark:bg-black/90 rounded-lg shadow-lg backdrop-blur-sm">
                  <h3 className="font-semibold text-lg mb-2">Start learning today</h3>
                  <p className="text-muted-foreground text-sm">Join thousands of students who have transformed their careers through our courses.</p>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-8 w-8 rounded-full bg-primary/15 border border-neutral-200/40 dark:border-neutral-800/40 flex items-center justify-center text-xs font-medium">
                          {i % 2 === 0 ? 'S' : 'A'}
                        </div>
                      ))}
                    </div>
                    <div className="ml-2 text-xs text-muted-foreground">
                      <span className="font-medium">+258</span> joined today
                    </div>
                  </div>
                </div>
              </MotionDiv>
            </div>
          </div>
        </section>
        
        {/* Trust Signals & Benefits */}
        <section className="py-10 bg-muted/30">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: <BrainCircuit className="h-6 w-6 text-primary" />, title: "Learn anything", description: "Explore thousands of up-to-date courses from expert instructors" },
                { icon: <MousePointerClick className="h-6 w-6 text-primary" />, title: "Learn anywhere", description: "Take courses on your schedule, at your own pace" },
                { icon: <Users className="h-6 w-6 text-primary" />, title: "Learn together", description: "Join a global community of lifelong learners" },
                { icon: <TrendingUp className="h-6 w-6 text-primary" />, title: "Learn to achieve", description: "Gain skills that will help you reach your goals" },
              ].map((item, index) => (
                <MotionDiv
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-background p-6 rounded-xl border border-neutral-200/40 dark:border-neutral-800/40 shadow-sm"
                >
                  <div className="mb-4 p-2.5 rounded-full bg-primary/10 w-fit">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </MotionDiv>
              ))}
            </div>
          </div>
        </section>
        
        {/* Popular Courses Section */}
        <section className="py-16">
          <div className="container">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <h2 className="text-3xl font-bold mb-2">Popular Courses</h2>
                <p className="text-muted-foreground">Most in-demand courses picked by our students</p>
              </div>
              <div className="flex items-center gap-3">
                <Tabs value={activeCategory} className="w-full" onValueChange={setActiveCategory}>
                  <TabsList className="bg-muted/60">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="programming">Programming</TabsTrigger>
                    <TabsTrigger value="cloud">Cloud</TabsTrigger>
                    <TabsTrigger value="design">Design</TabsTrigger>
                  </TabsList>
                </Tabs>
                <Link href="/courses" className="flex items-center text-sm font-medium text-primary hover:underline whitespace-nowrap">
                  View all courses <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course, index) => (
                  <CourseCard key={course.id} course={course} featured={index === 0} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">No courses found in this category.</p>
                </div>
              )}
            </div>
          </div>
        </section>
        
        {/* Categories Section */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
              <div>
                <h2 className="text-3xl font-bold mb-2">Browse Categories</h2>
                <p className="text-muted-foreground">Explore our most popular course categories</p>
              </div>
              <Link href="/categories" className="flex items-center text-sm font-medium text-primary hover:underline">
                View all categories <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((category, index) => (
                <MotionDiv
                  key={category.id} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <Link href={`/categories/${category.id}`}>
                    <div className="bg-background hover:bg-primary/5 border border-neutral-200/40 dark:border-neutral-800/40 rounded-xl p-6 transition-colors flex flex-col gap-3 h-full group">
                      <span className="text-3xl">{category.icon}</span>
                      <div>
                        <h3 className="font-medium text-base group-hover:text-primary transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-muted-foreground text-sm mt-1">
                          {Math.floor(Math.random() * 200) + 50} courses
                        </p>
                      </div>
                    </div>
                  </Link>
                </MotionDiv>
              ))}
            </div>
          </div>
        </section>
        
        {/* Featured Development Courses Section */}
        <section className="py-16">
          <div className="container">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
              <div>
                <h2 className="text-3xl font-bold mb-2">Expand Your Development Skills</h2>
                <p className="text-muted-foreground">Master the latest technologies with our expert-led courses</p>
              </div>
              <Link href="/courses?category=development" className="flex items-center text-sm font-medium text-primary hover:underline">
                View all development courses <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {developmentCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-10">What Our Students Say</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: "Sarah Johnson",
                  title: "Front-end Developer",
                  content: "The courses on LearnHub completely transformed my career. I went from knowing basic HTML to becoming a confident front-end developer in just a few months.",
                  rating: 5,
                },
                {
                  name: "Michael Chen",
                  title: "Data Scientist",
                  content: "The data science curriculum is comprehensive and up-to-date. The instructors are experts in their fields and the projects helped me build a strong portfolio.",
                  rating: 5,
                },
                {
                  name: "Priya Patel",
                  title: "Cloud Engineer",
                  content: "The AWS certification courses prepared me perfectly for the exams. The practical labs and real-world scenarios were invaluable for my learning journey.",
                  rating: 4,
                },
              ].map((testimonial, index) => (
                <MotionDiv
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-background rounded-xl p-6 shadow-sm border border-neutral-200/40 dark:border-neutral-800/40"
                >
                  <div className="flex gap-1.5 mb-4">
                    {Array(testimonial.rating).fill(0).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="text-muted-foreground mb-6 italic">
                    "{testimonial.content}"
                  </blockquote>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-medium">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                    </div>
                  </div>
                </MotionDiv>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-primary/10">
          <div className="container">
            <div className="bg-background rounded-2xl p-8 md:p-12 shadow-lg border border-neutral-200/40 dark:border-neutral-800/40 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
              
              <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="max-w-2xl">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to start your learning journey?</h2>
                  <p className="text-muted-foreground text-lg mb-6">
                    Join thousands of students already learning on LearnHub. Get unlimited access to all courses.
                  </p>
                  <ul className="space-y-2 mb-8">
                    {[
                      "Access to all 10,000+ courses",
                      "Learn at your own pace",
                      "New courses added regularly",
                      "Certificates of completion",
                    ].map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button asChild size="lg" className="gap-2 font-medium">
                      <Link href="/sign-up">
                        Get Started <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="font-medium">
                      <Link href="/courses">
                        View Pricing
                      </Link>
                    </Button>
                  </div>
                </div>
                
                <div className="lg:w-1/3 relative rounded-xl overflow-hidden shadow-lg h-[240px]">
                  <Image
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop"
                    alt="Students learning"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
