import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const resolvers = {
  Query: {
    profiles: async (_, { id, name, role, available }) => {
      const filters = {};

      if (id) {
        filters.id = parseInt(id,10);
      }

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

    updateProfile: async (_, { id, name, role, available }) => {
      try {
        const updated = await prisma.profile.update({
          where: { id: Number(id) },
          data: { name, role, available },
        });
        return updated;
      } catch (error) {
        console.error("Erreur lors de la mise à jour :", error);
        throw new Error("Impossible de mettre à jour le profil");
      }
    },

    deleteProfile: async (_, { id }) => {
      try {
        const deleted = await prisma.profile.delete({
          where: { id: Number(id) },
        });
        return deleted;
      } catch (error) {
        console.error("Erreur lors de la suppression :", error);
        throw new Error("Impossible de supprimer le profil");
      }
    },
  },
};
