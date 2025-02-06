import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
    const supabase = await createClient();

    const { data: { user }} = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    /**
     * Fetching User Extraction History Logic Here
     */
}