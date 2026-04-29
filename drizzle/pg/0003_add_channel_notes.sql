CREATE TABLE "channel_notes" (
  "account_id" text NOT NULL,
  "channel_id" text NOT NULL,
  "note" text NOT NULL DEFAULT '',
  "updated_at" timestamp(6) NOT NULL DEFAULT now(),
  PRIMARY KEY ("account_id", "channel_id")
);
