import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

if (!process.env.OPENAI_API_KEY) {
	console.error("Please set the OPENAI_API_KEY environment variable.");
	process.exit(1);
}

if (!process.env.SUPABASE_API_KEY) {
	console.error("Please set the SUPABASE_API_KEY environment variable.");
	process.exit(1);
}
if (!process.env.SUPABASE_URL) {
	console.error("Please set the SUPABASE_URL environment variable.");
	process.exit(1);
}

// OpenAI config
/**
 * @type {OpenAI}
 */
export const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
	dangerouslyAllowBrowser: true,
});

// Supabase config
/**
 * @type {import("@supabase/supabase-js").SupabaseClient}
 */
export const supabase = createClient(
	process.env.SUPABASE_URL,
	process.env.SUPABASE_API_KEY
);
