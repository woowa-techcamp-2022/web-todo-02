import mysql from 'mysql2';

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'baemin_todo',
});

// 초기 테스트용 임시 함수. 나중에 지워도 됨.
export function showDatabases() {
  connection.connect();
  connection.query('SHOW DATABASES', function (error, results, fields) {
    if (error) throw error;
    console.log(results);
  });
  connection.end();
}
