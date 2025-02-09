import SignInComp from "@/components/auth/sign-in";
import LoadingPage from "@/components/ui/loading-page";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Todue | Sign In",
  description: "Sign In page for Todue"
}

export default function SignInPage() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <SignInComp />
    </Suspense>
  )
}