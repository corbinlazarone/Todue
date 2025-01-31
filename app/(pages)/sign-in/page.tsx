/**
 * Handle Sign in functions from actions.ts file
 */

import { signInWithGoogle } from "@/app/actions";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div>
      <h1>Login Page</h1>
      {/* Google Button */}
      <button
        onClick={signInWithGoogle}
        className="w-full flex items-center justify-center gap-3 p-3 rounded-xl border-2 border-violet-100 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-violet-50 dark:hover:bg-gray-700/50 transition-colors mb-6"
      >
        <Image
          src={"google_icon.svg"}
          alt="Google"
          className="w-5 h-5"
          width={10}
          height={10}
        />
        <span className="text-gray-700 dark:text-gray-200 font-medium">
          Continue with Google
        </span>
      </button>
    </div>
  );
}
