"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Landmark, BookOpen, Users, Award, GraduationCap, Map } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Team members data
const teamMembers = [
  {
    name: "John Kamau",
    role: "Founder & CEO",
    bio: "With over 15 years in tech education, John founded this platform to bridge the digital skills gap in Kenya.",
    image: "/placeholder.svg"
  },
  {
    name: "Aisha Omar",
    role: "Head of Curriculum",
    bio: "Former university professor with a passion for creating accessible, high-quality educational content.",
    image: "/placeholder.svg"
  },
  {
    name: "David Ndung'u",
    role: "Lead Instructor",
    bio: "Software engineer with 10+ years experience building solutions for East African markets.",
    image: "/placeholder.svg"
  },
  {
    name: "Wanjiku Mwangi",
    role: "Community Manager",
    bio: "Dedicated to building supportive learning communities and ensuring student success.",
    image: "/placeholder.svg"
  }
];

// Core values data
const coreValues = [
  {
    icon: <BookOpen className="h-8 w-8 mb-2" />,
    title: "Accessible Education",
    description: "We believe quality education should be accessible to all Kenyans, regardless of location or background.",
  },
  {
    icon: <Map className="h-8 w-8 mb-2" />,
    title: "Local Relevance",
    description: "Our content is specifically tailored to the Kenyan context, addressing local challenges and opportunities.",
  },
  {
    icon: <GraduationCap className="h-8 w-8 mb-2" />,
    title: "Practical Skills",
    description: "We focus on equipping learners with practical, job-ready skills that are in demand in the Kenyan market.",
  },
  {
    icon: <Users className="h-8 w-8 mb-2" />,
    title: "Learner Community",
    description: "We foster a supportive community of learners who collaborate, network, and grow together.",
  },
  {
    icon: <Award className="h-8 w-8 mb-2" />,
    title: "Quality Excellence",
    description: "We maintain high standards in all our courses, ensuring you receive the best education possible.",
  },
  {
    icon: <Landmark className="h-8 w-8 mb-2" />,
    title: "Digital Inclusion",
    description: "We're committed to bridging the digital divide by making our platform accessible even with limited connectivity.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-background min-h-screen">
      <div className="container py-12 px-4 md:px-6">
        {/* Hero Section */}
        <section className="text-center max-w-4xl mx-auto mb-20">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Empowering Kenyans Through Quality Education
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            We're on a mission to democratize access to high-quality, locally relevant education that prepares Kenyans for success in the digital economy.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/courses">Explore Our Courses</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="mb-20">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Founded in 2021, our learning platform emerged from a simple observation: while Kenya has rapidly growing technology adoption, access to quality, relevant education remains uneven.
                </p>
                <p>
                  Our founder, John Kamau, experienced firsthand the challenges of finding education that was both globally competitive and locally relevant. After spending years in the education and technology sectors, he assembled a team of educators, technologists, and content experts to create a solution.
                </p>
                <p>
                  What began as a small collection of web development courses has grown into a comprehensive platform offering dozens of courses across multiple disciplines, all designed specifically for the Kenyan context and job market.
                </p>
                <p>
                  Today, we serve thousands of learners across all 47 counties, with a particular focus on providing opportunities for youth in underserved areas. Our partnerships with local businesses ensure our curriculum remains aligned with actual job market needs.
                </p>
              </div>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <Image 
                src="/placeholder.svg" // Replace with actual image
                alt="Students learning on our platform"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* Our Core Values */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Our Core Values</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreValues.map((value, index) => (
              <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="mx-auto text-primary">{value.icon}</div>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-base">
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Our Mission */}
        <section className="mb-20 bg-primary/5 rounded-lg p-8 md:p-12">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-xl mb-6">
              To provide accessible, high-quality education that empowers Kenyans to thrive in the digital economy and contribute to national development.
            </p>
            <h3 className="text-2xl font-semibold mb-4">By 2025, we aim to:</h3>
            <ul className="text-lg text-muted-foreground space-y-2 text-left max-w-xl mx-auto">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Reach 100,000 learners across all 47 counties in Kenya</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Achieve a 70% employment rate for graduates of our career-track programs</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Partner with 200+ local businesses to ensure our curriculum meets market needs</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Establish learning hubs in 10 underserved counties to support those with limited connectivity</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Our Team */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center">
                <div className="relative h-[200px] w-[200px] mx-auto rounded-full overflow-hidden mb-4">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-primary font-medium mb-2">{member.role}</p>
                <p className="text-muted-foreground">{member.bio}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Key Achievements */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Our Impact</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center bg-primary/5 border-none">
              <CardHeader>
                <CardTitle className="text-4xl font-bold text-primary">15,000+</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg font-medium">Students Enrolled</CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center bg-primary/5 border-none">
              <CardHeader>
                <CardTitle className="text-4xl font-bold text-primary">50+</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg font-medium">Courses Offered</CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center bg-primary/5 border-none">
              <CardHeader>
                <CardTitle className="text-4xl font-bold text-primary">47</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg font-medium">Counties Reached</CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center bg-primary/5 border-none">
              <CardHeader>
                <CardTitle className="text-4xl font-bold text-primary">85%</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg font-medium">Course Completion Rate</CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Join Our Learning Community</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Take the first step towards building skills that will transform your future and contribute to Kenya's digital economy.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/courses">Explore Courses</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/contact">Partner With Us</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
} 