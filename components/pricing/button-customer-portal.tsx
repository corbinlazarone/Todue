"use client";

import { User } from "@supabase/supabase-js";

// Stripe Customer portal link
const customerPortalLink: string =
  "https://billing.stripe.com/p/login/test_4gw0039xSc0Kdzy5kk";

interface PageProps {
  user: User;
}

export default function ButtonCustomerPortal({ user }: PageProps) {
  return (
    <div>
      <a href={customerPortalLink + "?prefilled_email=" + user?.email}>
        <button>Billing</button>
      </a>
    </div>
  );
}