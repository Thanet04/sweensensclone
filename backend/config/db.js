import mysql from "mysql2/promise"

const DB = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "sweensens_clone",
    waitForConnections: true,
    connectionLimit: 10,
});

export default DB;