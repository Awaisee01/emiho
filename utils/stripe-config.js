import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe
export const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51234567890abcdef');

// Stripe configuration and helper functions for Emiho platform

// Stripe publishable key (use environment variables in production)
export const STRIPE_CONFIG = {
  publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51234567890abcdef',
  apiVersion: '2023-10-16',
  locale: 'en',
  appearance: {
    theme: 'stripe',
    variables: {
      colorPrimary: '#0052CC',
      colorBackground: '#ffffff',
      colorText: '#374151',
      colorDanger: '#EF4444',
      fontFamily: 'Inter, system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '12px'
    }
  }
};

// Subscription plans configuration for Emiho
export const SUBSCRIPTION_PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    priceId: null,
    interval: 'month',
    description: 'Perfect for getting started with basic legacy preservation',
    features: [
      'Create up to 3 legacy stories',
      'Upload up to 10 photos per story',
      'Join public communities',
      'Basic story templates',
      'Standard support',
      'Mobile app access'
    ],
    limits: {
      stories: 3,
      photosPerStory: 10,
      videoUploads: false,
      privateCommunities: false,
      customTemplates: false,
      aiFeatures: false,
      exportPDF: false,
      removeBranding: false
    }
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    price: 4.99,
    priceId: 'price_premium_monthly', // Replace with actual Stripe price ID
    interval: 'month',
    description: 'Enhanced features for dedicated memory keepers',
    features: [
      'Unlimited legacy stories',
      'Unlimited photo & video uploads',
      'Create private communities',
      'Premium story templates',
      'Priority customer support',
      'Advanced privacy controls',
      'Export stories as PDF books',
      'Remove Emiho branding'
    ],
    limits: {
      stories: -1, // unlimited
      photosPerStory: -1, // unlimited
      videoUploads: true,
      privateCommunities: true,
      customTemplates: true,
      aiFeatures: false,
      exportPDF: true,
      removeBranding: true
    }
  },
  legacyPro: {
    id: 'legacy_pro',
    name: 'Legacy Pro',
    price: 9.99,
    priceId: 'price_legacy_pro_monthly', // Replace with actual Stripe price ID
    interval: 'month',
    description: 'Complete solution with AI-powered features',
    features: [
      'Everything in Premium',
      'AI-generated story summaries',
      'Smart photo organization',
      'Voice-to-text transcription',
      'Advanced analytics',
      'API access for integrations',
      'White-label options',
      'Dedicated account manager',
      'Custom domain support'
    ],
    limits: {
      stories: -1, // unlimited
      photosPerStory: -1, // unlimited
      videoUploads: true,
      privateCommunities: true,
      customTemplates: true,
      aiFeatures: true,
      apiAccess: true,
      whiteLabel: true,
      exportPDF: true,
      removeBranding: true,
      customDomain: true
    }
  }
};

// Payment method types supported
export const PAYMENT_METHODS = {
  card: {
    type: 'card',
    name: 'Credit/Debit Card',
    icon: 'CreditCard',
    supported: true,
    description: 'Visa, Mastercard, American Express'
  },
  paypal: {
    type: 'paypal',
    name: 'PayPal',
    icon: 'Paypal',
    supported: false, // Can be enabled later
    description: 'Pay with your PayPal account'
  },
  applePay: {
    type: 'apple_pay',
    name: 'Apple Pay',
    icon: 'Apple',
    supported: false, // Can be enabled later
    description: 'Pay with Touch ID or Face ID'
  },
  googlePay: {
    type: 'google_pay',
    name: 'Google Pay',
    icon: 'Google',
    supported: false, // Can be enabled later
    description: 'Pay with Google Pay'
  }
};

// Stripe Elements styling for Emiho brand
export const STRIPE_ELEMENT_STYLES = {
  base: {
    fontSize: '16px',
    color: '#374151',
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSmoothing: 'antialiased',
    '::placeholder': {
      color: '#9CA3AF',
    },
    ':-webkit-autofill': {
      color: '#374151',
    },
  },
  invalid: {
    color: '#EF4444',
    iconColor: '#EF4444',
  },
  complete: {
    color: '#10B981',
    iconColor: '#10B981',
  },
};

// Stripe Elements options
export const STRIPE_ELEMENT_OPTIONS = {
  style: STRIPE_ELEMENT_STYLES,
  hidePostalCode: false,
  iconStyle: 'default',
  placeholder: 'Card number',
};

// Helper functions
export const formatPrice = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

export const getPlanById = (planId) => {
  return Object.values(SUBSCRIPTION_PLANS).find(plan => plan.id === planId);
};

