import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

export async function initDB() {
  const schemaSQL = `
    CREATE DATABASE IF NOT EXISTS hackathon;
    
    USE hackathon;

    CREATE TABLE IF NOT EXISTS users (
      cognito_user_id VARCHAR(255) NOT NULL,
      display_id VARCHAR(255) NOT NULL UNIQUE,
      display_name VARCHAR(255) NOT NULL,
      bio VARCHAR(255) NOT NULL DEFAULT '',
      icon_image_url VARCHAR(255),
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (cognito_user_id)
    );

    CREATE TABLE IF NOT EXISTS user_follows (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      follower_id VARCHAR(255) NOT NULL,
      followed_id VARCHAR(255) NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      CONSTRAINT fk_follower_id FOREIGN KEY (follower_id) REFERENCES users (cognito_user_id),
      CONSTRAINT fk_followed_id FOREIGN KEY (followed_id) REFERENCES users (cognito_user_id),
      CONSTRAINT unique_follows UNIQUE (follower_id, followed_id)
    );
  `;

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const statements = schemaSQL
      .split(";")
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0);

    for (const stmt of statements) {
      await connection.query(stmt);
    }

    await connection.commit();
    console.log("Database and tables initialized successfully.");
  } catch (error) {
    await connection.rollback();
    console.error("initDB error:", error);
    throw error;
  } finally {
    connection.release();
  }
}
