"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle, CreditCard, ShieldCheck, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

// Subscription plans for the platform
const subscriptionPlans = [
  {
    id: "plan_basic",
    name: "Basic",
    description: "Perfect for individuals starting their learning journey",
    price: 0,
    features: [
      "Access to free courses",
      "Limited course previews",
      "Community forum access",
      "Mobile app access",
    ],
    limitations: [
      "Limited to 1 free chapter per course",
      "No certificates",
      "No offline downloads",
    ],
    recommended: false,
    cta: "Get Started for Free",
    color: "bg-gray-100 dark:bg-gray-800",
  },
  {
    id: "plan_pro",
    name: "Pro",
    description: "For serious learners wanting full access to all courses",
    price: 299900,
    interval: "year",
    features: [
      "Unlimited access to all courses",
      "Course completion certificates",
      "Offline downloads",
      "Priority support",
      "Ad-free experience",
      "Access to live Q&A sessions",
      "Personal learning roadmap",
    ],
    recommended: true,
    cta: "Start Pro Membership",
    color: "bg-primary/5 dark:bg-primary/20",
    badge: "Most Popular",
    savings: "Save 20%",
  },
  {
    id: "plan_team",
    name: "Enterprise",
    description: "For organizations training multiple team members",
    price: 499900,
    interval: "year",
    features: [
      "Everything in Pro",
      "Team management dashboard",
      "User analytics and progress tracking",
      "Admin controls",
      "Bulk enrollments",
      "Custom learning paths",
      "Dedicated account manager",
      "API access",
    ],
    recommended: false,
    cta: "Contact Sales",
    color: "bg-blue-50 dark:bg-blue-900/20",
  },
];

// Testimonials for social proof
const testimonials = [
  {
    quote: "The courses on LearnHub have helped me upskill from a junior to senior developer in just 6 months. The Kenyan-focused content made it incredibly relevant.",
    author: "James Omondi",
    title: "Software Engineer at Safaricom",
    avatar: "https://randomuser.me/api/portraits/men/41.jpg",
  },
  {
    quote: "As a business owner, the marketing courses gave me practical strategies I could implement immediately for my Nairobi-based startup.",
    author: "Wanjiku Maina",
    title: "Founder of TechConnect Kenya",
    avatar: "https://randomuser.me/api/portraits/women/42.jpg",
  },
  {
    quote: "The team subscription has transformed how we onboard new developers. It's saved us countless hours and improved code quality.",
    author: "David Kimani",
    title: "CTO at M-Kopa",
    avatar: "https://randomuser.me/api/portraits/men/43.jpg",
  },
];

// FAQs about pricing plans
const faqs = [
  {
    question: "How do the subscription plans work?",
    answer: "Our subscription plans give you access to our full course library based on your chosen plan. The Basic plan is free but has limited access, while Pro and Enterprise plans offer comprehensive access to all content and features.",
  },
  {
    question: "Can I switch between plans?",
    answer: "Yes, you can upgrade or downgrade your subscription at any time. If you upgrade, you'll have immediate access to additional features. If you downgrade, your current plan benefits will continue until the end of your billing period.",
  },
  {
    question: "Are there any hidden fees?",
    answer: "No, the price you see is the price you pay. There are no setup fees, hidden charges, or additional costs to access the content included in your plan.",
  },
  {
    question: "Do you offer student discounts?",
    answer: "Yes, we offer a 40% discount for verified students. Please contact our support team with your valid student ID to receive your discount code.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept major credit cards, M-Pesa, and PayPal. For Enterprise plans, we also offer invoice payment options.",
  },
  {
    question: "Can I get a refund if I'm not satisfied?",
    answer: "Yes, we offer a 30-day money-back guarantee. If you're not completely satisfied with your subscription, you can request a full refund within 30 days of purchase.",
  },
];

export default function PricingPage() {
  const [billingInterval, setBillingInterval] = useState<"month" | "year">("year");

  // Calculate monthly equivalent prices for annual plans (for display only)
  const getMonthlyEquivalent = (yearlyPrice: number) => {
    return Math.round(yearlyPrice / 12);
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="container py-12 px-4 md:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Flexible Plans for Your Learning Journey
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Choose the plan that works best for your goals and budget
          </p>
          
          {/* Billing toggle */}
          <div className="flex justify-center items-center space-x-4 mb-8">
            <button
              onClick={() => setBillingInterval("month")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                billingInterval === "month" 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly billing
            </button>
            <button
              onClick={() => setBillingInterval("year")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
                billingInterval === "year" 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Annual billing
              <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>
        
        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {subscriptionPlans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-xl border shadow-sm overflow-hidden relative ${
                plan.recommended ? "ring-2 ring-primary" : ""
              } ${plan.color}`}
            >
              {plan.badge && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
                  {plan.badge}
                </div>
              )}
              
              <div className="p-6">
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <p className="text-muted-foreground mt-1">{plan.description}</p>
                
                <div className="mt-4 mb-6">
                  {plan.price === 0 ? (
                    <div className="text-3xl font-bold">Free</div>
                  ) : (
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold">
                        {formatPrice(billingInterval === "month" ? plan.price / 10 : plan.price)}
                      </span>
                      <span className="text-muted-foreground ml-1">
                        /{billingInterval}
                      </span>
                    </div>
                  )}
                  
                  {billingInterval === "year" && plan.price > 0 && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Just {formatPrice(getMonthlyEquivalent(plan.price))} per month
                    </p>
                  )}
                </div>
                
                <Button 
                  className="w-full mb-6"
                  variant={plan.recommended ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
                
                <div>
                  <p className="font-medium mb-2">What's included:</p>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {plan.limitations && (
                    <>
                      <p className="font-medium mb-2 text-sm text-muted-foreground">Limitations:</p>
                      <ul className="space-y-2">
                        {plan.limitations.map((limitation, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="h-4 w-4 shrink-0 mt-0.5">•</span>
                            <span>{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Testimonials */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">What Our Learners Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="bg-card border rounded-lg p-6 relative">
                <div className="absolute -top-3 left-6 text-primary text-4xl">"</div>
                <div className="pt-3">
                  <p className="italic text-muted-foreground mb-4">{testimonial.quote}</p>
                  <div className="flex items-center gap-3">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.author}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div>
                      <div className="font-medium">{testimonial.author}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.title}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* FAQs */}
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border rounded-lg p-6">
                <h3 className="font-semibold mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* CTA */}
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-muted-foreground mb-6">
            Join thousands of Kenyan professionals and businesses expanding their skills
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/sign-up">Start Learning Today</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">Contact Sales</Link>
            </Button>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-8">
            <ShieldCheck className="h-4 w-4" />
            <span>Secure payment processing</span>
            <CreditCard className="h-4 w-4 ml-2" />
            <span>30-day money-back guarantee</span>
          </div>
        </div>
      </div>
    </div>
  );
} 