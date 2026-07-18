ALTER TABLE "Product" ADD COLUMN "displayOrder" INTEGER NOT NULL DEFAULT 9999;

CREATE INDEX "Product_displayOrder_idx" ON "Product"("displayOrder");
