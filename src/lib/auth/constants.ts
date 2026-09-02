// Cookie name and session lifetime — kept in one place so session.ts and
// middleware.ts don't drift apart.
export const SESSION_COOKIE_NAME = "session_token";
export const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7;
export const JWT_EXPIRES_IN = `${SESSION_DURATION_MS / 1000}s`;
