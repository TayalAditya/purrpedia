-- CreateTable
CREATE TABLE "cat_facts" (
    "id" TEXT NOT NULL,
    "fact" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'general',
    "emoji" TEXT NOT NULL DEFAULT '🐱',
    "showCount" INTEGER NOT NULL DEFAULT 0,
    "lastShownAt" TIMESTAMP(3) NOT NULL DEFAULT '1970-01-01 00:00:00 +00:00',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cat_facts_pkey" PRIMARY KEY ("id")
);
