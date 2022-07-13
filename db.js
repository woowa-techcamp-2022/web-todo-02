import mysql from 'mysql2';

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'baemin_todo',
});

// 초기 테스트용 임시 함수. 나중에 지워도 됨.
export default connection;
