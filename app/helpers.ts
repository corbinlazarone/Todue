"use server";

import { createClient } from "@/utils/supabase/server";
import { Session, User } from "@supabase/supabase-js";

interface StripeCustomer {
  has_access: boolean;
}

interface AuthenticatedResponse {
  error?: string;
  success?: User;
}

interface SubscriptionResponse {
  error?: string;
  success?: StripeCustomer;
}

interface SessionResponse {
  error?: string;
  success?: any;
}

export const checkAuthenticatedUser =
  async (): Promise<AuthenticatedResponse> => {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Unauthorized" };
    }

    return { success: user };
  };

export const checkUserSubscription = async (
  email?: string
): Promise<SubscriptionResponse> => {
  const supabase = await createClient();

  const { data: userSub, error: subError } = await supabase
    .from("stripe_customers")
    .select("has_access")
    .eq("email", email)
    .single();

  if (subError) {
    return { error: "Error fetching user subscription status" };
  }

  if (!userSub?.has_access) {
    return { error: "Access denied --- Subscription required" };
  }

  return { success: userSub };
};

export const fetchUserSession = async (): Promise<SessionResponse> => {
  const supabase = await createClient();

  const { data: { session }, error: SessionError } =
    await supabase.auth.getSession();

  if (SessionError) {
    return { error: "Error fetching user session" };
  }

  return { success: session };
};
