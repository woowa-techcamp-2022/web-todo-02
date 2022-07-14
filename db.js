import mysql from 'mysql2/promise';
import 'dotenv/config';

const options = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

function getConnection() {
  return mysql.createConnection(options);
}

// 초기 테스트용 임시 함수. 나중에 지워도 됨.
export default getConnection;
