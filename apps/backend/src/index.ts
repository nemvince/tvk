import { RPCHandler } from '@orpc/server/fetch';
import { CORSPlugin } from '@orpc/server/plugins';
import { Hono } from 'hono';
import { router } from '@/api/router';

// make our environment typesafe
declare module 'bun' {
  interface Env {
    DB_USER: string;
    DB_PASSWORD: string;
    DB_HOST: string;
    DB_PORT: string;
    DB_NAME: string;
    DB_URL: string;
  }
}

const app = new Hono();
const rpcHandler = new RPCHandler(router, {
  plugins: [new CORSPlugin()],
});

app.use('/rpc/*', async (c, next) => {
  const { matched, response } = await rpcHandler.handle(c.req.raw, {
    prefix: '/rpc',
    context: {
      headers: c.req.header(),
    },
  });

  if (matched) {
    return c.newResponse(response.body, response);
  }

  await next();
});

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

export default app;
