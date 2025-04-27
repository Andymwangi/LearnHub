"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle, Clock, CreditCard, Shield } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Mock subscription plans
const subscriptionPlans = [
  {
    id: "plan_basic",
    name: "Basic",
    price: 0,
    features: [
      "Access to free courses",
      "Limited course previews",
      "Community forum access",
      "Mobile app access",
    ],
    recommended: false,
  },
  {
    id: "plan_pro",
    name: "Pro",
    price: 1999,
    interval: "month",
    features: [
      "Unlimited access to all courses",
      "Course completion certificates",
      "Offline downloads",
      "Priority support",
      "Ad-free experience",
    ],
    recommended: true,
  },
  {
    id: "plan_team",
    name: "Team",
    price: 4999,
    interval: "month",
    features: [
      "Everything in Pro",
      "Team management dashboard",
      "User analytics",
      "Admin controls",
      "Bulk enrollments",
      "Custom learning paths",
    ],
    recommended: false,
  },
];

// Mock active subscription
const mockActiveSubscription = {
  planId: "plan_basic",
  status: "active",
  currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
};

export default function SubscriptionsPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [activeSubscription, setActiveSubscription] = useState(mockActiveSubscription);

  const subscribeToPlan = async (planId: string) => {
    try {
      setIsLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setActiveSubscription({
        planId,
        status: "active",
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });
      
      toast.success(`Subscribed to ${
        subscriptionPlans.find(plan => plan.id === planId)?.name
      } plan`);
    } catch (error) {
      toast.error("Failed to update subscription");
    } finally {
      setIsLoading(false);
    }
  };

  const cancelSubscription = async () => {
    try {
      setIsLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setActiveSubscription({
        ...activeSubscription,
        status: "canceled",
      });
      
      toast.success("Subscription canceled");
    } catch (error) {
      toast.error("Failed to cancel subscription");
    } finally {
      setIsLoading(false);
    }
  };

  const getActivePlan = () => {
    return subscriptionPlans.find(plan => plan.id === activeSubscription.planId);
  };

  const activePlan = getActivePlan();

  return (
    <div className="container p-6">
      <h1 className="text-2xl font-bold mb-2">Subscription Plans</h1>
      <p className="text-muted-foreground mb-8">
        Choose the plan that works best for your learning goals
      </p>

      {/* Current Subscription */}
      <div className="bg-card border rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Current Plan</h2>
        
        <div className="flex items-center justify-between p-4 rounded-md bg-primary/5 border border-primary/20">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg">{activePlan?.name || "Basic"}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                activeSubscription.status === "active" 
                  ? "bg-green-100 text-green-800" 
                  : "bg-amber-100 text-amber-800"
              }`}>
                {activeSubscription.status === "active" ? "Active" : "Canceled"}
              </span>
            </div>
            
            <p className="text-sm text-muted-foreground mt-1">
              {activeSubscription.status === "active" ? (
                <>
                  <Clock className="inline-block h-3 w-3 mr-1" />
                  Renews on {activeSubscription.currentPeriodEnd.toLocaleDateString()}
                </>
              ) : (
                <>
                  <Clock className="inline-block h-3 w-3 mr-1" />
                  Access until {activeSubscription.currentPeriodEnd.toLocaleDateString()}
                </>
              )}
            </p>
          </div>
          
          {activeSubscription.status === "active" && activeSubscription.planId !== "plan_basic" && (
            <Button
              onClick={cancelSubscription}
              variant="outline"
              disabled={isLoading}
            >
              Cancel Subscription
            </Button>
          )}
        </div>
      </div>

      {/* Plan Comparison */}
      <h2 className="text-xl font-semibold mb-6">Available Plans</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {subscriptionPlans.map((plan) => (
          <div 
            key={plan.id} 
            className={`border rounded-lg overflow-hidden ${
              plan.recommended 
                ? "border-primary shadow-md relative" 
                : ""
            }`}
          >
            {plan.recommended && (
              <div className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 text-center">
                RECOMMENDED
              </div>
            )}
            
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              
              <div className="mb-4">
                <span className="text-3xl font-bold">
                  {plan.price === 0 ? "Free" : formatPrice(plan.price)}
                </span>
                {plan.interval && (
                  <span className="text-muted-foreground text-sm">
                    /{plan.interval}
                  </span>
                )}
              </div>
              
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button
                onClick={() => subscribeToPlan(plan.id)}
                disabled={isLoading || (activeSubscription.status === "active" && activeSubscription.planId === plan.id)}
                className="w-full"
                variant={plan.recommended ? "default" : "outline"}
              >
                {activeSubscription.status === "active" && activeSubscription.planId === plan.id
                  ? "Current Plan"
                  : "Choose Plan"}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="bg-muted/30 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-1">How do subscriptions work?</h3>
            <p className="text-sm text-muted-foreground">
              Subscriptions give you unlimited access to our course library for the duration of your subscription period.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium mb-1">Can I cancel anytime?</h3>
            <p className="text-sm text-muted-foreground">
              Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your current billing period.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium mb-1">How do I update my payment method?</h3>
            <p className="text-sm text-muted-foreground">
              You can update your payment information in your 
              <Link href="/dashboard/payment-methods" className="text-primary hover:underline ml-1">
                payment methods
              </Link> settings.
            </p>
          </div>
        </div>
        
        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Shield className="h-4 w-4" />
          <span>Secure payment processing by Stripe</span>
          <CreditCard className="h-4 w-4 ml-2" />
        </div>
      </div>
    </div>
  );
} 