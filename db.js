import mysql from 'mysql2/promise';

const options = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'baemin_todo',
};

function getConnection() {
  return mysql.createConnection(options);
}

// 초기 테스트용 임시 함수. 나중에 지워도 됨.
export default getConnection;
