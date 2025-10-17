import { gql } from "graphql-tag";

export const typeDefs = gql`

  type Event {
  id: ID!
  name: String!
  date: String!
  location: String
  bookings: [Booking!]!
 }

  type Booking {
    id: ID!
    profile: Profile!
    event: Event!
    status: String!
    createdAt: String!
  }

  type Profile {
    id: ID!
    name: String!
    role: String!
    available: Boolean!
    createdAt: String!
  }

  type Query {
    profiles(id : ID, name: String, role: String, available: Boolean): [Profile!]!
    bookings(id: ID): [Booking!]! 
    events(id: ID,name: String): [Event!]!
  }

  type Mutation {
    createProfile(name: String!, role: String!, available: Boolean!): Profile!
    updateProfile(id: ID!, name: String, role: String, available: Boolean): Profile!
    deleteProfile(id: ID!): Profile!
    createEvent(name: String!, date: String!, location: String): Event!
    createBooking(profileId: ID!, eventId: ID!): Booking!
    cancelBooking(id: ID!): Booking!
  }
`;
