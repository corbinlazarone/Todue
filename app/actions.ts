"use server";

import { createClient } from "@/utils/supabase/server";
import {
  Alert,
  AlertType,
  forgotPasswordCredentials,
  resetPasswordCredentials,
  signInCredentials,
  signUpCredentials,
} from "@/utils/types";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const signUpAction = async (
  creds: signUpCredentials
): Promise<Alert> => {
  const email = creds.email;
  const password = creds.password;
  const confirmPassword = creds.confirmPassword;
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return {
      type: AlertType.WARNING,
      message: "Email and password are required.",
    };
  }

  if (!confirmPassword) {
    return {
      type: AlertType.WARNING,
      message: "Confirm password is required.",
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
      type: AlertType.WARNING,
      message:
        "Password requirements:\n" +
        validationErrors.map((error) => `• ${error}`).join("\n"),
    };
  }

  // check if password equals confirm password
  if (password != confirmPassword) {
    return {
      type: AlertType.WARNING,
      message: "Passwords do not match",
    };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return {
      type: AlertType.ERROR,
      message: "Unexpected error creating your account. Please Try Again.",
    };
  } else if (data.user?.identities?.length === 0) {
    return {
      type: AlertType.WARNING,
      message: "Email is already in use. Please sign in instead.",
    };
  } else {
    return {
      type: AlertType.SUCCESS,
      message:
        "Thanks for signing up! Please check your email for a verification link.",
    };
  }
};

export const signInAction = async (
  creds: signInCredentials
): Promise<Alert> => {
  const email = creds.email;
  const password = creds.password;
  const supabase = await createClient();

  if (!email || !password) {
    return {
      type: AlertType.WARNING,
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
      type: AlertType.ERROR,
      message: "Invalid Credentials. Please Try again",
    };
  }

  return {
    type: AlertType.SUCCESS,
    message: "Thanks for Signing In!",
  };
};

export const signInWithGoogle = async (): Promise<Alert> => {
  const supabase = await createClient();
  const headersList = await headers();
  const origin = headersList.get("origin") || process.env.NEXT_PUBLIC_BASE_URL;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback?next=/dashboard`,
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

    return {
      type: AlertType.ERROR,
      message: "There was problem loggin in with Google. Please Try again.",
    };
  }

  if (data.url) {
    return redirect(data.url);
  }

  return {
    type: AlertType.ERROR,
    message: "No Url was returned from Google. Please Try again.",
  };
};

export const forgotPasswordAction = async (
  creds: forgotPasswordCredentials
): Promise<Alert> => {
  const email = creds.email;
  const supabase = await createClient();

  if (!email) {
    return {
      type: AlertType.WARNING,
      message: "Email is required",
    };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) {
    console.error(error.message);
    return {
      type: AlertType.ERROR,
      message: "Could not reset password. Please Contact us.",
    };
  }

  return {
    type: AlertType.SUCCESS,
    message: "Check your email for a link to reset your password.",
  };
};

export const resetPasswordAction = async (
  creds: resetPasswordCredentials
): Promise<Alert> => {
  const supabase = await createClient();
  const password = creds.password;
  const confirmPassword = creds.confirmPassword;

  if (!password || !confirmPassword) {
    return {
      type: AlertType.WARNING,
      message: "Password and confirm password are required",
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
      type: AlertType.WARNING,
      message:
        "Password requirements:\n" +
        validationErrors.map((error) => `• ${error}`).join("\n"),
    };
  }

  if (password !== confirmPassword) {
    return {
      type: AlertType.WARNING,
      message: "Passwords do not match",
    };
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error?.code === "same_password") {
    console.error(error.code + " " + error.message);
    return {
      type: AlertType.WARNING,
      message: error.message,
    };
  } else if (error) {
    console.error(error.code + " " + error.message);
    return {
      type: AlertType.ERROR,
      message:
        "Unexpected error updating your password. Please Try Again or Contact us.",
    };
  }

  return {
    type: AlertType.SUCCESS,
    message: "Password updated!",
  };
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/");
};