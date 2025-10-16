import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const resolvers = {
  Query: {
    profiles: async (_, { name, role, available }) => {
      const filters = {};

      if (name) {
        filters.name = { contains: name, mode: "insensitive" };
      }

      if (role) {
        filters.role = { contains: role, mode: "insensitive" };
      }

      if (available !== undefined) {
        filters.available = available;
      }

      return await prisma.profile.findMany({
        where: filters,
        orderBy: { id: "asc" },
      });
    },
  },

   Mutation: {
    createProfile: async (_, { name, role, available }) => {
      try {
        const newProfile = await prisma.profile.create({
          data: { name, role, available },
        });
        return newProfile;
      } catch (error) {
        console.error("Erreur lors de la création :", error);
        throw new Error("Impossible de créer le profil");
      }
    },
  },
};
