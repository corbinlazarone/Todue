import ResetPasswordComp from "@/components/auth/reset-password";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Todue | Forgot Password",
}

export default function ResetPasswordPage() {
  return <ResetPasswordComp />;
}