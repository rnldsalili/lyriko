import { createAuthClient } from 'better-auth/react';

import type { BetterAuthOptions } from 'better-auth';

const authOptions: BetterAuthOptions = {
  baseURL: 'http://localhost:3000/api/auth',
};

export const authClient = createAuthClient(authOptions);

// Export hooks for easier use
export const { useSession, signIn, signOut, signUp } = authClient;

// Export type for use elsewhere
export type AuthClient = typeof authClient;
