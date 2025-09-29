import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with publishable key
// In production, use environment variables
export const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51234567890abcdef'
);

// Stripe configuration for Emiho platform
export const STRIPE_CONFIG = {
  publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51234567890abcdef',
  appearance: {
    theme: 'stripe',
    variables: {
      colorPrimary: '#0052CC',
      colorBackground: '#ffffff',
      colorText: '#374151',
      colorDanger: '#EF4444',
      fontFamily: 'Inter, system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '8px'
    }
  }
};

// Payment processing helpers
export const createPaymentIntent = async (planData) => {
  try {
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        plan_id: planData.id,
        amount: parseFloat(planData.price.replace('$', '')) * 100
      })
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};

export const createSubscription = async (paymentMethodId, planId, customerDetails) => {
  try {
    const response = await fetch('/api/create-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        payment_method_id: paymentMethodId,
        plan_id: planId,
        customer_details: customerDetails
      })
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
};

// Format price for display
export const formatPrice = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  }).format(amount);
};

// Validate payment form data
export const validatePaymentForm = (billingDetails) => {
  const errors = {};
  
  if (!billingDetails.name.trim()) {
    errors.name = 'Full name is required';
  }
  
  if (!billingDetails.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(billingDetails.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  if (!billingDetails.address.line1.trim()) {
    errors.address = 'Address is required';
  }
  
  if (!billingDetails.address.city.trim()) {
    errors.city = 'City is required';
  }
  
  if (!billingDetails.address.state.trim()) {
    errors.state = 'State is required';
  }
  
  if (!billingDetails.address.postal_code.trim()) {
    errors.postalCode = 'ZIP code is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export default stripePromise;