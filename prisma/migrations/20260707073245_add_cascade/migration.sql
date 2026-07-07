-- DropForeignKey
ALTER TABLE "rentalRequests" DROP CONSTRAINT "rentalRequests_propertyId_fkey";

-- AddForeignKey
ALTER TABLE "rentalRequests" ADD CONSTRAINT "rentalRequests_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;
