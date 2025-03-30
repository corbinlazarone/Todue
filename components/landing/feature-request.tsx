"use client";

import { Alert, AlertType } from "@/utils/types";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface FeatureRequestProps {
  onAlert: (alertObj: Alert) => void;
}

export default function FeatureRequest({ onAlert }: FeatureRequestProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    message: "",
  });
  const [charCount, setCharCount] = useState<number>(0);
  const CHAR_LIMIT = 1000;

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    
    if (name === 'message') {
      if (value.length > CHAR_LIMIT) {
        return;
      }
      setCharCount(value.length);
    }

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.error) {
        onAlert({
          type: AlertType.ERROR,
          message: data.error,
        })
      }

      onAlert({
        type: AlertType.SUCCESS,
        message: data.message,
      });
    } catch (error: any) {
      setIsLoading(false);
      console.error("Unexpected Error: ", error);
      onAlert({
        type: AlertType.ERROR,
        message: "An unexpected error occurred. Please try again later.",
      });
    } finally {
      setIsLoading(false);
      setFormData({
        fullName: "",
        email: "",
        message: "",
      });
      setCharCount(0);
    }
  };

  return (
    <section className="py-20 bg-gray-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Contact Us / Submit a Feature Request
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have a question or a feature request? We're happy to hear from you!
            Fill out the form below and we'll get back to you as soon as
            possible.
          </p>
        </motion.div>

        {/* Contact Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-2xl p-8 shadow-xl max-w-4xl mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col">
              <label
                htmlFor="name"
                className="text-sm font-medium text-gray-700 mb-2"
              >
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                placeholder="John doe"
                onChange={handleInputChange}
                className="border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                placeholder="example@gmail.com"
                onChange={handleInputChange}
                className="border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div className="flex flex-col mt-6">
            <div className="flex justify-between items-center mb-2">
              <label
                htmlFor="message"
                className="text-sm font-medium text-gray-700"
              >
                Message / Feature Request
              </label>
              <span className={`text-sm ${charCount > CHAR_LIMIT ? 'text-red-500' : 'text-gray-500'}`}>
                {charCount}/{CHAR_LIMIT} characters
              </span>
            </div>
            <textarea
              id="message"
              name="message"
              placeholder="I love this tool :)"
              value={formData.message}
              onChange={handleInputChange}
              rows={6}
              maxLength={CHAR_LIMIT}
              className="border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              required
            />
          </div>

          <div className="flex justify-center mt-6">
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isLoading || charCount > CHAR_LIMIT}
              className={`${
                isLoading || charCount > CHAR_LIMIT
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#6366F1] hover:bg-[#4F46E5]'
              } text-white px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 hover:shadow-lg`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  <span>Sending...</span>
                </div>
              ) : (
                "Send Message"
              )}
            </button>
          </div>
        </motion.form>
      </div>
    </section>
  );
}