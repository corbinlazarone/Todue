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
    <div className="w-full max-w-7xl mx-auto px-4">
      <div className="grid md:grid-cols-2 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className="rounded-3xl p-8 border-2 border-indigo-500 bg-white shadow-lg hover:shadow-xl transition duration-300 relative overflow-hidden w-full"
          >
            {/* Background gradient effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 opacity-50" />
            
            {/* Content */}
            <div className="relative">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-5xl font-bold text-indigo-600">
                  ${plan.price}
                </span>
                <span className="text-lg text-gray-600">
                  {plan.duration}
                </span>
              </div>

              <div className="space-y-4 mb-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center">
                      <Check className="h-3 w-3 text-indigo-600" />
                    </div>
                    <span className="text-gray-700">{feature.name}</span>
                  </div>
                ))}
              </div>

              <div className="pt-6">
                <a
                  className="block w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center text-lg font-semibold rounded-xl shadow-md hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5"
                  target="_blank"
                  href={plan.link + "?prefilled_email=" + user?.email}
                >
                  Subscribe Now
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}