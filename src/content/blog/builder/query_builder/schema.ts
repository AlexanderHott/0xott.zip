import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const countries = sqliteTable("countries", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
});
export const cities = sqliteTable("cities", {
  id: int().primaryKey({ autoIncrement: true }),
  countryId: int()
    .notNull()
    .references(() => countries.id),
  name: text().notNull(),
});
