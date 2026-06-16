import process from "node:process";

// Server-only config. The .server.ts suffix prevents Vite from bundling
// this file into the client — values here NEVER reach the browser.
//
// Always read process.env INSIDE a function (not at module scope) so that
// values are read per-request rather than at import time.

export function getServerConfig() {
  return {
    nodeEnv: process.env.NODE_ENV,
    supabaseUrl: process.env.SUPABASE_URL || "",
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
    resendApiKey: process.env.RESEND_API_KEY || "",
    emailFrom: process.env.EMAIL_FROM || "FocusFlow <hello@focusflow.app>",
    razorpayKeyId: process.env.RAZORPAY_KEY_ID || "",
    razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || "",
    razorpayWebhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || "",
    n8nWebhookSecret: process.env.N8N_WEBHOOK_SECRET || "",
    openaiApiKey: process.env.OPENAI_API_KEY || "",
  };
}
