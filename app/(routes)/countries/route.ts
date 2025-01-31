import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

/**
 * example of a protected api endpoint 
 */

export async function GET() {
  const supabase = await createClient();

  const { data: { user }, } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: countries, error } = await supabase.from("countries").select("*");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ countries: countries, status: 200 });
}