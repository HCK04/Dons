import { loadStripe } from '@stripe/stripe-js';

// Use REACT_APP_STRIPE_PUBLISHABLE_KEY for CRA
const publishableKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || '';

export const HAS_STRIPE = Boolean(publishableKey);
export const stripePromise = publishableKey ? loadStripe(publishableKey) : null;
