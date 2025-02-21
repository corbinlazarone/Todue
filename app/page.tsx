import LandingComp from "@/components/landing/landing";
import { createClient } from "@/utils/supabase/server";
import { signOutAction } from "./actions";

export default async function Home() {

  const supabase = await createClient();

  const { data: { user }, } = await supabase.auth.getUser();

  return <LandingComp user={user} signOut={signOutAction}/>;
}