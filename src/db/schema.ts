import { pgTable, serial, varchar, text, decimal, integer, jsonb, timestamp, pgEnum } from 'drizzle-orm/pg-core';

// Enums
export const userRoleEnum = pgEnum('user_role', ['CLIENTE', 'EMPLEADO', 'ADMINISTRADOR']);
export const saleOriginEnum = pgEnum('sale_origin', ['WEB', 'POS']);
export const saleStatusEnum = pgEnum('sale_status', ['PENDIENTE', 'PAGADO', 'CANCELADO']);
export const shipmentStatusEnum = pgEnum('shipment_status', ['PREPARACION', 'DESPACHADO', 'EN_TRANSITO', 'ENTREGADO']);

// Users
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  role: userRoleEnum('role').default('CLIENTE'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Categories
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  parentId: integer('parent_id'),
});

// Products
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  categoryId: integer('category_id').references(() => categories.id),
  specs: jsonb('specs'), // For variable technical attributes
  images: text('images').array(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Inventory
export const inventory = pgTable('inventory', {
  productId: integer('product_id').primaryKey().references(() => products.id),
  stockQuantity: integer('stock_quantity').notNull().default(0),
  reservedQuantity: integer('reserved_quantity').notNull().default(0),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Hardware Compatibility
export const hardwareCompatibility = pgTable('hardware_compatibility', {
  id: serial('id').primaryKey(),
  componentTypeA: varchar('component_type_a', { length: 100 }).notNull(),
  componentTypeB: varchar('component_type_b', { length: 100 }).notNull(),
  compatibilityRule: jsonb('compatibility_rule').notNull(),
});

// Sales
export const sales = pgTable('sales', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  employeeId: integer('employee_id').references(() => users.id), // Null for web sales
  origin: saleOriginEnum('origin').notNull(),
  status: saleStatusEnum('status').default('PENDIENTE'),
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),
  paymentMethod: varchar('payment_method', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow(),
});

// Sale Details
export const saleDetails = pgTable('sale_details', {
  id: serial('id').primaryKey(),
  saleId: integer('sale_id').notNull().references(() => sales.id, { onDelete: 'cascade' }),
  productId: integer('product_id').notNull().references(() => products.id),
  quantity: integer('quantity').notNull(),
  unitPrice: decimal('unit_price', { precision: 10, scale: 2 }).notNull(),
});

// Shipments
export const shipments = pgTable('shipments', {
  id: serial('id').primaryKey(),
  saleId: integer('sale_id').notNull().references(() => sales.id, { onDelete: 'cascade' }),
  trackingNumber: varchar('tracking_number', { length: 255 }),
  carrier: varchar('carrier', { length: 100 }),
  status: shipmentStatusEnum('status').default('PREPARACION'),
  address: jsonb('address').notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
