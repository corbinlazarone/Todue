import { signOutAction } from "@/app/actions";
import { checkUserSubscription } from "@/app/helpers";
import MainLayout from "@/components/dashboard/layout";
import LoadingPage from "@/components/ui/loading-page";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function DashboadPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Check user subscription status
  const userSub = await checkUserSubscription(user.email);

  if (userSub.error) {
    return redirect("/?has_access=false");
  }

  return (
    <Suspense fallback={<LoadingPage />}>
      <MainLayout user={user} signOut={signOutAction} />
    </Suspense>
  );
}
