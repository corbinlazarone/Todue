import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

import EmailTemplate from "@/components/ui/email-template";
import { rateLimit } from "@/utils/rate-limiter";

interface FormData {
  fullName: string;
  email: string;
  message: string;
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {

  // Check rate limit
  const rateLimitResult = rateLimit(request);
  if (rateLimitResult) return rateLimitResult;

  const body = await request.json();

  const formData: FormData = body;

  if (!formData) {
    return NextResponse.json(
      { error: "Form data is required" },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "Contact Form <team@trytodue.com>",
      to: ["trytodue@gmail.com"],
      subject: "Contact Form Submission",
      react: EmailTemplate({ ...formData }) as React.ReactElement,
    });

    if (error) {
      console.error("Error sending email with Resend: ", error);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Email sent successfully",
      emailData: data,
    });
  } catch (error: any) {
    console.error("Error in POST /send: ", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}