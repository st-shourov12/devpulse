import { pool } from "../../db"
import type { Issue } from "./issue.interface";

const createIssueIntoDB = async(payload : Issue) => {
    const {title, description , type, status,  reporter_id, created_at, updated_at} = payload ; 
    const user = await pool.query(`
        SELECT * FROM   users WHERE id=$1
    `,[ reporter_id])

    if (user.rows.length === 0) {
        throw new Error("User does not exist")
    }
    const result = await pool.query(`
        INSERT INTO issues(title, description , type) VALUES($1,$2,$3)
        RETURNING *
    `,
    [title, description , type]
    )
    return result
}



export const issueService = {
    createIssueIntoDB
}