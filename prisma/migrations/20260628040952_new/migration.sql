-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "certificates" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "details" JSONB NOT NULL DEFAULT '[]';
