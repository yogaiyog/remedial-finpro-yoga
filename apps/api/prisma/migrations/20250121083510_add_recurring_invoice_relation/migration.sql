-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "recurringActive" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "recurringRefID" TEXT;
