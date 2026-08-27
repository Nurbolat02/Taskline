import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

// Тонкая обёртка вокруг bcrypt, чтобы остальной код не знал про bcrypt напрямую —
// только про hashPassword/verifyPassword.
export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
