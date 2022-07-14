import getConnection from '../db.js';

function getAllColumnsAndTodos() {
  let conn;

  return new Promise((resolve, reject) => {
    getConnection()
      .then((connection) => (conn = connection))
      .then((conn) =>
        conn.execute(`
        select c.title as title, c.id as id, t.id as todo_id,
            t.title as todo_title, t.content as todo_content, t.pos as todo_order, t.pos_updated_time as todo_pos_updated
        from col c
        left join todo t
        on c.id = t.col_id
        order by t.pos desc, t.pos_updated_time desc;`)
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
          insert into todo (id, title, content, col_id, pos)
          values (?, ?, ?, ?,
            ifnull ((select pos from (select max(pos) as pos from todo where col_id = ?) temp), 0)
          + 1);
        `,
          [id, title, content, columnId, columnId]
        )
      )
      .then(([rows, field]) => {
        if (rows.affectedRows === 1) resolve();
      })
      .catch((e) => reject(e))
      .finally(() => conn.end());
  });
}

function putTodo(id, title, content, pos, columnId) {
  const position = Number(pos);
  let conn;
  let originPos;
  let originColId;

  return new Promise((resolve, reject) => {
    getConnection()
      .then((connection) => (conn = connection))
      .then(() => conn.beginTransaction())
      .then(() =>
        conn.execute(`select pos, col_id from todo where id = ?`, [id])
      )
      .then(([rows, fields]) => {
        originPos = rows[0].pos;
        originColId = rows[0].col_id;

        if (originColId !== columnId) {
          return new Promise((resolve, reject) => {
            conn
              .execute(
                `
                    update todo
                    set pos = pos + 1
                    where col_id = ? and pos >= ?;
                `,
                [columnId, position]
              )
              .then(() => {
                resolve(
                  conn.execute(
                    `
                        update todo
                        set pos = pos - 1
                        where col_id = ? and pos > ?;
                    `,
                    [originColId, originPos]
                  )
                );
              })
              .catch((e) => reject(e));
          });
        } else if (position !== originPos) {
          if (position > originPos) {
            return conn.execute(
              `
                update todo
                set pos = pos - 1
                where col_id = ? and pos between ? and ?;
            `,
              [columnId, originPos + 1, position]
            );
          } else {
            return conn.execute(
              `
                update todo
                set pos = pos + 1
                where col_id = ? and pos between ? and ?;
            `,
              [columnId, position, originPos - 1]
            );
          }
        }
      })
      .then(() =>
        conn.execute(
          `
            update todo
            set title = ?, content = ?, pos = ?, col_id = ?
            where id = ?
        `,
          [title, content, position, columnId, id]
        )
      )
      .then(([rows, field]) => {
        if (rows.affectedRows === 1) conn.commit().then(resolve());
        else conn.rollback().then(reject());
      })
      .catch((e) => conn.rollback().then(reject(e)))
      .finally(() => conn.end());
  });
}

function deleteTodo(id) {
  let conn;

  return new Promise((resolve, reject) => {
    getConnection()
      .then((connection) => (conn = connection))
      .then((conn) =>
        conn.execute(
          `
          delete
          from todo
          where id = ?;
        `,
          [id]
        )
      )
      .then(([rows, field]) => {
        if (rows.affectedRows === 1) resolve();
        else reject(new Error('number of affected rows not One'));
      })
      .catch((e) => reject(e))
      .finally(() => conn.end());
  });
}

function getAllHistory() {
  let conn;

  return new Promise((resolve, reject) => {
    getConnection()
      .then((connection) => (conn = connection))
      .then((conn) =>
        conn.execute(
          `
            select *
            from hist
            order by created_time desc;
          `
        )
      )
      .then(([rows, field]) => {
        resolve(rows);
      })
      .catch((e) => reject(e))
      .finally(() => conn.end());
  });
}

function postHistory(action, todoId, fromColId, toColId) {
  let conn;

  return new Promise((resolve, reject) => {
    getConnection()
      .then((connection) => (conn = connection))
      .then((conn) =>
        conn.execute(
          `
            insert into hist (act, todo_title, from_col, to_col)
            values (?, (select title from todo where id = ?), (select title from col where id = ?), (select title from col where id = ?));
          `,
          [action, todoId, fromColId, toColId]
        )
      )
      .then(([rows, field]) => {
        if (rows.affectedRows === 1) resolve();
        else reject(new Error('number of affected rows not One'));
      })
      .catch((e) => reject(e))
      .finally(() => conn.end());
  });
}

export default {
  getAllColumnsAndTodos,
  postTodo,
  putTodo,
  deleteTodo,
  getAllHistory,
  postHistory,
};
