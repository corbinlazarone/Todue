"use client";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import Image from "next/image";
import FormInput from "@/components/ui/input";
import { signInAction, signInWithGoogle } from "@/app/actions";
import PopupAlert from "@/components/ui/popup-alert";
import { useRouter, useSearchParams } from "next/navigation";
import AuthHeader from "../ui/auth-pages-header";

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  callbackUrl: string;
}

interface Alert {
  type?: "info" | "success" | "warning" | "error";
  message: string;
}

export default function SignInComp() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [alert, setAlert] = useState<Alert | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
    callbackUrl: "",
  });

  // check for reauth parameter.
  useEffect(() => {
    const needsReauth = searchParams.get("reauth");
    if (needsReauth === "true") {
      setAlert({
        type: "info",
        message: "Please sign in again with Google to continue",
      });
    };
  }, [searchParams]);

  const handleGoogleOAuth = async () => {
    try {
      const response = await signInWithGoogle();

      setAlert({
        type: response.type,
        message: response.message,
      });

      if (response.type === "error") {
        router.push("/sign-in");
      }
    } catch (error: any) {
      console.log("Unexpected error: ", error);
    }
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    try {
      setLoading(true);
      const response = await signInAction(formData);

      setAlert({
        type: response.type,
        message: response.message,
      });

      if (response.type === "success") {
        // navigate to dashboard page.
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.log("Unexpected Sign in Error: ", error);
      setAlert({
        type: "error",
        message: "Unexpected error occuried. Please Try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthHeader />
      <AnimatePresence>
        {alert && (
          <PopupAlert
            message={alert.message}
            type={alert.type}
            duration={5000}
            onClose={() => setAlert(null)}
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors mb-8"
            onClick={() => {
              router.push("/");
            }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </motion.button>

          {/* Sign In Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 space-y-8"
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
              <p className="mt-2 text-gray-600">
                Sign in to your Todue account
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <FormInput
                id="email"
                required={true}
                labelText="Email"
                placeHolderText="Enter your email"
                type="email"
                name="email"
                onChange={(event) => {
                  setFormData({ ...formData, email: event.target.value });
                }}
              />

              <FormInput
                id="password"
                required={true}
                labelText="Password"
                placeHolderText="Enter your password"
                type="password"
                name="password"
                onChange={(event) => {
                  setFormData({ ...formData, password: event.target.value });
                }}
              />

              <div className="flex justify-center">
                <button
                  type="button"
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                  onClick={() => {
                    router.push("/forgot-password");
                  }}
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <button
                  className="text-indigo-600 hover:text-indigo-500 font-medium"
                  onClick={() => {
                    router.push("/sign-up");
                  }}
                >
                  Sign up now
                </button>
              </p>
            </div>

            {/* OAuth Buttons */}
            <div className="space-y-4">
              <button
                className="w-full flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 transition-colors"
                onClick={handleGoogleOAuth}
              >
                <Image
                  src="/google_icon.svg"
                  alt="Google"
                  width={20}
                  height={20}
                  className="mr-2"
                />
                <span className="text-gray-700">Continue with Google</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}