import { checkAuthenticatedUser, checkUserSubscription } from "@/app/helpers";
import { rateLimit } from "@/utils/rate-limiter";
import { SupabaseClient, User } from "@supabase/supabase-js";
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

const updateAssignment = async (
  assignment: Assignment,
  supabase: SupabaseClient
) => {
  try {
    const { id, name, description, due_date, color, start_time, end_time } =
      assignment;

    const { data: updatedAssignment, error: updateError } = await supabase
      .from("assignments")
      .update({
        name,
        description,
        due_date,
        color,
        start_time,
        end_time,
      })
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating assignment in supabase: ", updateError);
      throw new Error("Failed to update assignment");
    }

    return updatedAssignment;
  } catch (error: any) {
    console.error("Error in updateAssignment: ", error);
    throw error;
  }
};

export async function POST(request: NextRequest) {
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
     * Supabase db query to update assignment
     */
    const { supabaseClient } = userAuthenticated;
    if (!supabaseClient) {
      return NextResponse.json(
        { error: "Supabase not intialized" },
        { status: 500 }
      );
    }

    /**
     * Pass to update assignmet function
     */
    const assignment: Assignment = body.assignment;

    const updatedAssignment = await updateAssignment(
      assignment,
      supabaseClient
    );

    return NextResponse.json({
      message: "Assignment updated successfully",
      updatedAssignment: updatedAssignment,
    });
  } catch (error: any) {
    console.error("Error in POST /update-assignment: ", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Try again later." },
      { status: 500 }
    );
  }
}