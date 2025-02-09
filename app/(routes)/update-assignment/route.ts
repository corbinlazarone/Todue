import { checkAuthenticatedUser, checkUserSubscription } from "@/app/helpers";
import { NextResponse } from "next/server";

export async function POST() {
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
   * Checking if user had paid access to this feature
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
   * Supabase db query to update assignment
   */
}