export const getPlanByPriceId = (priceId) => {
  return Object.values(SUBSCRIPTION_PLANS).find(plan => plan.priceId === priceId);
};

export const isFeatureAvailable = (planId, feature) => {
  const plan = getPlanById(planId);
  if (!plan) return false;

  return plan.limits[feature] === true || plan.limits[feature] === -1;
};

export const getFeatureLimit = (planId, feature) => {
  const plan = getPlanById(planId);
  if (!plan) return 0;

  return plan.limits[feature] || 0;
};

// Subscription status helpers
export const getSubscriptionStatus = (subscription) => {
  if (!subscription) return 'none';

  const now = new Date();
  const periodEnd = new Date(subscription.currentPeriodEnd);

  if (subscription.status === 'active') {
    return now < periodEnd ? 'active' : 'expired';
  }

  return subscription.status;
};

export const getDaysUntilRenewal = (subscription) => {
  if (!subscription || !subscription.nextBilling) return null;

  const now = new Date();
  const renewalDate = new Date(subscription.nextBilling);
  const diffTime = renewalDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays > 0 ? diffDays : 0;
};

// Error handling helpers
export const getStripeErrorMessage = (error) => {
  switch (error.code) {
    case 'card_declined':
      return 'Your card was declined. Please try a different payment method.';
    case 'expired_card':
      return 'Your card has expired. Please use a different card.';
    case 'incorrect_cvc':
      return 'Your card\'s security code is incorrect.';
    case 'insufficient_funds':
      return 'Your card has insufficient funds.';
    case 'processing_error':
      return 'An error occurred while processing your card. Please try again.';
    case 'rate_limit':
      return 'Too many requests. Please wait a moment and try again.';
    case 'authentication_required':
      return 'Your card requires authentication. Please complete the verification.';
    default:
      return error.message || 'An unexpected error occurred. Please try again.';
  }
};

// Webhook event types for backend integration
export const STRIPE_WEBHOOK_EVENTS = {
  PAYMENT_SUCCEEDED: 'payment_intent.succeeded',
  PAYMENT_FAILED: 'payment_intent.payment_failed',
  SUBSCRIPTION_CREATED: 'customer.subscription.created',
  SUBSCRIPTION_UPDATED: 'customer.subscription.updated',
  SUBSCRIPTION_DELETED: 'customer.subscription.deleted',
  INVOICE_PAID: 'invoice.payment_succeeded',
  INVOICE_FAILED: 'invoice.payment_failed',
  PAYMENT_METHOD_ATTACHED: 'payment_method.attached',
  CUSTOMER_CREATED: 'customer.created',
};

// Development/Testing helpers
export const TEST_CARDS = {
  visa: '4242424242424242',
  visaDebit: '4000056655665556',
  mastercard: '5555555555554444',
  amex: '378282246310005',
  declined: '4000000000000002',
  insufficientFunds: '4000000000009995',
  expired: '4000000000000069',
  cvcFail: '4000000000000127',
  processing: '4000000000000119',
};

// API endpoints configuration
export const API_ENDPOINTS = {
  createSubscription: '/api/subscriptions/create',
  updateSubscription: '/api/subscriptions/update',
  cancelSubscription: '/api/subscriptions/cancel',
  reactivateSubscription: '/api/subscriptions/reactivate',
  updatePaymentMethod: '/api/payment-methods/update',
  getBillingHistory: '/api/billing/history',
  downloadInvoice: '/api/billing/invoice',
  createCustomer: '/api/customers/create',
  updateCustomer: '/api/customers/update'
};

// Validation helpers
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateCardNumber = (cardNumber) => {
  // Basic Luhn algorithm validation
  const cleanNumber = cardNumber.replace(/\s/g, '');
  if (!/^\d+$/.test(cleanNumber)) return false;

  let sum = 0;
  let isEven = false;

  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber[i]);

    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

// Export default configuration object
export default {
  STRIPE_CONFIG,
  SUBSCRIPTION_PLANS,
  PAYMENT_METHODS,
  STRIPE_ELEMENT_STYLES,
  STRIPE_ELEMENT_OPTIONS,
  formatPrice,
  getPlanById,
  getPlanByPriceId,
  isFeatureAvailable,
  getFeatureLimit,
  getSubscriptionStatus,
  getDaysUntilRenewal,
  getStripeErrorMessage,
  STRIPE_WEBHOOK_EVENTS,
  TEST_CARDS,
  API_ENDPOINTS,
  validateEmail,
  validateCardNumber
};