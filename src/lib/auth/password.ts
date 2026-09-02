import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

// Thin wrapper around bcrypt so the rest of the code doesn't know about bcrypt
// directly — only about hashPassword/verifyPassword.
export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
