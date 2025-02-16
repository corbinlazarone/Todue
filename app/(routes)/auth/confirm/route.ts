import { type EmailOtpType } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") || "/";
  
  if (!token_hash || !type) {
    console.error("Missing token_hash or type. Redirecting to error page.");
    return NextResponse.redirect(new URL("/error", request.url));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({ type, token_hash });

  if (error) {
    console.error("OTP verification error:", error.message);
    return NextResponse.redirect(new URL("/error", request.url));
  }

  // Redirect to the specified next URL after successful verification
  return NextResponse.redirect(new URL(next, request.url));
}
