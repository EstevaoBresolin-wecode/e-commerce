import dotenv from "dotenv";
dotenv.config();

import pg from "pg";
const { Client } = pg;

export const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});
