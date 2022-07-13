import getConnection from '../db.js';

function getAllColumnsAndTodos() {
  let conn;

  return new Promise((resolve, reject) => {
    getConnection()
      .then((connection) => (conn = connection))
      .then((conn) =>
        conn.execute(`
        select c.title as title, c.id as id, t.id as todo_id,
            t.title as todo_title, t.content as todo_content
        from col c
        left join todo t
        on c.id = t.col_id;`)
      )
      .then(([rows, field]) => {
        resolve(rows);
      })
      .catch((e) => reject(e))
      .finally(() => conn.end());
  });
}

function postTodo(id, title, content, columnId) {
  let conn;

  return new Promise((resolve, reject) => {
    getConnection()
      .then((connection) => (conn = connection))
      .then((conn) =>
        conn.execute(
          `
        insert into todo (id, title, content, col_id)
        values (?, ?, ?, ?);
        `,
          [id, title, content, columnId]
        )
      )
      .then(([rows, field]) => {
        if (rows.affectedRows === 1) resolve();
      })
      .catch((e) => reject(e))
      .finally(() => conn.end());
  });
}

export default { getAllColumnsAndTodos, postTodo };
