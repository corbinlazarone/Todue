import { checkAuthenticatedUser, checkUserSubscription } from "@/app/helpers";
import { createClient } from "@/utils/supabase/server";
import { SupabaseClient, User } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const getCourseDataHistory = async (
  signedInUser: User,
  supabase: SupabaseClient
) => {
  try {
    const userid = signedInUser?.id;

    const { data: courseHistory, error: courseHistoryError } = await supabase
      .from("courses")
      .select(
        `id, course_name, created_at, assignments (id, name, description, due_date, color, start_time, end_time, reminder)`
      )
      .eq("user_id", userid)
      .order("created_at", { ascending: false });

    if (courseHistoryError) {
      console.error(
        "Error getting user course data from supabase: ",
        courseHistoryError
      );
      throw new Error("Failed to get user course hisotry");
    }

    return courseHistory;
  } catch (error: any) {
    console.error("Error in getCourseDataHistory: ", error);
    throw error;
  }
};

export async function GET(request: NextRequest) {
  try {

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
    const { supabaseClient } = userAuthenticated;

    if (!supabaseClient) {
      return NextResponse.json(
        { error: "Supabase not intialized" },
        { status: 500 }
      );
    }

    const courseHistoryData = await getCourseDataHistory(
      userAuthenticated.success as User,
      supabaseClient
    );

    return NextResponse.json({
      message: "Success getting course data history",
      data: courseHistoryData,
    });
  } catch (error: any) {
    console.error("Error getting user course history: ", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Try again later." },
      { status: 500 }
    );
  }
}