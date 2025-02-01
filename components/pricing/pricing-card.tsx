"use client";
import { User } from "@supabase/supabase-js";
import { Check } from "lucide-react";

interface PricingPlans {
  user: User | null;
}

export default function PricingCard({ user }: PricingPlans) {
  const features = [
    {
      name: "Unlimited syllabus uploads",
    },
    {
      name: "Historic syllabus data",
    },
    {
      name: "Priority processing",
    },
    {
      name: "Google Calendar sync",
    },
    {
      name: "Custom reminders",
    },
  ];

  const plans = [
    {
      link:
        process.env.NODE_ENV === "development"
          ? "https://buy.stripe.com/test_dR68ypfpY9uW7vy3ce"
          : "",
      priceId:
        process.env.NODE_ENV === "development"
          ? "price_1QnPgBRw0FZbBFTdIwCDYEeN"
          : "",
      price: 7.99,
      duration: "/month",
      name: "Pay Monthly",
    },
    {
      link:
        process.env.NODE_ENV === "development"
          ? "https://buy.stripe.com/test_dR67ul91AfTkcPS147"
          : "",
      priceId:
        process.env.NODE_ENV === "development"
          ? "price_1QnPiqRw0FZbBFTdiRLeja6F"
          : "",
      price: 95,
      duration: "/year",
      name: "Pay Yearly",
    },
  ];

  return (
    <div className="max-w-full">
      <div className="grid md:grid-cols-2 gap-10">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className="rounded-2xl p-6 border-2 border-indigo-500 bg-white shadow-lg hover:shadow-xl transition duration-300"
          >
            <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
            <div className="flex items-baseline gap-1 mb-4">
              <span className={`text-3xl font-bold text-gray-900`}>
                ${plan.price}
              </span>
              <span
                className={`text-sm text-gray-500`}
              >
                {plan.duration}
              </span>
            </div>

            <div className="space-y-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-gray-600" />
                  <span className="text-gray-600">{feature.name}</span>
                </div>
              ))}
            </div>
            <div className="pt-10 space-y-2">
              <a
                className="w-full py-3 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-center rounded-md shadow-md hover:from-indigo-600 hover:to-purple-700 transition ease-in-out duration-300"
                target="_blank"
                href={plan.link + "?prefilled_email=" + user?.email}
              >
                Subscribe Now
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}