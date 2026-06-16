// Raw MySQL connection using mysql2 (alternative to Prisma ORM)
import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
});
