
/**
 * POST --- will require an assignment object in the body
 */

import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST() {
    const supabase = await createClient();

    const { data: { user }} = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    /** 
     * Update Assignment Logic Here
     */
}