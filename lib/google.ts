import { google } from "googleapis";

// Use service account if available, otherwise fall back to OAuth
export function sheetsClient(accessToken?: string) {
  // Try service account first (works without login)
  if (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive.file',
      ],
    });
    return google.sheets({ version: "v4", auth });
  }
  
  // Fall back to OAuth if service account not available
  if (accessToken) {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });
    return google.sheets({ version: "v4", auth });
  }
  
  // If neither available, return null (caller should handle gracefully)
  return null as any;
}

