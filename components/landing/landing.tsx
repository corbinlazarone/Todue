"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import {
  Check,
  Edit,
  HistoryIcon,
  Instagram,
  Linkedin,
  Menu,
  Sparkles,
  Sun,
  Upload,
  X,
} from "lucide-react";
import { AnimatedBeamDemo } from "./animated-beam-landing";
import { PulsatingButton } from "../ui/pulsating-button";
import FeatureRequest from "./feature-request";
import FAQ from "./faq-section";
import PricingCard from "../pricing/pricing-card";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { HeroVideoDialog } from "../ui/demo-video";
import UniversityMarquee from "../ui/university-manquee";
import { useRouter } from "next/navigation";
import PopupAlert from "../ui/popup-alert";

const keyFeatures = [
  {
    icon: <Sparkles className="h-6 w-6 text-white" />,
    title: "Smart Extraction",
    description:
      "Advanced AI automatically detects and extracts important dates and assignments",
  },
  {
    icon: <Edit className="h-6 w-6 text-white" />,
    title: "Event Customazation",
    description: "Add customaziable calendar events",
  },
  {
    icon: <HistoryIcon className="h-6 w-6 text-white" />,
    title: "Upload History",
    description: "See syllabus history and assignment event history",
  },
];

const howItWorks = [
  {
    icon: <Upload className="h-6 w-6 text-white" />,
    title: "Upload Syllabus",
    description: "Easily upload one or multiple syllabi.",
  },
  {
    icon: <Edit className="h-6 w-6 text-white" />,
    title: "Edit or Add Assignments",
    description:
      "Edit assignments our AI has detected or manually add new ones.",
  },
  {
    icon: <Check className="h-6 w-6 text-white" />,
    title: "Submit to Google Calendar",
    description:
      "Submit your assignments to Google Calendar to save time and stay organized.",
  },
];

const fadeInFromBottom = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// navigation item animation variants
const itemVariants = {
  closed: { opacity: 0, x: -10 },
  open: { opacity: 1, x: 0 },
};

