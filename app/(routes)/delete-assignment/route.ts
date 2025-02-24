import { checkAuthenticatedUser, checkUserSubscription } from "@/app/helpers";
import { rateLimit } from "@/utils/rate-limiter";
import { SupabaseClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

interface AssignmentFromDB {
  id: number;
  name: string;
  description: string;
  due_date: string;
  color: string;
  start_time: string;
  end_time: string;
  reminder: number;
  created_at: string;
}

const deleteAssignment = async (
  courseId: number,
  assignmentId: number,
  supabase: SupabaseClient
): Promise<AssignmentFromDB> => {
  try {
    const { data: deletedAssignment, error: deleteError } = await supabase
      .from("assignments")
      .delete()
      .eq("id", assignmentId)
      .eq("course_id", courseId)
      .single();

    if (deleteError) {
      console.error("Error deleting assignment in supabase: ", deleteError);
      throw new Error("Failed to delete assignment");
    }

    return deletedAssignment;
  } catch (error: any) {
    console.error("Error in deleteAssignment: ", error);
    throw error;
  }
};

export async function DELETE(request: NextRequest) {
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
     * Supabase client to delete assignment
     */
    const { supabaseClient } = userAuthenticated;
    if (!supabaseClient) {
      return NextResponse.json(
        { error: "Supabase not intialized" },
        { status: 500 }
      );
    }

    const assignmentId: number = body.assignmentId;
    const courseId: number = body.courseId;

    if (!assignmentId) {
      return NextResponse.json(
        { error: "Assignment ID is required" },
        { status: 400 }
      );
    }

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    const deletedAssignment = await deleteAssignment(
      courseId,
      assignmentId,
      supabaseClient
    );

    return NextResponse.json({
      message: "Assignment deleted successfully",
      assignment: deletedAssignment,
    });
  } catch (error: any) {
    console.error("Error  in DELETE /delete-assignment: ", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Try again later." },
      { status: 500 }
    );
  }
}