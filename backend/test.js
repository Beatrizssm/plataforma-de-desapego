import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
    });

    console.log("✅ Conexão com o banco de dados bem-sucedida!");
    await connection.end();
  } catch (error) {
    console.error("❌ Erro ao conectar com o banco de dados:", error.message);
  }
}

testConnection();