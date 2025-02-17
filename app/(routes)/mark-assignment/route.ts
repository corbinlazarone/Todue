import { checkAuthenticatedUser, checkUserSubscription } from "@/app/helpers";
import { console } from "inspector";
import { NextRequest, NextResponse } from "next/server";

interface Assignment {
  id: number;
  name: string;
  description: string;
  due_date: string;
  color: string;
  start_time: string;
  end_time: string;
  reminder: number;
}

interface MarkAssignment {
  markAssignment: boolean;
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

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
     * Supabase client to insert assignment
     */
    const { supabaseClient } = userAuthenticated;
    if (!supabaseClient) {
      return NextResponse.json(
        { error: "Supabase not intialized" },
        { status: 500 }
      );
    }

    /**
     * Check for correct request body
     */
    const assignment: Assignment = body.assignment;
    const markAssignment: MarkAssignment = body.MarkAssignment;

    if (!assignment) {
      return NextResponse.json(
        { error: "Assignment data is required" },
        { status: 400 }
      );
    }

    if (markAssignment === undefined) {
      return NextResponse.json(
        { error: "MarkAssignment data is required" },
        { status: 400 }
      );
    }

    // markAssignment is a boolean, just insert that value to the database
    // and when that assignment was mark completed

    return NextResponse.json({ message: "Success" }, { status: 200 });
  } catch (error: any) {
    console.error("Error in PUT /mark-assignment: ", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Try again later." },
      { status: 500 }
    );
  }
}