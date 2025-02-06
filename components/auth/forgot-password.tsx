"use client";

import PopupAlert from "@/components/ui/popup-alert";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import FormInput from "@/components/ui/input";
import { forgotPasswordAction } from "@/app/actions";
import AuthHeader from "../ui/auth-pages-header";
import { useRouter } from "next/navigation";

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

export default function ForgotPasswordComp() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<Alert | null>(null);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
    callbackUrl: ""
  })

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    try {
      setLoading(true);
      const response = await forgotPasswordAction(formData);

      setAlert({
        type: response.type,
        message: response.message
      });

    } catch (error: any) {
      console.log("Unexpected Forgot Password Error: ", error);
      setAlert({
        type: "error",
        message: "Unexpected error occuried. Please Try again."
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthHeader />;
      <AnimatePresence>
        {alert && (
          <PopupAlert
            message={alert.message}
            type={alert.type}
            duration={10000}
            onClose={() => setAlert(null)}
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md" >
           {/* Back Button */}
           <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors mb-8"
            onClick={() => { router.push("/") }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </motion.button>

          {/* Forgot password form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 space-y-8"
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">Forgot Password</h2>
              <p className="mt-2 text-gray-600">
                Enter the email associated with your Todue account
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

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending Email...
                  </>
                ) : (
                  "Submit"
                )}
              </button>
            </form>

          </motion.div>
        </div>
      </div>
    </div>
  );
}