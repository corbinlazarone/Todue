import SignInComp from "@/components/auth/sign-in";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Todue | Sign In",
  description: "Sign In page for Todue"
}

export default function SignInPage() {
  return <SignInComp />
}