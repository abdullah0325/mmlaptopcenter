ALTER TABLE "Order"
ADD COLUMN "paymentProofUrl" TEXT,
ADD COLUMN "transactionReference" TEXT,
ADD COLUMN "confirmationEmailSentAt" TIMESTAMP(3);
