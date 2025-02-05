"use client";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import Image from "next/image";
import FormInput from "@/components/ui/input";
import { signUpAction } from "@/app/actions";
import PopupAlert from "@/components/ui/popup-alert";
import { redirect } from "next/navigation";

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

export default function SignUp() {
  const [alert, setAlert] = useState<Alert | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
    callbackUrl: "",
  });

  const handleSubmit = async (event: any) => {
    event.preventDefault();

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
        message: "Unexpected error occuried. Please Try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md z-50 border-b border-gray-100"
      >
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Todue logo" width={24} height={24} />
            <span className="font-bold text-lg bg-clip-text text-indigo-600">
              Todue
            </span>
          </div>
        </div>
      </motion.header>

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
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors mb-8"
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
              <h2 className="text-3xl font-bold text-gray-900">
              Create an Account
              </h2>
              <p className="mt-2 text-gray-600">
                Make a Todue account
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

              <FormInput
                id="password"
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
                    redirect("/sign-in");
                  }}
                >
                  Sign In now
                </button>
              </p>
            </div>

            {/* OAuth Buttons */}
            <div className="space-y-4">
              <button className="w-full flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 transition-colors">
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