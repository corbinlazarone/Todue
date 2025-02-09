import { checkAuthenticatedUser, checkUserSubscription } from "@/app/helpers";
import { NextResponse } from "next/server";

// Fetching user extraction history

export async function GET() {
  /**
   * Checking if user is authenticated
   */
  const userAuthenticated = await checkAuthenticatedUser();
  if (userAuthenticated.error) {
    return NextResponse.json(
      { error: userAuthenticated.error },
      { status: 401 }
    );
  }

  /**
   * Checking if user has paid access to this feature
   */
  const userSubscription = await checkUserSubscription(
    userAuthenticated.success?.email
  );

  if (userSubscription.error === "Access denied --- Subscription required") {
    return NextResponse.json(
      { error: userSubscription.error },
      { status: 403 }
    );
  }

  if (userSubscription.error === "Error fetching user subscription status") {
    return NextResponse.json(
      { error: userSubscription.error },
      { status: 500 }
    );
  }

  /**
   * Supabase db query to fetch user extraction history
   */
}