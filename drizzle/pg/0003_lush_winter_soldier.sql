CREATE TABLE "channel_metadata" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"node_id" uuid NOT NULL,
	"channel_id" text NOT NULL,
	"note" text NOT NULL,
	"created_at" timestamp(6) DEFAULT now() NOT NULL,
	"updated_at" timestamp(6) DEFAULT now() NOT NULL,
	CONSTRAINT "channel_metadata_user_id_node_id_channel_id_unique" UNIQUE("user_id","node_id","channel_id")
);
--> statement-breakpoint
ALTER TABLE "channel_metadata" ADD CONSTRAINT "channel_metadata_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "channel_metadata" ADD CONSTRAINT "channel_metadata_node_id_nodes_id_fk" FOREIGN KEY ("node_id") REFERENCES "public"."nodes"("id") ON DELETE cascade ON UPDATE no action;