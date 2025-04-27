import checkoutSdk from "@paypal/checkout-server-sdk";
import axios from "axios";

// This function configures and returns a PayPal client
function getPayPalClient() {
  const clientId = process.env.PAYPAL_CLIENT_ID as string;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET as string;
  const environment = process.env.PAYPAL_MODE === "live"
    ? new checkoutSdk.core.LiveEnvironment(clientId, clientSecret)
    : new checkoutSdk.core.SandboxEnvironment(clientId, clientSecret);

  return new checkoutSdk.core.PayPalHttpClient(environment);
}

// Interface for checkout parameters
interface CreatePayPalOrderParams {
  courseId: string;
  courseTitle: string;
  price: number;
  currency?: string;
  successUrl: string;
  cancelUrl: string;
}

/**
 * Converts KES to USD for PayPal processing
 * PayPal does not directly support KES, so we convert to USD
 */
async function convertKesToUsd(kesAmount: number): Promise<number> {
  try {
    // Use ExchangeRate-API (free tier has limited requests)
    // For production, use a paid service like Fixer, ExchangeRate-API, or Open Exchange Rates
    const apiKey = process.env.EXCHANGE_RATE_API_KEY;
    
    if (apiKey) {
      const response = await axios.get(
        `https://v6.exchangerate-api.com/v6/${apiKey}/pair/KES/USD/${kesAmount}`
      );
      
      if (response.data && response.data.conversion_result) {
        // Round to 2 decimal places
        return Math.round(response.data.conversion_result * 100) / 100;
      }
    }
    
    // Fallback to static conversion if API fails or key not available
    // For production, you might want to log this as an error
    console.warn("Using fallback static exchange rate conversion");
    const staticExchangeRate = 130; // 1 USD = 130 KES (approximate)
    const usdAmount = kesAmount / staticExchangeRate;
    return Math.round(usdAmount * 100) / 100;
  } catch (error) {
    console.error("Error converting currency:", error);
    // Fallback to static conversion
    const staticExchangeRate = 130; // 1 USD = 130 KES (approximate)
    const usdAmount = kesAmount / staticExchangeRate;
    return Math.round(usdAmount * 100) / 100;
  }
}

/**
 * Creates a PayPal order for course purchase
 */
export async function createPayPalOrder({
  courseId,
  courseTitle,
  price,
  currency = "KES",
  successUrl,
  cancelUrl
}: CreatePayPalOrderParams) {
  const client = getPayPalClient();
  
  // If currency is KES, convert to USD for PayPal processing
  let processedPrice = price;
  let processedCurrency = currency;
  
  if (currency === "KES") {
    processedPrice = await convertKesToUsd(price);
    processedCurrency = "USD";
  }
  
  const request = new checkoutSdk.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        reference_id: courseId,
        description: `Purchase for ${courseTitle}`,
        amount: {
          currency_code: processedCurrency,
          value: processedPrice.toString()
        },
        custom_id: JSON.stringify({
          originalCurrency: currency,
          originalAmount: price
        })
      }
    ],
    application_context: {
      return_url: successUrl,
      cancel_url: cancelUrl,
      brand_name: "LearnHub",
      user_action: "PAY_NOW",
      shipping_preference: "NO_SHIPPING"
    }
  });

  try {
    const response = await client.execute(request);
    return response.result;
  } catch (error) {
    console.error("PayPal order creation error:", error);
    throw error;
  }
}

/**
 * Captures a PayPal payment after user approval
 */
export async function capturePayPalPayment(orderId: string) {
  const client = getPayPalClient();
  const request = new checkoutSdk.orders.OrdersCaptureRequest(orderId);

  try {
    const response = await client.execute(request);
    return response.result;
  } catch (error) {
    console.error("PayPal capture error:", error);
    throw error;
  }
}

/**
 * Validates a completed PayPal payment
 */
export async function validatePayPalPayment(orderId: string) {
  const client = getPayPalClient();
  const request = new checkoutSdk.orders.OrdersGetRequest(orderId);

  try {
    const response = await client.execute(request);
    const order = response.result;
    
    // Verify the payment was successful
    return {
      isValid: order.status === "COMPLETED" || order.status === "APPROVED",
      orderId: order.id,
      orderData: order
    };
  } catch (error) {
    console.error("PayPal validation error:", error);
    return { isValid: false };
  }
}