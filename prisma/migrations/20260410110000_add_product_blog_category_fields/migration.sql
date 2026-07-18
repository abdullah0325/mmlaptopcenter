-- Add product classification fields
ALTER TABLE "Product"
ADD COLUMN "categoryId" TEXT,
ADD COLUMN "subcategoryId" TEXT;

-- Add optional blog category mapping
ALTER TABLE "BlogPost"
ADD COLUMN "categoryId" TEXT;

