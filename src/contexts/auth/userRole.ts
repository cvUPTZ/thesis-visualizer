export type UserRole = 'admin' | 'user' | 'guest';

export const getUserRole = (email: string | undefined): UserRole => {
  if (!email) return 'guest';
  // You can implement your role logic here
  return email.includes('admin') ? 'admin' : 'user';
};