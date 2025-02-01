import LandingComp from "@/components/landing";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {

  const supabase = await createClient();

  const { data: { user }, } = await supabase.auth.getUser();

  return <LandingComp user={user} />;
}