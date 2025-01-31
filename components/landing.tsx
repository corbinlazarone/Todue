import Link from "next/link";

export default function LandingComp() {
  return (
    <div>
      <h1>Todues Landing Page</h1>
      <button>
        <Link href="/sign-in">Go to Sign in Page</Link>
      </button>
    </div>
  );
}