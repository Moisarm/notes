import bcrypt from "bcrypt";

const rounds = 10;

export const hash_password = (password: string) => {
  return bcrypt.hash(password, rounds);
};

export const compare_passwords = (
  password: string,
  hashed_password: string
) => {
  return bcrypt.compare(password, hashed_password);
};
