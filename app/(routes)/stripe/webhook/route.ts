import { rateLimit } from "@/utils/rate-limiter";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: Request) {
  // Check rate limit
  const rateLimitResult = rateLimit(request);
  if (rateLimitResult) return rateLimitResult;

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  const supabase = await createClient();

  // Early return if signature is missing
  if (!signature) {
    return NextResponse.json(
      { error: "No stripe-signature header found" },
      { status: 400 }
    );
  }

  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Webhook secret is not configured" },
      { status: 500 }
    );
  }

  let data;
  let eventType;
  let event;

  // verify Stripe event is legit
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed. ${err.message}`);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  data = event.data;
  eventType = event.type;

  try {
    switch (eventType) {
      case "checkout.session.completed": {
        // First payment is successful and a subscription is created (if mode was set to "subscription" in ButtonCheckout)
        // ✅ Grant access to the product

        const session = event.data.object as Stripe.Checkout.Session;

        // customer details
        const customer = await stripe.customers.retrieve(
          session.customer as string
        );

        // TODO: Fix stripe customer not updating in supabase db.

        if (customer.deleted) {
          throw Error("Customer has been deleted");
        }

        if (customer.email) {
          // search for user by email
          const { data: existingUser, error: fetchError } = await supabase
            .from("stripe_customers")
            .select("*")
            .eq("email", customer.email)
            .single(); // Retrieve a single user record

          if (fetchError && fetchError.code !== "PGRST116") {
            // Handle non-existence without error
            console.error(
              "Error fetching user data from Supabase:",
              fetchError
            );
            return NextResponse.json(
              { error: "Error fetching customer information" },
              { status: 500 }
            );
          }

          let user = existingUser;

          // if user dosent exist create a new one
          if (!user) {
            const { error: insertError } = await supabase
              .from("stripe_customers")
              .insert([
                {
                  stripe_customer_id: customer.id,
                  email: customer.email,
                  name: customer.name,
                  has_access: true,
                },
              ]);

            if (insertError) {
              console.error("Error inserting new customer:", insertError);
              return NextResponse.json(
                { error: "Error adding new customer information" },
                { status: 500 }
              );
            }
          }
        }

        // Extra: >>>> send welcom email or login link <<<<<<

        break;
      }

      case "customer.subscription.deleted": {
        // ❌ Revoke access to the product
        // The customer might have changed the plan (higher or lower plan, cancel soon etc...)

        const subscription = event.data.object as Stripe.Subscription;

        // Remove access
        const { error } = await supabase
          .from("stripe_customers")
          .update({
            has_access: false,
          })
          .eq("stripe_customer_id", subscription.customer);

        if (error) {
          console.error("Error revoking customer access:", error);
          return NextResponse.json(
            { error: "Error revoking customer access" },
            { status: 500 }
          );
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error(
      "stripe error: " + error.message + " | EVENT TYPE: " + eventType
    );
    return NextResponse.json(
      { error: "Webhook processing error" },
      { status: 500 }
    );
  }
}