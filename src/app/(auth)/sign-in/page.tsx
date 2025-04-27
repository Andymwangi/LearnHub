"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { AtSign, LogIn, Mail, GraduationCap, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { signIn } from "next-auth/react";
import { Separator } from "@/components/ui/separator";

// Define animation variants
const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function SignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast, success, error } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [linkSent, setLinkSent] = useState(false);
  const [callbackUrl, setCallbackUrl] = useState("/dashboard");

  useEffect(() => {
    // Get callbackUrl from searchParams, but ensure it's not creating a loop
    const urlCallbackParam = searchParams.get("callbackUrl");
    if (urlCallbackParam && !urlCallbackParam.includes("/sign-in")) {
      setCallbackUrl(urlCallbackParam);
    }
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      const result = await signIn("email", {
        email: data.email,
        redirect: false,
        callbackUrl
      });
      
      if (result?.error) {
        error("Something went wrong. Please try again.");
      } else {
        success("Magic link sent! Check your email.");
        setLinkSent(true);
      }
    } catch (err) {
      error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (linkSent) {
    return (
      <motion.div 
        className="space-y-6 max-w-md w-full p-8 rounded-lg border border-neutral-200/40 dark:border-neutral-800/40 bg-card shadow-sm"
        initial="hidden"
        animate="visible"
        variants={scaleIn}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Check your email</h1>
          <p className="text-muted-foreground text-center">
            We've sent you a magic link to sign in. Please check your inbox and click the link to continue.
          </p>
        </div>
        <div className="text-sm text-center text-muted-foreground pt-4 border-t border-neutral-200/40 dark:border-neutral-800/40">
          Didn't receive an email? Check your spam folder or{" "}
          <button 
            onClick={() => setLinkSent(false)} 
            className="text-primary font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-primary/20 rounded px-1 py-0.5"
          >
            try again
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="max-w-md w-full p-8 rounded-lg border border-neutral-200/40 dark:border-neutral-800/40 bg-card shadow-sm"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={scaleIn} className="flex items-center justify-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold">
          <GraduationCap className="h-8 w-8 text-primary" />
          <span>LearnHub</span>
        </Link>
      </motion.div>
      
      <motion.div variants={scaleIn} className="space-y-2 mb-6">
        <h1 className="text-2xl font-bold">Sign in to your account</h1>
        <p className="text-muted-foreground">
          Continue your learning journey where you left off
        </p>
      </motion.div>
      
      <motion.div variants={scaleIn}>
        <Button 
          variant="outline" 
          className="w-full mb-4 py-6 relative group"
          onClick={() => {
            // Mock Google OAuth signin
            toast.info("Sign-in feature in development. This is a mock-up. OAuth sign-in would be here.");
          }}
        >
          <div className="absolute left-4 flex items-center justify-center">
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          </div>
          <span className="text-sm font-medium">Continue with Google</span>
        </Button>
      </motion.div>
      
      <motion.div variants={scaleIn} className="relative my-6">
        <Separator />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="bg-card px-2 text-xs text-muted-foreground">OR</span>
        </div>
      </motion.div>
      
      <motion.form variants={scaleIn} onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute left-3 top-2.5 text-muted-foreground">
              <AtSign className="h-5 w-5" />
            </div>
            <Input
              {...register("email")}
              className="pl-10 py-6"
              placeholder="you@example.com"
              disabled={isLoading}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-destructive flex items-center gap-1.5">
              <span className="bg-destructive/10 p-0.5 rounded-full">
                <CheckCircle2 className="h-3.5 w-3.5 text-destructive" />
              </span>
              {errors.email.message}
            </p>
          )}
        </div>

        <Button 
          type="submit" 
          className="w-full py-6 font-medium" 
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Sending magic link...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <LogIn className="h-4 w-4" />
              Send Sign In Link
            </span>
          )}
        </Button>
      </motion.form>

      <motion.div variants={scaleIn} className="text-center text-sm mt-6 pt-4 border-t border-neutral-200/40 dark:border-neutral-800/40">
        <p className="text-muted-foreground">
          Don't have an account?{" "}
          <Link 
            href="/sign-up" 
            className="text-primary font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-primary/20 rounded px-1 py-0.5"
          >
            Sign up
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
} 