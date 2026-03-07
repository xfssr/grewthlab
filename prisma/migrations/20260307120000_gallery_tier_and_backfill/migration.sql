ALTER TABLE "gallery"
ADD COLUMN "tier" TEXT NOT NULL DEFAULT '';

UPDATE "gallery"
SET "tier" = COALESCE(NULLIF(TRIM("title"), ''), "tier")
WHERE COALESCE(NULLIF(TRIM("tier"), ''), '') = '';
