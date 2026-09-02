import { SignJWT, jwtVerify } from "jose";

// jose (unlike `jsonwebtoken`) works in both Node and the Edge Runtime — that's
// why the same verifyJwt is used in middleware.ts (Edge) and lib/auth/session.ts (Node)
const secret = new TextEncoder().encode(process.env.JWT_SECRET);
const ALGORITHM = "HS256";

export type JwtPayload = {
  sub: string;
  sessionId: string;
};

export function signJwt(payload: JwtPayload, expiresIn: string): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: ALGORITHM })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret);
}

// Returns null instead of making every call site wrap jwtVerify (expired/tampered/
// malformed token) in its own try/catch.
export async function verifyJwt(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify<JwtPayload>(token, secret);
    return payload;
  } catch {
    return null;
  }
}
