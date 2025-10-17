import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const resolvers = {
  Query: {
    profiles: async (_, { id, name, role, available }) => {
      const filters = {};

      if (id) {
        filters.id = parseInt(id, 10);
      }

      if (name) {
        filters.name = { contains: name, mode: "insensitive" };
      }

      if (role) {
        filters.role = { contains: role, mode: "insensitive" };
      }

      if (available === true || available === false) {
        filters.available = available;
      }

      return await prisma.profile.findMany({
        where: filters,
        orderBy: { id: "asc" },
      });
    },

    events: async (_, { id, name }) => {
      const filters = {};

      if (id) {
        filters.id = parseInt(id, 10);
      }

      if (name) {
        filters.name = { contains: name, mode: "insensitive" };
      }

      return await prisma.event.findMany({
        where: filters,
        include: {
          bookings: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: { id: "asc" },
      });
    },

    bookings: async (_, { id }) => {
      const filters = {};

      if (id) {
        filters.id = parseInt(id, 10);
      }

      return await prisma.booking.findMany({
        where: filters,
        include: {
          profile: true,
          event: true,
        },
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
          data: { 
            ...(name && { name }),
            ...(role && { role }),
            // CORRECTION : Vérifier que available n'est pas null
            ...(available !== undefined && available !== null && { available })
          },
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

    createEvent: async (_, { name, date, location }) => {
      return await prisma.event.create({
        data: { name, date: new Date(date), location },
      });
    },

    createBooking: async (_, { profileId, eventId }) => {
      const profile = await prisma.profile.findUnique({ where: { id: Number(profileId) } });
      if (!profile) throw new Error("Profil introuvable");
      if (!profile.available) throw new Error("Profil indisponible");

      const event = await prisma.event.findUnique({ where: { id: Number(eventId) } });
      if (!event) throw new Error("Événement introuvable");

      const booking = await prisma.booking.create({
        data: {
          profileId: Number(profileId),
          eventId: Number(eventId),
          status: "CONFIRMED",
        },
        include: { profile: true, event: true },
      });

      await prisma.profile.update({
        where: { id: Number(profileId) },
        data: { available: false },
      });

      return booking;
    },

    cancelBooking: async (_, { id }) => {
      const booking = await prisma.booking.findUnique({ 
        where: { id: Number(id) }, 
        include: { profile: true } 
      });
      if (!booking) throw new Error("Réservation introuvable");

      await prisma.booking.update({
        where: { id: Number(id) },
        data: { status: "CANCELLED" },
      });

      await prisma.profile.update({
        where: { id: booking.profileId },
        data: { available: true },
      });

      return booking;
    },
  },
};