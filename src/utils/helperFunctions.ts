import * as bcrypt from 'bcrypt';

export async function hashPassword(password: string): Promise<string> {
  const saltOrRounds = 10;

  const hash = await bcrypt.hash(password, saltOrRounds);

  return hash;
}

export async function isPasswordMatch(
  password: string,
  hash: string,
): Promise<boolean> {
  const isMatch = await bcrypt.compare(password, hash);

  return isMatch;
}

export function toTitleCase(str: string) {
  return str.replace(
    /\w\S*/g,
    (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase(),
  );
}
