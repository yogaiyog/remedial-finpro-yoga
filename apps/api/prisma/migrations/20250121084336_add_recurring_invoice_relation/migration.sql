-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_recurringRefID_fkey" FOREIGN KEY ("recurringRefID") REFERENCES "Invoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;
