"use server";

import { createClient } from "@/utils/supabase/server";
import { SupabaseClient, User } from "@supabase/supabase-js";
import PDFParser from 'pdf2json';

import type { Buffer } from 'buffer';

interface StripeCustomer {
  has_access: boolean;
}

interface AuthenticatedResponse {
  error?: string;
  success?: User;
  supabaseClient?: SupabaseClient;
}

interface SubscriptionResponse {
  error?: string;
  success?: StripeCustomer;
}

interface SessionResponse {
  error?: string;
  success?: any;
}

export const checkAuthenticatedUser = async (): Promise<AuthenticatedResponse> => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  return { success: user, supabaseClient: supabase };
};

export const checkUserSubscription = async (
  email?: string
): Promise<SubscriptionResponse> => {
  const supabase = await createClient();

  const { data: userSub, error: subError } = await supabase
    .from("stripe_customers")
    .select("has_access")
    .eq("email", email)
    .single();

  if (subError) {
    console.log(subError);
    return { error: "Error fetching user subscription status" };
  }

  if (!userSub?.has_access) {
    return { error: "Access denied --- Subscription required" };
  }

  return { success: userSub };
};

export const fetchUserSession = async (): Promise<SessionResponse> => {
  const supabase = await createClient();

  const { data: { session }, error: sessionError } =
    await supabase.auth.getSession();

  if (sessionError) {
    return { error: "Error fetching user session" };
  }

  return { success: session };
};

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser(null, true);

    pdfParser.on('pdfParser_dataReady', (pdfData) => {
      try {
        const text = pdfData.Pages.map(page => 
          page.Texts.map(text => decodeURIComponent(text.R[0].T)).join(' ')
        ).join('\n');
        resolve(text);
      } catch (error) {
        reject(new Error('Failed to parse PDF content'));
      }
    });

    pdfParser.on('pdfParser_dataError', (error) => {
      reject(new Error(`PDF parsing error: ${error.parserError}`));
    });

    try {
      pdfParser.parseBuffer(buffer);
    } catch (error) {
      reject(new Error('Failed to parse PDF buffer'));
    }
  });
}

export async function extractTextFromDOCX(buffer: Buffer): Promise<string> {
  try {
    const mammoth = (await import('mammoth')).default;
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (error) {
    console.error('DOCX parsing error:', error);
    throw new Error('Failed to extract text from DOCX');
  }
}