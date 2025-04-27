"use client";

import { useState } from "react";
import { CreditCard, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// Mock payment methods
const mockPaymentMethods = [
  {
    id: "pm_1",
    type: "card",
    brand: "visa",
    last4: "4242",
    expMonth: 12,
    expYear: 2024,
    default: true,
  },
  {
    id: "pm_2",
    type: "card",
    brand: "mastercard",
    last4: "5555",
    expMonth: 8,
    expYear: 2025,
    default: false,
  },
];

export default function PaymentMethodsPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState(mockPaymentMethods);

  const addPaymentMethod = () => {
    // In a real app, this would open a Stripe Elements form or similar
    toast.success("Add payment method functionality will be implemented soon");
  };

  const removePaymentMethod = (id: string) => {
    setPaymentMethods(paymentMethods.filter(method => method.id !== id));
    toast.success("Payment method removed");
  };

  const setDefaultPaymentMethod = (id: string) => {
    setPaymentMethods(paymentMethods.map(method => ({
      ...method,
      default: method.id === id,
    })));
    toast.success("Default payment method updated");
  };

  const getBrandIcon = (brand: string) => {
    switch (brand) {
      case "visa":
        return "💳 Visa";
      case "mastercard":
        return "💳 Mastercard";
      case "amex":
        return "💳 American Express";
      default:
        return "💳 Card";
    }
  };

  return (
    <div className="container p-6">
      <h1 className="text-2xl font-bold mb-2">Payment Methods</h1>
      <p className="text-muted-foreground mb-8">
        Manage your payment methods for course purchases
      </p>

      <div className="bg-card border rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Your Payment Methods</h2>
          <Button
            onClick={addPaymentMethod}
            className="flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Method
          </Button>
        </div>

        {paymentMethods.length === 0 ? (
          <div className="text-center py-12">
            <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No payment methods yet</h3>
            <p className="text-muted-foreground mb-6">
              Add a payment method to make purchases on LearnHub
            </p>
            <Button onClick={addPaymentMethod}>
              Add Payment Method
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div 
                key={method.id} 
                className={`flex items-center justify-between p-4 rounded-md border ${
                  method.default ? "bg-primary/5 border-primary/20" : "bg-background"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="font-medium">
                    {getBrandIcon(method.brand)}
                  </div>
                  <div>
                    <p className="font-medium">
                      •••• •••• •••• {method.last4}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Expires {method.expMonth}/{method.expYear}
                      {method.default && (
                        <span className="ml-2 text-primary font-medium">Default</span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!method.default && (
                    <Button
                      onClick={() => setDefaultPaymentMethod(method.id)}
                      variant="outline"
                      size="sm"
                    >
                      Set Default
                    </Button>
                  )}
                  <Button
                    onClick={() => removePaymentMethod(method.id)}
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-card border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Billing Information</h2>
        <p className="text-muted-foreground mb-4">
          Your payment receipts and invoices will be sent to your registered email address.
        </p>
        <p className="text-sm">
          We accept the following payment methods:
        </p>
        <div className="flex gap-2 mt-2">
          <div className="bg-muted p-2 rounded text-sm font-medium">Visa</div>
          <div className="bg-muted p-2 rounded text-sm font-medium">Mastercard</div>
          <div className="bg-muted p-2 rounded text-sm font-medium">American Express</div>
          <div className="bg-muted p-2 rounded text-sm font-medium">M-Pesa</div>
        </div>
      </div>
    </div>
  );
} 