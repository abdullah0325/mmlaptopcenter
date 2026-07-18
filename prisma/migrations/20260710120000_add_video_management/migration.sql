-- CreateEnum
CREATE TYPE "VideoPlatform" AS ENUM ('YOUTUBE', 'TIKTOK', 'FACEBOOK', 'INSTAGRAM');

-- CreateEnum
CREATE TYPE "VideoPlacement" AS ENUM ('HOMEPAGE', 'ABOUT', 'VIDEOS_PAGE');

-- CreateTable
CREATE TABLE "Video" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "thumbnail" TEXT,
    "videoUrl" TEXT NOT NULL,
    "embedUrl" TEXT,
    "platform" "VideoPlatform" NOT NULL,
    "placement" "VideoPlacement" NOT NULL DEFAULT 'VIDEOS_PAGE',
    "buttonText" TEXT,
    "buttonUrl" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Video_platform_idx" ON "Video"("platform");

-- CreateIndex
CREATE INDEX "Video_placement_idx" ON "Video"("placement");

-- CreateIndex
CREATE INDEX "Video_featured_idx" ON "Video"("featured");

-- CreateIndex
CREATE INDEX "Video_active_idx" ON "Video"("active");

-- CreateIndex
CREATE INDEX "Video_displayOrder_idx" ON "Video"("displayOrder");
