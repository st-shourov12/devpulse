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
                email VARCHAR(40) UNIQUE NOT NULL,
                password TEXT NOT NULL,
                role VARCHAR(15) DEFAULT 'contributor' CHECK (role IN ('contributor', 'maintainer')),
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()

            )
        `);
    await  pool.query(`
            CREATE TABLE IF NOT EXISTS issues(
                id SERIAL PRIMARY KEY,
                title VARCHAR(150) NOT NULL,
                description TEXT NOT NULL CHECK (LENGTH(description) >= 20),
                type VARCHAR(20) NOT NULL CHECK (type IN ('bug', 'feature_request')),
                status VARCHAR(20) DEFAULT 'open'
                CHECK (status IN ('open', 'in_progress', 'resolved')),
                reporter_id INT REFERENCES users(id) ON DELETE CASCADE,
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
