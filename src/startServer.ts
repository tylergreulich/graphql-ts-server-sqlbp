import { GraphQLServer } from 'graphql-yoga';
import * as session from 'express-session';
import * as connectRedis from 'connect-redis';
import { createTypeormConnection } from './utils/createTypeormConnection';

import { genSchema } from './utils/genSchema';

export const startServer = async () => {
  const SESSION_SECRET = 'ajslkjalksjdfkl';
  const RedisStore = connectRedis(session);

  const server = new GraphQLServer({
    schema: genSchema(),
    context: ({ request }: any) => ({
      url: request.protocal + '://' + request.get('host'),
      session: request.session
    })
  } as any);

  server.express.use(
    session({
      store: new RedisStore({}),
      name: 'qid',
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // set to 'true' if in production for https
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
      }
    })
  );

  const cors = {
    credentials: true,
    origin: 'http://localhost:3000'
  };

  await createTypeormConnection();
  const app = await server.start({
    cors,
    port: process.env.NODE_ENV === 'test' ? 0 : 4000
  });
  console.log('Server is running on localhost:4000');

  return app;
};
