import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";

export const createOrder = async (event: Stripe.CheckoutSessionCompletedEvent) => {
  const checkoutSession = event.data.object;

  // get order information from event
  const timePlaced = new Date(event.created * 1000);

  // need to get line items from a checkout session and decrease the quantity in our database by 1
  // create order in database

  // link order to customer based off email or stripe customer id
}