import { checkAuthenticatedUser, checkUserSubscription } from "@/app/helpers";
import { NextRequest, NextResponse } from "next/server";

interface FileData {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
}

interface RequestBody {
  file: FileData;
}

type AllowedMimeTypes =
  | "application/pdf"
  | "application/msword"
  | "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export async function POST(request: NextRequest) {
  /**
   * Checking if user is signed in
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
   * File Validation
   */
  const body = (await request.json()) as RequestBody;
  const file = body.file;

  if (!file) {
    return NextResponse.json(
      { error: "Missing Syllabus File" },
      { status: 400 }
    );
  }

  const allowedTypes: AllowedMimeTypes[] = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (!allowedTypes.includes(file.mimetype as AllowedMimeTypes)) {
    return NextResponse.json(
      { error: "Invalid file type. Only PDF and Word documents are allowed." },
      { status: 400 }
    );
  }

  /**
   * Extraction Logic Here
   */
  const fileBuffer = file.buffer;
  const fileName = file.originalname;

  console.log(fileBuffer);
  console.log(fileName);

  return NextResponse.json({ success: "Syllabus Extracted" });
}
