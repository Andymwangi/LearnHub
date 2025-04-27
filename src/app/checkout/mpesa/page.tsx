"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

// Form schema
const formSchema = z.object({
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(12, "Phone number must be at most 12 digits")
    .regex(/^[0-9]+$/, "Phone number must contain only digits"),
});

type FormValues = z.infer<typeof formSchema>;

export default function MpesaCheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  
  const courseId = searchParams.get("courseId");
  const [course, setCourse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: "",
    },
  });

  // Fetch course details
  useEffect(() => {
    async function fetchCourse() {
      if (!courseId) {
        router.push("/dashboard/courses");
        return;
      }

      try {
        setIsLoading(true);
        const response = await axios.get(`/api/courses/${courseId}`);
        setCourse(response.data);
      } catch (error) {
        console.error("Error fetching course:", error);
        toast.error("Failed to load course details");
        router.push("/dashboard/courses");
      } finally {
        setIsLoading(false);
      }
    }

    fetchCourse();
  }, [courseId, router, toast]);

  const onSubmit = async (values: FormValues) => {
    if (!courseId || !course) return;

    try {
      setIsSubmitting(true);
      
      // Format phone number for M-PESA (add country code if needed)
      let formattedPhoneNumber = values.phoneNumber;
      if (formattedPhoneNumber.startsWith("0")) {
        formattedPhoneNumber = `254${formattedPhoneNumber.substring(1)}`;
      }
      
      // This would be the real M-PESA STK push API integration
      const response = await axios.post("/api/checkout/mpesa/stk", {
        courseId,
        phoneNumber: formattedPhoneNumber,
        amount: course.price,
      });
      
      if (response.data.success) {
        toast.success("Payment request sent to your phone");
        
        // Redirect to a waiting page
        router.push(`/checkout/mpesa/waiting?courseId=${courseId}&checkoutId=${response.data.checkoutId}`);
      } else {
        throw new Error(response.data.message || "Payment initiation failed");
      }
    } catch (error: any) {
      console.error("M-PESA payment error:", error);
      toast.error(error.response?.data?.error || "Failed to process payment");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!course) {
    return null;
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">M-PESA Payment</h1>
      
      <div className="bg-muted/30 p-4 rounded-lg mb-6">
        <h2 className="font-semibold mb-2">{course.title}</h2>
        <p className="text-xl font-bold">
          KES {course.price?.toFixed(2) || "0.00"}
        </p>
      </div>
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="e.g. 0712345678"
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button
          type="submit"
          className="w-full bg-[#4caf50] hover:bg-[#388e3c] text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            "Pay with M-PESA"
          )}
        </Button>
        
        <p className="text-xs text-center text-muted-foreground mt-4">
          You will receive a prompt on your phone to complete the payment.
        </p>
      </form>
    </div>
  );
} 