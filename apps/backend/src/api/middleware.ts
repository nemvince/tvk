import { ORPCError } from '@orpc/server';
import { api } from '@/api/contract';
import { auth } from '@/lib/auth';

export const requireAuth = api.middleware(async ({ context, next }) => {
  const user = await auth.api.getSession({
    headers: new Headers(context.headers),
  });

  if (user) {
    return next({ context: { ...context, user } });
  }

  throw new ORPCError('UNAUTHORIZED');
});