// mobile menu animation variants
const menuVariants = {
  closed: {
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
  open: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

interface Alert {
  type?: "info" | "success" | "warning" | "error";
  message: string;
}

interface LandingCompProps {
  user: User | null;
  signOut: () => void;
}

export default function LandingComp({ user, signOut }: LandingCompProps) {
  const router = useRouter();
  const [alert, setAlert] = useState<Alert | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const handleAuth = async () => {
    if (user) {
      signOut();
    } else {
      router.push("/sign-in");
    }
  };

  const onAlert = (alertObj: Alert) => {
    setAlert(alertObj);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <motion.header
        initial="hidden"
        animate="visible"
        className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md z-50 border-b border-gray-100"
      >
        {alert && (
          <PopupAlert
            message={alert.message}
            type={alert.type}
            duration={5000}
            onClose={() => setAlert(null)}
          />
        )}
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          {/* Branding Section */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => router.push("/")}
          >
            <Image src={"/logo.png"} alt="Todue logo" width={24} height={24} />
            <span className="font-bold text-lg bg-clip-text text-indigo-600">
              Todue
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center justify-center gap-8">
            <div className="flex items-center gap-6">
              <button
                onClick={() => router.push("/dashboard")}
                className="text-gray-600 hover:text-indigo-600 transition-colors text-sm font-medium cursor-pointer"
              >
                Dashboard
              </button>
              <button
                onClick={() => scrollToSection("pricing")}
                className="text-gray-600 hover:text-indigo-600 transition-colors text-sm font-medium cursor-pointer"
              >
                Pricing
              </button>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="text-gray-600 hover:text-indigo-600 transition-colors text-sm font-medium cursor-pointer"
              >
                How it Works
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-gray-600 hover:text-indigo-600 transition-colors text-sm font-medium cursor-pointer"
              >
                Contact
              </button>
              {/* <button>
                <Sun size={20} />
              </button> */}
            </div>
            <button
              className="bg-[#6366F1] text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-[#4F46ES] transition-all duration-300 hover:shadow-lg"
              onClick={handleAuth}
            >
              {user ? "Sign Out" : "Sign In"}
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-5 h-5 text-gray-600" />
            ) : (
              <Menu className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
              className="md:hidden border-t border-gray-100 bg-white overflow-hidden"
            >
              <motion.div
                className="max-w-[1200px] mx-auto px-6 py-4 flex flex-col gap-4"
                variants={{
                  open: {
                    transition: {
                      staggerChildren: 0.1,
                    },
                  },
                }}
              >
                <motion.button
                  onClick={() => {
                    router.push("/dashboard");
                    setIsMenuOpen(false);
                  }}
                  className="text-left text-gray-600 hover:text-indigo-600 transition-colors py-2 text-sm font-medium"
                  variants={itemVariants}
                >
                  Dashboard
                </motion.button>
                <motion.button
                  onClick={() => {
                    scrollToSection("pricing");
                    setIsMenuOpen(false);
                  }}
                  className="text-left text-gray-600 hover:text-indigo-600 transition-colors py-2 text-sm font-medium"
                  variants={itemVariants}
                >
                  Pricing
                </motion.button>
                <motion.button
                  onClick={() => {
                    scrollToSection("how-it-works");
                    setIsMenuOpen(false);
                  }}
                  className="text-left text-gray-600 hover:text-indigo-600 transition-colors py-2 text-sm font-medium"
                  variants={itemVariants}
                >
                  How it Works
                </motion.button>
                <motion.button
                  onClick={() => {
                    scrollToSection("contact");
                    setIsMenuOpen(false);
                  }}
                  className="text-left text-gray-600 hover:text-indigo-600 transition-colors py-2 text-sm font-medium"
                  variants={itemVariants}
                >
                  Contact
                </motion.button>
                {user && (
                  <motion.button
                    className="text-left text-gray-600 hover:text-indigo-600 transition-colors py-2 text-sm font-medium"
                    variants={itemVariants}
                  >
                    Channels
                  </motion.button>
                )}
                <motion.button
                  className="bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 transition-all duration-300 w-full"
                  onClick={handleAuth}
                  variants={itemVariants}
                >
                  {user ? "Sign Out" : "Sign In"}
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16 sm:mt-20">
        {/* Hero Section */}
        <section className="py-20 px-4 md:px-6">
          <div className="max-w-6xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 px-4 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600"
            >
              Effortlessly Manage Your Semester <br />
              No More Missed Deadlines
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl max-w-3xl mx-auto px-4 text-gray-700 mb-12"
            >
              Todue automatically extracts assignments and exams from your
              syllabus, so you can focus on what matters most.
            </motion.p>
            <div className="flex justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <PulsatingButton
                  onClick={() => {
                    if (user) {
                      router.push("/dashboard");
                    } else {
                      router.push("/sign-in");
                    }
                  }}
                >
                  Start Now
                </PulsatingButton>
              </motion.div>
            </div>
          </div>
        </section>

        {/* New Demo Video Section */}
        <HeroVideoDialog
          className="block dark:hidden"
          animationStyle="top-in-bottom-out"
          videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
          thumbnailSrc="/todue-screenshot.png"
          thumbnailAlt="Hero Video"
        />

        {/* University Marquee */}
        <section className="py-20 relative overflow-hidden">
          <UniversityMarquee />
        </section>

        {/* Key Features Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className={`text-4xl font-bold text-center mb-16 text-gray-900`}
            >
              Key Features
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {keyFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className={`group relative bg-white/80 backdrop-blur-lg rounded-2xl p-6 hover:shadow-xl transition-all duration-300`}
                >
                  <div className="relative z-10">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mb-6">
                      {feature.icon}
                    </div>
                    <h3 className=" text-xl font-semibold mb-4 text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-gray-700">{feature.description}</p>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Integrations Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Seamless Integration
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Connect Todue with your favorite calendar app for automatic
                event synchronization
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="relative mx-auto bg-gradient-to-b from-white to-gray-50 rounded-2xl p-12 shadow-xl flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl" />

              {/* Center container for AnimatedBeamDemo */}
              <div className="relative w-full flex justify-center items-center">
                <AnimatedBeamDemo />
              </div>
            </motion.div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-20 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className={`text-4xl font-bold text-center mb-16 text-gray-900`}
            >
              How it Works
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {howItWorks.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className={`group relative bg-white/80 backdrop-blur-lg rounded-2xl p-6 hover:shadow-xl transition-all duration-300`}
                >
                  <div className="relative z-10">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mb-6">
                      {feature.icon}
                    </div>
                    <h3 className=" text-xl font-semibold mb-4 text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-gray-700">{feature.description}</p>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Request / Contact */}
        <section id="contact" className="py-20">
          <FeatureRequest onAlert={onAlert} />
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-20 relative overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Transparent Pricing
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A plan for every situation, no matter the need.
            </p>
          </motion.div>

          {/* Centered Pricing Cards */}
          <div className="max-w-full mx-auto px-4 md:px-8">
            <div className="grid place-items-center">
              <PricingCard user={user} />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-gray-50">
          <FAQ />
        </section>

        {/* CTA Section */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeInFromBottom}
          transition={{ delay: 0.8 }}
          className="py-12 sm:py-16 px-4 sm:px-0"
        >
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">
              Stay on Top of Your Semester with Ease
            </h2>
            <p className="text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-base">
              Let Todue handle your deadlines—automatically extracting
              assignments and exams so you can focus on what truly matters.
            </p>
            <button
              className="w-full sm:w-auto inline-flex items-center justify-center bg-white text-indigo-600 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold transition-all duration-300 hover:bg-gray-100 hover:-translate-y-0.5 hover:shadow-lg"
              onClick={() => {
                if (user) {
                  router.push("/dashboard");
                } else {
                  router.push("/sign-in");
                }
              }}
            >
              Get Started Now
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </motion.section>

        <footer className="bg-white text-gray-800 py-12 mt-20">
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Branding Section */}
              <div className="flex flex-col">
                <h2 className="text-2xl font-bold text-indigo-600">Todue</h2>
                <p className="mt-3 text-gray-600">
                  Effortlessly manage your semester and never miss a deadline.
                </p>
              </div>

              {/* Navigation */}
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold text-indigo-600">
                  Company
                </h3>
                <ul className="mt-3 space-y-2">
                  <li>
                    <a
                      href="/dashboard"
                      className="text-gray-600 hover:text-indigo-600 transition"
                    >
                      Dashboard
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={() => scrollToSection("pricing")}
                      className="text-gray-600 hover:text-indigo-600 transition cursor-pointer"
                    >
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={() => scrollToSection("how-it-works")}
                      className="text-gray-600 hover:text-indigo-600 transition cursor-pointer"
                    >
                      How it Works
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={() => scrollToSection("contact")}
                      className="text-gray-600 hover:text-indigo-600 transition cursor-pointer"
                    >
                      Contact
                    </a>
                  </li>
                </ul>
              </div>

              {/* Legal */}
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold text-indigo-600">Legal</h3>
                <ul className="mt-3 space-y-2">
                  <li>
                    <a
                      href="/tos"
                      className="text-gray-600 hover:text-indigo-600 transition cursor-pointer"
                    >
                      Terms of Service
                    </a>
                  </li>
                  <li>
                    <a
                      href="/privacy"
                      className="text-gray-600 hover:text-indigo-600 transition cursor-pointer"
                    >
                      Privacy Policy
                    </a>
                  </li>
                </ul>
              </div>

              {/* Social Media Links */}
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold text-indigo-600">
                  Follow Us
                </h3>
                <div className="mt-3 flex space-x-4">
                  <a href="#" className="text-gray-600 transition">
                    <Image
                      src="/twitter.svg"
                      alt="Twitter"
                      width={24}
                      height={24}
                      className="w-6 h-6"
                    />
                  </a>
                  <a href="#" className="text-gray-600 transition">
                    <Linkedin className="w-6 h-6" />
                  </a>
                  <a href="#" className="text-gray-600 transition">
                    <Instagram className="w-6 h-6" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-300 mt-10 pt-6 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Todue. All rights reserved.
          </div>
        </footer>
      </div>
    </>
  );
}