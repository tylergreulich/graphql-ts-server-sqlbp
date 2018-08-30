import 'reflect-metadata';
import { GraphQLServer } from 'graphql-yoga';
import { importSchema } from 'graphql-import';
import { resolvers } from './resolvers';
import * as path from 'path';
import { createConnection } from 'typeorm';

const typeDefs = importSchema(path.join(__dirname, './schema.graphql'));

const server = new GraphQLServer({ typeDefs, resolvers });

createConnection().then(() => {
  server.start(() => console.log(`Server running on localhost:4000`));
});
