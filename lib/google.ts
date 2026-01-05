import { google } from "googleapis";

// Per spec: Use OAuth access token (authentication is required)
// Auth temporarily disabled - accepts undefined for now
export function sheetsClient(accessToken?: string) {
  if (!accessToken) {
    return null;
  }
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });
  return google.sheets({ version: "v4", auth });
}

