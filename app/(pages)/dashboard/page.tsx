import { signOutAction } from "@/app/actions";
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

  return (
    <Suspense fallback={<LoadingPage />}>
      <MainLayout user={user} signOut={signOutAction} />
    </Suspense>
  );
}
