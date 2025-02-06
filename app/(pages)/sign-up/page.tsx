import SignUpComp from "@/components/auth/sign-up";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Todue | Sign Up",
  description: "Sign up page for Todue"
}

export default function SignUpPage() {
  return <SignUpComp />
}