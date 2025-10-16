import { gql } from "graphql-tag";

export const typeDefs = gql`
  type Profile {
    id: ID!
    name: String!
    role: String!
    available: Boolean!
    createdAt: String!
  }

  type Query {
    profiles(id : ID, name: String, role: String, available: Boolean): [Profile!]!
  }

  type Mutation {
    createProfile(name: String!, role: String!, available: Boolean!): Profile!
    updateProfile(id: ID!, name: String, role: String, available: Boolean): Profile!
    deleteProfile(id: ID!): Profile!
  }
`;
