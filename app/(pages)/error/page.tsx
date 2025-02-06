import Link from "next/link";

export default function ErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 text-center px-6">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Oops!</h1>
      <p className="text-lg text-gray-700 mb-6">
        An error has occurred. Please try again or contact us for support.
      </p>
      <div className="flex space-x-4">
        <Link href="/">
          <button    className="bg-[#6366F1] text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-[#4F46E5] transition-all duration-300 hover:shadow-lg">
            Go back home
          </button>
        </Link>
        <Link href="?section=contact">
          <button    className="bg-[#6366F1] text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-[#4F46E5] transition-all duration-300 hover:shadow-lg">
            Contact us
          </button>
        </Link>
      </div>
    </div>
  );
}