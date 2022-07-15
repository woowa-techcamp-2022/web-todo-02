import mysql from 'mysql2/promise';
import 'dotenv/config';

const options = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

const pool = mysql.createPool(options);

function getConnection() {
  return pool.getConnection();
}

export default getConnection;
