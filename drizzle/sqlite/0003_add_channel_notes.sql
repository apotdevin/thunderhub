CREATE TABLE `channel_notes` (
  `account_id` text NOT NULL,
  `channel_id` text NOT NULL,
  `note` text NOT NULL DEFAULT '',
  `updated_at` text NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  PRIMARY KEY (`account_id`, `channel_id`)
);
