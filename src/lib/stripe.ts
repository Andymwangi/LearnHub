import Stripe from "stripe";
import { db } from "@/lib/db";
import { sendCourseEnrollmentEmail } from "@/lib/email";

// Initialize Stripe with API key and version
export const stripe = new Stripe(process.env.STRIPE_API_KEY as string, {
  apiVersion: "2025-03-31.basil",
  typescript: true,
});

// Interface for checkout session parameters
interface CreateCheckoutSessionParams {
  userId: string;
  courseId: string;
  courseTitle: string;
  price: number;
  successUrl: string;
  cancelUrl: string;
}

/**
 * Creates a Stripe checkout session for course purchase
 */
export async function createCheckoutSession({
  userId,
  courseId,
  courseTitle,
  price,
  successUrl,
  cancelUrl
}: CreateCheckoutSessionParams) {
  // Get or create the customer
  const stripeCustomerId = await getOrCreateStripeCustomer(userId);

  // Create the checkout session
  const session = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "kes",
          product_data: {
            name: courseTitle,
            description: `Purchase for ${courseTitle}`,
          },
          unit_amount: Math.round(price * 100), // Stripe expects amount in cents
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId,
      courseId,
    },
  });

  return session;
}

/**
 * Gets or creates a Stripe customer for a user
 */
async function getOrCreateStripeCustomer(userId: string): Promise<string> {
  // Get user from database
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { stripeCustomerId: true, email: true, name: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // If user already has a Stripe customer ID, return it
  if (user.stripeCustomerId) {
    return user.stripeCustomerId;
  }

  // Create a new Stripe customer
  const customer = await stripe.customers.create({
    email: user.email as string,
    name: user.name as string,
    metadata: {
      userId,
    },
  });

  // Update user with new Stripe customer ID
  await db.user.update({
    where: { id: userId },
    data: { stripeCustomerId: customer.id },
  });

  return customer.id;
}

/**
 * Handles Stripe webhook events
 */
export async function handleStripeWebhook(event: Stripe.Event) {
  const { type, data } = event;

  // Handle checkout.session.completed event
  if (type === 'checkout.session.completed') {
    const session = data.object as Stripe.Checkout.Session;
    const { userId, courseId } = session.metadata as { userId: string; courseId: string };

    // Record the purchase in the database
    await db.purchase.create({
      data: {
        userId,
        courseId,
      },
    });

    // Get user and course details for the email
    const [user, course] = await Promise.all([
      db.user.findUnique({
        where: { id: userId },
        select: { email: true, name: true }
      }),
      db.course.findUnique({
        where: { id: courseId },
        select: { title: true }
      })
    ]);

    // Send enrollment confirmation email
    if (user?.email && course) {
      await sendCourseEnrollmentEmail(
        user.name || "Student",
        user.email,
        course.title,
        courseId
      );
    }
  }

  return { received: true };
} 