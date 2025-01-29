import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

// endpoint for fetching countries data.
export async function GET() {
  const supabase = await createClient();
  const { data: countries, error } = await supabase.from("countries").select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ countries: countries, status: 200 });
}