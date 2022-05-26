import { createPool } from "mysql2/promise";
const pool = createPool({
    host: 'localhost',
    user: 'root',
    database: 'notice_board',
    namedPlaceholders: true,
    decimalNumbers: true,
});
export { pool };
//# sourceMappingURL=db.js.map