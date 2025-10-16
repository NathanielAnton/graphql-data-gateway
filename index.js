import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const typeDefs = `
  type Profile {
    id: ID!
    name: String!
    role: String!
    available: Boolean!
    createdAt: String!
  }

  type Query {
    profiles: [Profile!]!
    profile(id: ID!): Profile
  }
`;

const resolvers = {
  Query: {
    profiles: async () => {
      return prisma.profile.findMany();
    },
    profile: async (_, args) => {
      return prisma.profile.findUnique({
        where: { id: parseInt(args.id) },
      });
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀 Serveur GraphQL lancé sur ${url}`);
