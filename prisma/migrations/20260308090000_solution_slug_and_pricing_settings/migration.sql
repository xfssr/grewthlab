ALTER TABLE "solutions" ADD COLUMN "slug" TEXT;

WITH ordered_solutions AS (
  SELECT
    "id",
    ROW_NUMBER() OVER (ORDER BY "created_at" ASC, "id" ASC) AS position
  FROM "solutions"
)
UPDATE "solutions" AS target
SET "slug" = CASE ordered_solutions.position
  WHEN 1 THEN 'qr-menu-mini-site'
  WHEN 2 THEN 'content-whatsapp-funnel'
  WHEN 3 THEN 'business-launch-setup'
  WHEN 4 THEN 'beauty-booking-flow'
  WHEN 5 THEN 'quick-start-system'
  ELSE 'legacy-' || target."id"
END
FROM ordered_solutions
WHERE target."id" = ordered_solutions."id";

UPDATE "solutions"
SET "slug" = 'legacy-' || "id"
WHERE "slug" IS NULL;

ALTER TABLE "solutions" ALTER COLUMN "slug" SET NOT NULL;

CREATE UNIQUE INDEX "solutions_slug_key" ON "solutions"("slug");

CREATE TABLE "pricing_settings" (
  "id" TEXT NOT NULL,
  "discount_percent" INTEGER NOT NULL DEFAULT 0,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "pricing_settings_pkey" PRIMARY KEY ("id")
);

INSERT INTO "pricing_settings" ("id", "discount_percent", "updated_at")
VALUES ('default', 0, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;
