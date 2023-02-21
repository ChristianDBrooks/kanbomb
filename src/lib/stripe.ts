import Stripe from "stripe";

const apiKey = process.env.STRIPE_SECRET_KEY;

if (!apiKey) {
  throw new Error('Set the STRIPE_SECRET_KEY in the .env file')
}

export const stripe = new Stripe(apiKey, {
  apiVersion: "2022-11-15",
});
