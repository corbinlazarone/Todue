import {
  checkAuthenticatedUser,
  checkUserSubscription,
  extractTextFromDOCX,
  extractTextFromPDF,
} from "@/app/helpers";
import { NextRequest, NextResponse } from "next/server";
import { Anthropic } from "@anthropic-ai/sdk";
import { SupabaseClient, User } from "@supabase/supabase-js";

interface FileData {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
}

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

interface CourseData {
  course_id: number;
  course_name: string;
  assignments: Assignment[];
}

const COLORS = [
  "#7986cb",
  "#33b679",
  "#8e24aa",
  "#e67c73",
  "#f6c026",
  "#f5511d",
  "#039be5",
  "#616161",
  "#3f51b5",
  "#0b8043",
  "#d60000",
];

type AllowedMimeTypes =
  | "application/pdf"
  | "application/msword"
  | "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

const processDocumentWithClaude = async (text: string): Promise<CourseData> => {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || "",
  });

  try {
    const message = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1024,
      system: `You are a precise course information extraction assistant. Extract only explicitly stated information from the syllabus. Follow these rules:
        1. Only extract assignments, exams, and deadlines that have specific dates
        2. Ensure dates are in YYYY-MM-DD format
        3. Convert all times to 24-hour format (HH:mm)
        4. If no specific time is mentioned, use "23:59" as the default
        5. If no specific end time is mentioned, make it the same as start time
        6. Assign appropriate colors from this list: ${COLORS.join(", ")}
        7. Set default reminder to 1440 (1 day) if not specified
        8. Ensure each assignment has a unique ID
        Do not infer or generate any data not directly present in the source text.`,
      messages: [
        {
          role: "user",
          content: `Extract course information and assignments from this syllabus in this exact format:
          {
            "course_name": "Course Name",
            "assignments": [
              {
                "id": number,
                "name": "Assignment Name",
                "description": "Description",
                "due_date": "YYYY-MM-DD",
                "color": "hex color from the provided list",
                "start_time": "HH:mm",
                "end_time": "HH:mm",
                "reminder": number (minutes)
              }
            ]
          }
          
          Syllabus text:
          ${text}`,
        },
      ],
    });

    const responseContent = message.content[0];
    if (responseContent.type !== "text") {
      throw new Error("Unexpected response type from Claude");
    }

    const responseText = responseContent.text;

    try {
      const jsonMatch = responseText.match(/{[\s\S]*}/);
      if (!jsonMatch) {
        throw new Error("No valid JSON found in response");
      }

      const parsedData = JSON.parse(jsonMatch[0]);

      if (!parsedData.course_name || !Array.isArray(parsedData.assignments)) {
        throw new Error("Invalid response structure");
      }

      parsedData.assignments = parsedData.assignments.map(
        (assignment: any) => ({
          ...assignment,
          reminder: assignment.reminder || 1440,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          start_time: assignment.start_time || "23:59",
          end_time: assignment.end_time || assignment.start_time || "23:59",
        })
      );

      return parsedData as CourseData;
    } catch (error) {
      console.error("Error parsing AI response:", error);
      throw new Error("Failed to parse course information");
    }
  } catch (error) {
    console.error("Error calling AI API:", error);
    throw new Error("Failed to process document with AI");
  }
};

const saveCourseDataToSupabase = async (
  courseData: CourseData,
  signedInUser: User,
  supabase: SupabaseClient
): Promise<CourseData> => {
  try {
    const userEmail = signedInUser.email;
    const userId = signedInUser.id;

    const { course_name, assignments } = courseData;

    // Save course data to Supabase DB
    const { data: course, error: courseError } = await supabase
      .from("courses")
      .insert([
        {
          user_id: userId,
          user_email: userEmail,
          course_name: course_name,
          created_at: new Date().toISOString(),
        }
      ])
      .select("id, course_name")
      .single();
    
    if (courseError) {
      console.error("Error inserting course data:", courseError);
      throw new Error("Failed to save course data");
    }

    if (!course) {
      throw new Error("Course was not created");
    }

    // Save Assignment data to Supabase DB with course id
    const { data: savedAssignments, error: assignmentError } = await supabase
      .from("assignments")
      .insert(
        assignments.map((assignment) => ({
          id: Math.floor(Math.random() * 1000000) + 1,
          course_id: course.id,
          name: assignment.name,
          description: assignment.description,
          due_date: assignment.due_date,
          color: assignment.color,
          start_time: assignment.start_time,
          end_time: assignment.end_time,
          reminder: assignment.reminder,
          created_at: new Date().toISOString(),
        }))
      )
      .select('id, name, description, due_date, color, start_time, end_time, reminder');

    if (assignmentError) {
      console.error("Error inserting assignment data:", assignmentError);
      throw new Error("Failed to save assignment data");
    }

    // Transform the saved data back into the expected CourseData format
    return {
      course_id: course.id,
      course_name: course.course_name,
      assignments: savedAssignments as Assignment[] || []
    };
  } catch (error: any) {
    console.error("Error in saveCourseDataToSupabase:", error);
    throw error;
  }
};

export async function POST(request: NextRequest) {
  try {

    /**
     * Chceking if user is authenticated
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

    // Handle multipart form data
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "Missing or invalid file" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileData: FileData = {
      buffer,
      originalname: file.name,
      mimetype: file.type,
    };

    const allowedTypes: AllowedMimeTypes[] = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(fileData.mimetype as AllowedMimeTypes)) {
      return NextResponse.json(
        {
          error: "Invalid file type. Only PDF and Word documents are allowed.",
        },
        { status: 400 }
      );
    }

    let extractedText: string;
    if (fileData.mimetype === "application/pdf") {
      extractedText = await extractTextFromPDF(fileData.buffer);
    } else {
      extractedText = await extractTextFromDOCX(fileData.buffer);
    }

    if (!extractedText.trim()) {
      return NextResponse.json(
        { error: "No text could be extracted from the document" },
        { status: 400 }
      );
    }

    const courseData = await processDocumentWithClaude(extractedText);

    /**
     * Insert Course Data to Supabase DB
     */
    const { supabaseClient } = userAuthenticated;

    if (!supabaseClient) {
      return NextResponse.json(
        { error: "Supabase not intialized" },
        { status: 500 }
      );
    }

   const savedCourseData =  await saveCourseDataToSupabase(
      courseData,
      userAuthenticated.success as User,
      supabaseClient
    );

    return NextResponse.json({
      message: "Syllabus processed successfully",
      data: savedCourseData,
    });
  } catch (error: any) {
    console.error("Error processing document:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Try again later." },
      { status: 500 }
    );
  }
}
