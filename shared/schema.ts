import { pgTable, text, serial, integer, boolean, date, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const anken = pgTable("anken", {
  anken_id: text("anken_id").primaryKey(),
  anken_name: text("anken_name"),
  detail: text("detail"),
  notes: text("notes"),
  start_date: text("start_date"), // Using text for date to match schema
  end_date: text("end_date"),
  status_code: integer("status_code"),
  created_at: text("created_at"),
  price: text("price"),
  limit_date: text("limit_date"),
  contract: text("contract"),
  meeting: text("meeting"),
  foreigner: text("foreigner"),
  telework: text("telework"),
  telework_yn: integer("telework_yn"),
  required_skills: text("required_skills"),
  nice_skills: text("nice_skills"),
  process: text("process"),
  platform: text("platform"),
  framework: text("framework"),
  program: text("program"),
  db: text("db"),
  location: text("location"),
  ken: text("ken"),
  time_from: text("time_from"),
  time_to: text("time_to"),
  updated_at: text("updated_at"),
  duplicate_check: text("duplicate_check"),
  persons: text("persons"),
  contact_id: text("contact_id")
});

export const insertAnkenSchema = createInsertSchema(anken).omit({
  anken_id: true,
  created_at: true,
  updated_at: true,
});

export type InsertAnken = z.infer<typeof insertAnkenSchema>;
export type Anken = typeof anken.$inferSelect;

// Status mapping for display
export const statusMap = {
  1: { label: "新規", color: "bg-blue-100 text-blue-800" },
  2: { label: "進行中", color: "bg-green-100 text-green-800" },
  3: { label: "完了", color: "bg-gray-100 text-gray-800" },
  4: { label: "保留", color: "bg-yellow-100 text-yellow-800" },
} as const;
