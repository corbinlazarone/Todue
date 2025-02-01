"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAnswer = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "How do I submit a feature request?",
      answer: "You can submit a feature request using the form on the 'Contact Us' page.",
    },
    {
      question: "How can I contact customer support?",
      answer: "You can reach customer support through the contact form or by emailing support@example.com.",
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we take security seriously. All data is encrypted and protected with the latest technology.",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>
        </motion.div>
      </div>
    </section>
  );
}