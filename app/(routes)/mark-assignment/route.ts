import { checkAuthenticatedUser, checkUserSubscription } from "@/app/helpers";
import { rateLimit } from "@/utils/rate-limiter";
import { SupabaseClient } from "@supabase/supabase-js";
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

interface Alert {
  type?: "info" | "success" | "warning" | "error";
  message: string;
}

const markAssignmentInDB = async (
  assignment: Assignment,
  markAssignment: MarkAssignment,
  supabase: SupabaseClient
) => {
  try {
    // Create update object based on whether we're marking or unmarking
    const updateData = markAssignment
      ? {
          completed: true,
          completed_at: new Date().toISOString(),
        }
      : {
          completed: false,
          completed_at: null,
        };

    const { data: updatedAssignment, error: markAssignmentError } =
      await supabase
        .from("assignments")
        .update(updateData)
        .eq("id", assignment.id)
        .select("*")
        .single();

    if (markAssignmentError) {
      console.error(
        "Error marking assignment in supabase: ",
        markAssignmentError
      );
      throw new Error("Failed to mark assignment");
    }

    return updatedAssignment;
  } catch (error: any) {
    console.error("Error marking assignment in DB: ", error);
    throw error;
  }
};

export async function PUT(request: NextRequest) {
  // Check rate limit
  const rateLimitResult = rateLimit(request);
  if (rateLimitResult) return rateLimitResult;

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
        { error: "Supabase not initialized" },
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

    const updatedAssignment = await markAssignmentInDB(
      assignment,
      markAssignment,
      supabaseClient
    );

    const actionMessage: Alert = markAssignment
      ? {
          type: "success",
          message: "Assignment marked as completed",
        }
      : {
          type: "warning",
          message: "Assignment marked as incomplete",
        };

    return NextResponse.json(
      { message: actionMessage, assignment: updatedAssignment },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in PUT /mark-assignment: ", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Try again later." },
      { status: 500 }
    );
  }
}