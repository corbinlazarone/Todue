"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  callbackUrl: string;
}

interface AuthResponse {
  type?: "info" | "success" | "warning" | "error";
  message: string;
}

export const signUpAction = async (
  formData: FormData
): Promise<AuthResponse> => {
  const email = formData.email;
  const password = formData.password;
  const confirmPassword = formData.confirmPassword;
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return {
      type: "warning",
      message: "Email and password are required.",
    };
  }

  // password validation checks
  const hasMinLength = password.length >= 8;
  const hasCapital = /[A-Z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const validationErrors = [];

  if (!hasMinLength) {
    validationErrors.push("Must be at least 8 characters long");
  }
  if (!hasCapital) {
    validationErrors.push("Must include a capital letter");
  }
  if (!hasSpecialChar) {
    validationErrors.push("Must include a special character");
  }

  if (validationErrors.length > 0) {
    return {
      type: "warning",
      message:
        "Password requirements:\n" +
        validationErrors.map((error) => `• ${error}`).join("\n"),
    };
  }

  // check if password equals confirm password
  if (password != confirmPassword) {
    return {
      type: "warning",
      message: "Passwords Must Match.",
    };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return {
      type: "error",
      message: "Unexpected error creating your account. Please Try Again."
    };
  } else {
    return {
      type: "success",
      message: "Thanks for signing up! Please check your email for a verification link."
    }
  }
};

export const signInAction = async (
  formData: FormData
): Promise<AuthResponse> => {
  const email = formData.email;
  const password = formData.password;
  const supabase = await createClient();

  if (!email || !password) {
    return {
      type: "info",
      message: "Email and password are required",
    };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return {
      type: "error",
      message: "Invalid Credentials. Please Try again",
    };
  }

  return {
    type: "success",
    message: "Thanks for Signing In!",
  };
};

export const signInWithGoogle = async () => {
  const supabase = await createClient();
  const headersList = await headers();
  const origin = headersList.get("origin") || process.env.NEXT_PUBLIC_BASE_URL;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback?next=/`,
      scopes:
        "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events",
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    console.error("OAuth error:", error.message);
    return redirect("/sign-in?error=OAuth+failed");
  }

  if (data.url) {
    return redirect(data.url);
  }

  return redirect("/sign-in?error=No+URL+returned");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.email;
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.callbackUrl;

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password"
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password."
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.password;
  const confirmPassword = formData.confirmPassword;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required"
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match"
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed"
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};
