/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("member", (table) => {
      table.increments("mem_id").primary();
      table.string("mem_name").notNullable();
      table.string("mem_phone").notNullable();
      table.string("mem_email").notNullable().unique();
      table.string("password").notNullable();
    })
    .createTable("membership", (table) => {
      table.increments("membership_id").primary();
      table.integer("member_id").references("mem_id").inTable("member");
      table.string("status").notNullable();
    })
    .createTable("category", (table) => {
      table.increments("cat_id").primary();
      table.string("cat_name").notNullable();
      table.string("sub_cat_name").notNullable();
    })
    .createTable("collection", (table) => {
      table.increments("collection_id").primary();
      table.string("collection_name").notNullable();
    })
    .createTable("book", (table) => {
      table.increments("book_id").primary();
      table.string("book_name").notNullable();
      table.integer("book_cat_id").references("cat_id").inTable("category");
      table
        .integer("book_collection_id")
        .references("collection_id")
        .inTable("collection");
      table.timestamp("book_launch_date");
      table.string("book_publisher");
    })
    .createTable("issuance", (table) => {
      table.increments("issuance_id").primary();
      table.integer("book_id").references("book_id").inTable("book");
      table.integer("issuance_member").references("mem_id").inTable("member");
      table.timestamp("issuance_date").defaultTo(knex.fn.now());
      table.string("issued_by");
      table.timestamp("target_return_date");
      table.string("issuance_status");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("issuance")
    .dropTableIfExists("book")
    .dropTableIfExists("collection")
    .dropTableIfExists("category")
    .dropTableIfExists("membership")
    .dropTableIfExists("member");
};
