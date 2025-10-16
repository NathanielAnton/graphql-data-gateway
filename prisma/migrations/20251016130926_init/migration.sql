-- CreateTable
CREATE TABLE "Profile" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);
