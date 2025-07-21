import { implement } from '@orpc/server';
import { tvkApiContract } from '@tvk/api';
import type { HeadersInit } from 'bun';

export const api = implement(tvkApiContract).$context<{
  headers: HeadersInit;
}>();
