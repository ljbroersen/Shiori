
import {
  check,
  date,
  integer,
  pgTable,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { books } from "./books";
import { users } from "./users";

export const readingStatuses = [
  "want_to_read",
  "currently_reading",
  "finished",
  "paused",
  "dnf",
] as const;

export type ReadingStatus = (typeof readingStatuses)[number];

export const userBooks = pgTable(
  "user_books",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    bookId: uuid("book_id")
      .notNull()
      .references(() => books.id, { onDelete: "cascade" }),
    status: varchar("status", { length: 30 })
      .$type<ReadingStatus>()
      .default("want_to_read")
      .notNull(),
    rating: integer("rating"),
    startedAt: date("started_at"),
    finishedAt: date("finished_at"),
    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
    (table) => [
    unique("user_books_user_id_book_id_unique").on(
      table.userId,
      table.bookId,
    ),
    check(
      "user_books_status_check",
      sql`${table.status} IN ('want_to_read', 'currently_reading', 'finished', 'paused', 'dnf')`,
    ),
    check(
      "user_books_rating_check",
      sql`${table.rating} IS NULL OR (${table.rating} >= 1 AND ${table.rating} <= 5)`,
    ),
  ],
);
