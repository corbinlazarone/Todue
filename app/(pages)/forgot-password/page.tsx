import ForgotPasswordComp from "@/components/auth/forgot-password";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Todue | Forgot Password",
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordComp />;
}