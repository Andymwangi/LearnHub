"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

// FAQ categories and questions
const faqData = {
  general: [
    {
      question: "What is this learning platform?",
      answer: "Our learning platform is a comprehensive online education system designed specifically for Kenyan learners. We offer a wide range of courses across various disciplines including technology, business, creativity, and personal development, all with content tailored to the Kenyan context and job market."
    },
    {
      question: "How do I create an account?",
      answer: "Creating an account is simple. Click on the 'Sign Up' button on the top right corner of the homepage. Fill in your details including your name, email address, and create a password. Once you confirm your email through the verification link we send, your account will be active and ready to use."
    },
    {
      question: "Is the platform mobile-friendly?",
      answer: "Yes, our platform is fully responsive and works seamlessly on mobile devices, tablets, and desktop computers. You can access your courses and learning materials on any device with an internet connection, making it convenient to learn on the go."
    },
    {
      question: "Do courses have an expiration date?",
      answer: "Once you purchase a course, you have lifetime access to it. There is no expiration date, allowing you to revisit the material whenever you need to refresh your knowledge or continue your learning journey at your own pace."
    },
    {
      question: "Can I download course materials for offline viewing?",
      answer: "Yes, most course materials can be downloaded for offline viewing. This includes PDFs, lecture notes, and certain video content. This feature is particularly helpful for learners with unstable internet connections or those who prefer to study offline."
    }
  ],
  courses: [
    {
      question: "What types of courses do you offer?",
      answer: "We offer a diverse range of courses across various categories including web development, data science, digital marketing, business management, graphic design, personal finance, and more. All our courses are designed with practical, job-relevant skills in mind, focusing on the Kenyan and East African context."
    },
    {
      question: "How long does it take to complete a course?",
      answer: "Course completion times vary depending on the complexity and depth of the subject matter. On average, our courses range from 4-12 weeks of content when following the recommended pace. However, since all courses are self-paced, you can complete them as quickly or slowly as fits your schedule."
    },
    {
      question: "Are there any prerequisites for joining courses?",
      answer: "Prerequisites vary by course. While some beginner-level courses have no prerequisites, more advanced courses may require prior knowledge or completion of foundational courses. The specific prerequisites for each course are clearly listed on the course details page."
    },
    {
      question: "Do you offer certifications upon course completion?",
      answer: "Yes, upon successful completion of a course, you will receive a digital certificate that you can add to your CV/resume or share on professional networks like LinkedIn. Our certificates verify your newly acquired skills and can help enhance your professional profile."
    },
    {
      question: "Can I switch between courses if I change my mind?",
      answer: "While we don't offer direct course swaps, you can request a refund within 7 days of purchase if you find the course isn't what you expected. After the refund period, we recommend completing your current course before starting a new one."
    }
  ],
  payments: [
    {
      question: "What payment methods do you accept?",
      answer: "We accept various payment methods including M-Pesa, credit/debit cards (Visa and Mastercard), PayPal, and bank transfers. Our flexible payment options ensure that you can choose the method most convenient for you."
    },
    {
      question: "Do you offer installment payment plans?",
      answer: "Yes, for selected premium courses, we offer installment payment plans that allow you to pay for your course in 2-3 monthly installments. Details about installment options will be displayed on the course checkout page if available for that particular course."
    },
    {
      question: "What is your refund policy?",
      answer: "We offer a 7-day money-back guarantee on all our courses. If you're unsatisfied with your course purchase, you can request a full refund within 7 days of enrollment, provided you haven't completed more than 25% of the course content."
    },
    {
      question: "Are there any hidden fees?",
      answer: "No, there are no hidden fees. The price displayed on the course page is the total amount you'll pay. This includes lifetime access to the course materials, exercises, quizzes, and the certificate upon completion."
    },
    {
      question: "Do you offer student or group discounts?",
      answer: "Yes, we offer special discounts for students with valid student ID, as well as group discounts for organizations enrolling 5 or more employees. Please contact our support team for more information on these special pricing options."
    }
  ],
  technical: [
    {
      question: "What are the technical requirements for using the platform?",
      answer: "Our platform works on any modern web browser (Chrome, Firefox, Safari, Edge) with an internet connection. For video courses, we recommend a stable internet connection with at least 1 Mbps download speed. Some specialized courses may have additional requirements, which will be specified on the course page."
    },
    {
      question: "I forgot my password. How can I reset it?",
      answer: "Click on the 'Login' button and then select 'Forgot Password'. Enter the email address associated with your account, and we'll send you a password reset link. Follow the instructions in the email to create a new password."
    },
    {
      question: "The video content isn't loading. What should I do?",
      answer: "First, check your internet connection and try refreshing the page. If the issue persists, try clearing your browser cache or using a different browser. If you're still experiencing problems, please contact our technical support team with details about your device and browser."
    },
    {
      question: "How do I update my profile information?",
      answer: "Log in to your account and click on your profile picture in the top right corner. Select 'Account Settings' from the dropdown menu. Here, you can update your personal information, change your password, update your profile picture, and manage your notification preferences."
    },
    {
      question: "Is my personal information secure?",
      answer: "Yes, we take data security very seriously. All personal information is encrypted and stored securely. We never share your information with third parties without your consent. You can review our detailed Privacy Policy for more information on how we protect and handle your data."
    }
  ],
  support: [
    {
      question: "How can I contact customer support?",
      answer: "Our customer support team is available through multiple channels. You can reach us via email at support@learningplatform.co.ke, through the live chat feature on our website (available Monday to Friday, 8am to 6pm EAT), or by calling our helpline at +254 20 123 4567."
    },
    {
      question: "What are your customer support hours?",
      answer: "Our customer support team is available Monday to Friday, from 8am to 6pm East Africa Time (EAT). While we strive to respond to all inquiries as quickly as possible, please allow up to 24 hours for email responses during business days."
    },
    {
      question: "Do you offer learning support or tutoring?",
      answer: "Yes, many of our courses include instructor support where you can ask questions and receive guidance. For premium courses, we offer additional one-on-one tutoring sessions that can be booked directly through the course interface."
    },
    {
      question: "How can I provide feedback about the platform or courses?",
      answer: "We value your feedback! You can provide course-specific feedback through the rating and review system at the end of each course. For general platform feedback, please use the 'Feedback' option in the help menu or email us directly at feedback@learningplatform.co.ke."
    },
    {
      question: "What if I encounter inappropriate content or behavior?",
      answer: "We maintain a respectful learning environment. If you encounter any inappropriate content or behavior, please report it immediately using the 'Report' button available on all community features, or contact our support team directly. We take all reports seriously and will investigate promptly."
    }
  ]
};

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("general");
  const [searchResults, setSearchResults] = useState<Array<{category: string, question: string, answer: string}>>([]);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results: Array<{category: string, question: string, answer: string}> = [];

    Object.entries(faqData).forEach(([category, questions]) => {
      questions.forEach(({question, answer}) => {
        if (
          question.toLowerCase().includes(query) ||
          answer.toLowerCase().includes(query)
        ) {
          results.push({
            category,
            question,
            answer
          });
        }
      });
    });

    setSearchResults(results);
  };

  // Clear search results
  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="container py-12 px-4 md:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-muted-foreground">
            Find answers to common questions about our learning platform, courses, and more.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-10">
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="text"
              placeholder="Search for answers..."
              className="pl-10 py-6 text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Button 
              type="submit" 
              className="absolute right-1 top-1/2 transform -translate-y-1/2"
            >
              Search
            </Button>
          </form>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="max-w-4xl mx-auto mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                Found {searchResults.length} results for "{searchQuery}"
              </h2>
              <Button variant="outline" size="sm" onClick={clearSearch}>
                Clear search
              </Button>
            </div>
            <Accordion type="single" collapsible className="w-full space-y-4">
              {searchResults.map((result, index) => (
                <AccordionItem key={index} value={`search-${index}`} className="border rounded-lg px-6">
                  <AccordionTrigger className="text-left py-4">
                    <div>
                      <span className="text-sm text-primary capitalize">{result.category}</span>
                      <h3 className="font-medium text-lg">{result.question}</h3>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 text-muted-foreground">
                    {result.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}

        {/* FAQ Categories & Questions */}
        {searchResults.length === 0 && (
          <div className="max-w-4xl mx-auto">
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="w-full flex mb-8 flex-wrap h-auto">
                <TabsTrigger value="general" className="flex-1">General</TabsTrigger>
                <TabsTrigger value="courses" className="flex-1">Courses</TabsTrigger>
                <TabsTrigger value="payments" className="flex-1">Payments</TabsTrigger>
                <TabsTrigger value="technical" className="flex-1">Technical</TabsTrigger>
                <TabsTrigger value="support" className="flex-1">Support</TabsTrigger>
              </TabsList>
              
              {Object.entries(faqData).map(([category, questions]) => (
                <TabsContent key={category} value={category} className="space-y-4">
                  <Accordion type="single" collapsible className="w-full">
                    {questions.map((faq, faqIndex) => (
                      <AccordionItem key={faqIndex} value={`faq-${faqIndex}`} className="border rounded-lg px-6 mb-4">
                        <AccordionTrigger className="text-left py-4">
                          <h3 className="font-medium text-lg">{faq.question}</h3>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4 text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        )}
        
        {/* Still Have Questions? */}
        <div className="text-center max-w-2xl mx-auto mt-20 border-t pt-10">
          <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
          <p className="text-muted-foreground mb-6">
            If you couldn't find the answer to your question, please reach out to our support team.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild>
              <Link href="/contact">Contact Support</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="mailto:support@learningplatform.co.ke">
                Email Us
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 