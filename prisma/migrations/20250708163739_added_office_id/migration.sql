-- AlterTable
ALTER TABLE "Log" ADD COLUMN     "officeId" INTEGER;

-- AlterTable
ALTER TABLE "Requisition" ADD COLUMN     "officeId" INTEGER;

-- AddForeignKey
ALTER TABLE "Requisition" ADD CONSTRAINT "Requisition_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "Office"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "Office"("id") ON DELETE SET NULL ON UPDATE CASCADE;
