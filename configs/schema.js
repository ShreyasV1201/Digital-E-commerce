import { pgTable, serial, integer, varchar, text } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  image: varchar(),
  email: varchar({ length: 255 }).notNull().unique(),
});

export const productsTable = pgTable("products", {
  id: serial().primaryKey(),
  title: varchar({ length: 255 }).notNull(),
  price: integer().notNull(),
  description: text().notNull(),
  about: text(),
  category: varchar({ length: 255 }).notNull(),
  imageUrl: varchar({ length: 1000 }).notNull(),
  fileUrl: varchar({ length: 1000 }).notNull(),
  message: varchar({ length: 500 }),
  createdBy: varchar({ length: 255 }).notNull().references(() => usersTable.email),
});

export const cartTable = pgTable("cart", {
  id: serial().primaryKey(),
  email: varchar({ length: 255 }).notNull().references(() => usersTable.email),
  productId: integer("productId").notNull().references(() => productsTable.id),
});

export const orderTable=pgTable('orders',{
  id: serial().primaryKey(),
  email: varchar({ length: 255 }).notNull().references(() => usersTable.email),
  productId: integer("productId").notNull().references(() => productsTable.id),

})