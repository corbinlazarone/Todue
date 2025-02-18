import { checkAuthenticatedUser, checkUserSubscription } from "@/app/helpers";
import { SupabaseClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

interface Assignment {
  name: string;
  description: string;
  due_date: string;
  color: string;
  start_time: string;
  end_time: string;
  reminder: number;
}

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

const insertAssignment = async (
  courseId: any,
  assignment: Assignment,
  supabase: SupabaseClient
): Promise<AssignmentFromDB> => {
  try {
    const {
      name,
      description,
      due_date,
      color,
      start_time,
      end_time,
      reminder,
    } = assignment;

    const { data: insertedAssignment, error: insertError } = await supabase
      .from("assignments")
      .insert({
        id: Math.floor(Math.random() * 1000000) + 1,
        course_id: courseId,
        name,
        description,
        due_date,
        color,
        start_time,
        end_time,
        reminder,
        created_at: new Date().toISOString(),
        completed: false,
        completed_at: null,
      })
      .eq("course_id", courseId)
      .select(
        "id, name, description, due_date, color, start_time, end_time, reminder, created_at"
      )
      .single();

    if (insertError) {
      console.error("Error inserting assignment in supabase: ", insertError);
      throw new Error("Failed to insert assignment");
    }

    return insertedAssignment;
  } catch (error: any) {
    console.error("Error in insertAssignment: ", error);
    throw error;
  }
};

export async function POST(request: NextRequest) {
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
     * Insert assignment
     */
    const assignment: Assignment = body.assignment;
    const courseId: any = body.courseId;

    if (!assignment) {
      return NextResponse.json(
        { error: "Assignment data is required" },
        { status: 400 }
      );
    };

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    };

    const insertedAssignment: AssignmentFromDB = await insertAssignment(
      courseId,
      assignment,
      supabaseClient
    );

    return NextResponse.json({
      message: "Assignment created successfully!",
      insertedAssignment: insertedAssignment,
    });
  } catch (error: any) {
    console.error("Error in POST /insert-manual-assignment: ", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Try again later." },
      { status: 500 }
    );
  }
}