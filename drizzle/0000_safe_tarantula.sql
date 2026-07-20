CREATE TYPE "public"."sale_origin" AS ENUM('WEB', 'POS');--> statement-breakpoint
CREATE TYPE "public"."sale_status" AS ENUM('PENDIENTE', 'PAGADO', 'CANCELADO');--> statement-breakpoint
CREATE TYPE "public"."shipment_status" AS ENUM('PREPARACION', 'DESPACHADO', 'EN_TRANSITO', 'ENTREGADO');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('CLIENTE', 'EMPLEADO', 'ADMINISTRADOR');--> statement-breakpoint
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"parent_id" integer,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "hardware_compatibility" (
	"id" serial PRIMARY KEY NOT NULL,
	"component_type_a" varchar(100) NOT NULL,
	"component_type_b" varchar(100) NOT NULL,
	"compatibility_rule" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inventory" (
	"product_id" integer PRIMARY KEY NOT NULL,
	"stock_quantity" integer DEFAULT 0 NOT NULL,
	"reserved_quantity" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"price" numeric(10, 2) NOT NULL,
	"category_id" integer,
	"specs" jsonb,
	"images" text[],
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "products_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "sale_details" (
	"id" serial PRIMARY KEY NOT NULL,
	"sale_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"quantity" integer NOT NULL,
	"unit_price" numeric(10, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sales" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"employee_id" integer,
	"origin" "sale_origin" NOT NULL,
	"status" "sale_status" DEFAULT 'PENDIENTE',
	"total" numeric(10, 2) NOT NULL,
	"payment_method" varchar(100),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "shipments" (
	"id" serial PRIMARY KEY NOT NULL,
	"sale_id" integer NOT NULL,
	"tracking_number" varchar(255),
	"carrier" varchar(100),
	"status" "shipment_status" DEFAULT 'PREPARACION',
	"address" jsonb NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"role" "user_role" DEFAULT 'CLIENTE',
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sale_details" ADD CONSTRAINT "sale_details_sale_id_sales_id_fk" FOREIGN KEY ("sale_id") REFERENCES "public"."sales"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sale_details" ADD CONSTRAINT "sale_details_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales" ADD CONSTRAINT "sales_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales" ADD CONSTRAINT "sales_employee_id_users_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_sale_id_sales_id_fk" FOREIGN KEY ("sale_id") REFERENCES "public"."sales"("id") ON DELETE cascade ON UPDATE no action;