import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/";

  if (!code) {
    return NextResponse.redirect(
      new URL("/sign-in?error=No+code+provided", requestUrl)
    );
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Auth error:", error.message);
      return NextResponse.redirect(
        new URL(
          "/sign-in?error=" + encodeURIComponent(error.message),
          requestUrl
        )
      );
    }

    // Determine the base URL for the redirect
    const forwardedHost = request.headers.get("x-forwarded-host");
    const origin = forwardedHost
      ? `http://${forwardedHost}`
      : process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : requestUrl.origin;

    // Construct the final redirect URL
    const redirectUrl = new URL(next, origin);
    return NextResponse.redirect(redirectUrl);
  } catch (err) {
    console.error("Callback error:", err);
    return NextResponse.redirect(
      new URL("/sign-in?error=Session+exchange+failed", requestUrl)
    );
  }
}
