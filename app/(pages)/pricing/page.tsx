import ButtonCustomerPortal from "@/components/pricing/button-customer-portal";
import Pricing from "@/components/pricing/plans";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function PricingPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div>
      <div>
        <ButtonCustomerPortal user={user} />
      </div>
      <div>
        <Pricing user={user} />
      </div>
    </div>
  );
}