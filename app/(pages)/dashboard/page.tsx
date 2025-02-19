import { signOutAction } from "@/app/actions";
import DashboardComp from "@/components/dashboard/sections/dashboard";
import MainLayout from "@/components/dashboard/layout";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboadPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return <MainLayout user={user} signOut={signOutAction} />;
}