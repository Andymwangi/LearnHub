"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { CreditCard, Loader2, ShoppingCart, Trash2 } from "lucide-react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface CartItem {
  id: string;
  title: string;
  instructor: string;
  imageUrl: string;
  price: number;
}

export default function CartPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoadingCart, setIsLoadingCart] = useState(true);

  // Fetch cart items on component mount
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        setIsLoadingCart(true);
        // You would replace this with your actual API call to get cart items
        const response = await axios.get("/api/cart");
        setItems(response.data.items);
      } catch (error) {
        console.error("Failed to fetch cart items:", error);
        toast.error("Failed to load your cart");
      } finally {
        setIsLoadingCart(false);
      }
    };

    fetchCartItems();
  }, [toast]);

  const removeFromCart = async (id: string) => {
    try {
      await axios.delete(`/api/cart/items/${id}`);
      setItems(items.filter(item => item.id !== id));
      toast.success("Item removed from cart");
    } catch (error) {
      console.error("Failed to remove item:", error);
      toast.error("Failed to remove item from cart");
    }
  };

  const checkout = async () => {
    try {
      setIsLoading(true);
      
      // Process each course checkout separately
      for (const item of items) {
        const response = await axios.post("/api/checkout", {
          courseId: item.id,
          returnUrl: window.location.origin + "/dashboard/courses"
        });
        
        // Redirect to the first payment URL
        if (response.data.url) {
          window.location.href = response.data.url;
          return;
        } else if (response.data.success) {
          // Free course - no need to redirect to payment
          toast.success(`Successfully enrolled in ${item.title}`);
        }
      }
      
      // If we get here, all courses were free
      window.location.href = "/dashboard/courses";
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Something went wrong with the checkout process");
    } finally {
      setIsLoading(false);
    }
  };

  const subtotal = items.reduce((total, item) => total + item.price, 0);
  
  if (isLoadingCart) {
    return (
      <div className="container p-6 flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="container p-6">
      <h1 className="text-2xl font-bold mb-2">Shopping Cart</h1>
      <p className="text-muted-foreground mb-8">
        {items.length} {items.length === 1 ? "course" : "courses"} in cart
      </p>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-medium mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">
            Browse our courses and find something to learn today
          </p>
          <Link href="/courses">
            <Button>Browse Courses</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex border rounded-lg p-4 bg-card">
                <div className="w-20 h-20 relative rounded-md overflow-hidden flex-shrink-0">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="ml-4 flex-grow">
                  <h3 className="font-medium line-clamp-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {item.instructor}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">
                      {formatPrice(item.price)}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-card border rounded-lg p-6 h-fit">
            <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Discounts</span>
                <span>-{formatPrice(0)}</span>
              </div>
              <div className="pt-2 border-t mt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
              </div>
            </div>
            
            <Button
              onClick={checkout}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Checkout
                </>
              )}
            </Button>
            
            <div className="mt-4 text-xs text-center text-muted-foreground">
              By completing your purchase you agree to our{" "}
              <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 