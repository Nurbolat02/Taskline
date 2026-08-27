// Имя cookie и время жизни сессии — в одном месте, чтобы не разъезжались
// между session.ts и middleware.ts.
export const SESSION_COOKIE_NAME = "session_token";
export const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7;
export const JWT_EXPIRES_IN = `${SESSION_DURATION_MS / 1000}s`;
