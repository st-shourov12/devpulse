import { Pool } from "pg";
import config from "../config";


export const pool = new Pool({
  connectionString: config.connection_string,
  ssl: {
    rejectUnauthorized: false, // use true only if you have the CA cert
  },
});

export const initDB = async () => {
  try {
    await pool.query(`
            CREATE TABLE IF NOT EXISTS users(
                id SERIAL PRIMARY KEY,
                name VARCHAR(20),
                email VARCHAR(20) UNIQUE NOT NULL,
                password TEXT NOT NULL,
                role VARCHAR(10) DEFAULT 'contributor',
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()

            )
        `);



    console.log("database connected succcessfully");
    return;
  } catch (error) {
    console.log(error);
  }
};
