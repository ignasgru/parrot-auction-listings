import { google } from "googleapis";

// Per spec: Use OAuth access token (authentication is required)
export function sheetsClient(accessToken: string) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });
  return google.sheets({ version: "v4", auth });
}

