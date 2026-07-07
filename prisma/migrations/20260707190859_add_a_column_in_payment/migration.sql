/*
  Warnings:

  - The values [PENDING] on the enum `PaymentStatus` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `tenantId` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PaymentStatus_new" AS ENUM ('COMPLETED', 'FAILED', 'CANCELED');
ALTER TABLE "public"."payments" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "payments" ALTER COLUMN "status" TYPE "PaymentStatus_new" USING ("status"::text::"PaymentStatus_new");
ALTER TYPE "PaymentStatus" RENAME TO "PaymentStatus_old";
ALTER TYPE "PaymentStatus_new" RENAME TO "PaymentStatus";
DROP TYPE "public"."PaymentStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "tenantId" TEXT NOT NULL,
ALTER COLUMN "status" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
