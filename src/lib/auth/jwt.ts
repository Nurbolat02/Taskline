import { SignJWT, jwtVerify } from "jose";

// jose (в отличие от `jsonwebtoken`) работает и в Node, и в Edge Runtime —
// поэтому один и тот же verifyJwt используется и в middleware.ts (Edge),
// и в lib/auth/session.ts (Node)
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

// Возвращает null вместо того, чтобы заставлять каждое место вызова оборачивать
// jwtVerify (просрочен/подделан/битый токен) в свой try/catch.
export async function verifyJwt(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify<JwtPayload>(token, secret);
    return payload;
  } catch {
    return null;
  }
}
