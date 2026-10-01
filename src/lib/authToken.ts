// In-memory access token. On device, the refresh token is persisted by React
// Native's native cookie store; keychain-backed persistence is a later refinement.
let accessToken: string | null = null;

export function getAccessToken(): string | null {
  return accessToken;
}
export function setAccessToken(token: string | null): void {
  accessToken = token;
}
