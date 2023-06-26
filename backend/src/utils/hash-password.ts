import bcrypt from 'bcrypt';

// * Function that hashes a password with a generated salt and a provided pepper
export const hashPassword = async (
  password: string,
  pepper: string,
  saltRounds?: number,
): Promise<string> => {
  const salt = await bcrypt.genSalt(saltRounds || 10);
  return bcrypt.hash(password + pepper, salt);
};
// * Function that compares a password with a hash
export const compareHashedPassword = async (
  password: string,
  hash: string,
  pepper: string,
): Promise<boolean> => {
  return bcrypt.compare(password + pepper, hash);
};
