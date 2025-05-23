"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { signInWithGoogle, signUpAction } from "@/app/actions";
import { useRouter } from "next/navigation";
import { signUpCredentials } from "@/utils/types";
import { FormInput } from "../ui/input";
import { PopupAlert } from "../ui/popup-alert";
import { AuthHeader } from "../ui/auth-pages-header";

interface Alert {
  type?: "info" | "success" | "warning" | "error";
  message: string;
}

export function SignUpComp() {
  const router = useRouter();
  const [alert, setAlert] = useState<Alert | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<signUpCredentials>({
    email: "",
    password: "",
    confirmPassword: "",
    acceptedTerms: false,
  });

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
      console.log("Unexpected Error: ", error);
    }
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    if (!formData.acceptedTerms) {
      setAlert({
        type: "error",
        message:
          "Please accept the Terms of Service and Privacy Policy to continue.",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await signUpAction(formData);

      setAlert({
        type: response.type,
        message: response.message,
      });
    } catch (error: any) {
      console.error("Unexpected Sign up Error: ", error);
      setAlert({
        type: "error",
        message: "Unexpected error occurred. Please Try again.",
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
            onClose={() => setAlert(null)}
            duration={5000}
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="min-h-screen pt-16 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md my-8">
          {/* Sign Up Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-100 space-y-6 sm:space-y-8"
          >
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Create an Account
              </h2>
              <p className="mt-2 text-sm sm:text-base text-gray-600">
                Make a Todue account
              </p>
            </div>

            <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
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

              <FormInput
                id="confirmPassword"
                required={true}
                labelText="Confirm"
                placeHolderText="Confirm your password"
                type="password"
                name="confirmPassword"
                onChange={(event) => {
                  setFormData({
                    ...formData,
                    confirmPassword: event.target.value,
                  });
                }}
              />

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    checked={formData.acceptedTerms}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        acceptedTerms: e.target.checked,
                      })
                    }
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3">
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    I accept the{" "}
                    <button
                      type="button"
                      onClick={() => router.push("/tos")}
                      className="text-indigo-600 hover:text-indigo-500 font-medium"
                    >
                      Terms of Service
                    </button>{" "}
                    and{" "}
                    <button
                      type="button"
                      onClick={() => router.push("/privacy")}
                      className="text-indigo-600 hover:text-indigo-500 font-medium"
                    >
                      Privacy Policy
                    </button>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  className="text-indigo-600 hover:text-indigo-500 font-medium"
                  onClick={() => {
                    router.push("/sign-in");
                  }}
                >
                  Sign In now
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