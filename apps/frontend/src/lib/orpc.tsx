import { createORPCClient } from '@orpc/client';
import { RPCLink } from '@orpc/client/fetch';
import type { ContractRouterClient } from '@orpc/contract';
import { createTanstackQueryUtils } from '@orpc/tanstack-query';
import type { tvkApiContract } from '@tvk/api';

const link = new RPCLink({
  url: 'http://127.0.0.1:3000/rpc',
  headers: { Authorization: 'Bearer token' },
});

const client: ContractRouterClient<typeof tvkApiContract> =
  createORPCClient(link);
export const o = createTanstackQueryUtils(client);
