import { pool } from "../db";

const dbQuery = async (
  text: string,
  params?: unknown[]
) => {

  const result = await pool.query(text, params);

  return result;
};

export default dbQuery;