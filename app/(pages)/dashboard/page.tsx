import { signOutAction } from "@/app/actions";
import DashboardComp from "@/components/dashboard/dashboard";
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

  return <DashboardComp user={user} signOut={signOutAction}/>;
}