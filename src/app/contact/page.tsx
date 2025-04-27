"use client";

import React, { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Validation schema
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().optional(),
  subject: z.string().min(1, {
    message: "Please select a subject.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

// Contact information
const contactInfo = [
  {
    icon: Mail,
    title: "Email Us",
    details: [
      { label: "General Inquiries", value: "info@learningplatform.co.ke" },
      { label: "Support", value: "support@learningplatform.co.ke" },
    ],
  },
  {
    icon: Phone,
    title: "Call Us",
    details: [
      { label: "Main Office", value: "+254 20 123 4567" },
      { label: "Support Team", value: "+254 712 345 678" },
    ],
  },
  {
    icon: MapPin,
    title: "Visit Us",
    details: [
      { 
        label: "Nairobi Office", 
        value: "Westlands Business Park, 7th Floor, Nairobi, Kenya" 
      },
    ],
  },
];

// FAQ questions
const faqs = [
  {
    question: "How quickly will I receive a response?",
    answer: "We typically respond to all inquiries within 24-48 hours during business days. For urgent matters, we recommend calling our support team directly."
  },
  {
    question: "Can I request a course on a specific topic?",
    answer: "Yes! We welcome course suggestions. Please use the contact form and select 'Course Suggestion' as the subject to share your ideas with our curriculum team."
  },
  {
    question: "I'm having technical issues with my account, what should I do?",
    answer: "For technical support, please select 'Technical Support' as your subject and provide details about the issue you're experiencing. Our tech team will help resolve your problems promptly."
  },
  {
    question: "Do you offer special pricing for educational institutions?",
    answer: "Yes, we offer special rates for schools, colleges, and universities. Please contact us with details about your institution for a customized quote."
  },
  {
    question: "How can I become an instructor on the platform?",
    answer: "We're always looking for experts to join our teaching team. Select 'Become an Instructor' as your subject and share your expertise and experience in the message field."
  },
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  // Form submission handler
  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      console.log(values);
      toast.success("Your message has been sent! We'll get back to you soon.");
      form.reset();
      setIsSubmitting(false);
    }, 1500);
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="container py-12 px-4 md:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Get in Touch</h1>
          <p className="text-lg text-muted-foreground">
            Have questions about our courses, platform, or anything else? We're here to help!
            Fill out the form below and our team will get back to you shortly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Contact information */}
          <div className="lg:col-span-1 space-y-6">
            {contactInfo.map((info, i) => (
              <div key={i} className="border rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <div className="mr-3 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <info.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{info.title}</h3>
                </div>
                <div className="space-y-3">
                  {info.details.map((detail, j) => (
                    <div key={j}>
                      <p className="text-sm font-medium text-muted-foreground">{detail.label}</p>
                      <p className="font-medium">{detail.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Contact form */}
          <div className="lg:col-span-2">
            <div className="border rounded-xl p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
              
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input placeholder="john@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="+254 712 345 678" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a subject" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="general_inquiry">General Inquiry</SelectItem>
                            <SelectItem value="course_information">Course Information</SelectItem>
                            <SelectItem value="technical_support">Technical Support</SelectItem>
                            <SelectItem value="billing_payment">Billing & Payment</SelectItem>
                            <SelectItem value="become_instructor">Become an Instructor</SelectItem>
                            <SelectItem value="course_suggestion">Course Suggestion</SelectItem>
                            <SelectItem value="partnership">Partnership Opportunity</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Please provide details about your inquiry..." 
                          className="min-h-[120px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full md:w-auto" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>
          </div>
        </div>
        
        {/* FAQs */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">
              Find quick answers to common questions about contacting us.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, i) => (
              <div key={i} className="border rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 