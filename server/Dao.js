import getConnection from '../db.js';

function getAllColumnsAndTodos() {
  let conn;

  return new Promise((resolve, reject) => {
    getConnection()
      .then((connection) => (conn = connection))
      .then(() =>
        conn.execute(`
        select c.title as title, c.id as id, t.id as todo_id,
        t.title as todo_title, t.content as todo_content, t.pos as todo_order
        from col c
        left join todo t
        on c.id = t.col_id;
      `)
      )
      .then(([rows, field]) => {
        resolve(rows);
      })
      .catch((e) => reject(e))
      .finally(() => conn.release());
  });
}

function postTodo(id, title, content, columnId) {
  let conn;

  return new Promise((resolve, reject) => {
    getConnection()
      .then((connection) => (conn = connection))
      .then(() => conn.beginTransaction())
      .then(() =>
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
      .then(() => getColumnTitle(conn, id))
      .then(([rows, fields]) => {
        return postHistory({
          conn,
          action: 'add',
          todoTitle: title,
          fromColTitle: rows[0].title,
        });
      })
      .then(() => conn.commit())
      .then(() => resolve())
      .catch(() => conn.rollback())
      .then(() => reject())
      .finally(() => conn.release());
  });
}

function moveTodo(id, pos, columnId) {
  const position = Number(pos);
  let conn;
  let originPos;
  let originColId;
  let originColTitle;
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
          // 이동하는 컬럼 카드 조정
          return conn.execute(
            `
            update todo
            set pos = pos + 1
            where col_id = ? and pos >= ?;
            `,
            [columnId, position]
          );
        } else if (position !== originPos) {
          // 동일 컬럼 카드 조정.
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
      .then(() => {
        //원래 컬럼 카드 조정
        if (originColId !== columnId) {
          return conn.execute(
            `
                  update todo
                  set pos = pos - 1
                  where col_id = ? and pos > ?;
                  `,
            [originColId, originPos]
          );
        } else {
          return new Promise((resolve, reject) => {
            resolve();
          });
        }
      })
      .then(() => {
        return conn.execute(
          `
          update todo
          set pos = ?, col_id = ?
          where id = ?;
          `,
          [position, columnId, id]
        );
      })
      .then(() =>
        conn.execute(`select title from col where id = ?`, [originColId])
      )
      .then(([rows, fields]) => {
        originColTitle = rows[0].title;
        return conn.execute(`select title from col where id = ?`, [columnId]);
      })
      .then(([rows, fields]) =>
        postHistory({
          conn,
          action: 'move',
          todoId: id,
          fromColTitle: originColTitle,
          toColTitle: rows[0].title,
        })
      )
      .then(() => conn.commit())
      .then(() => resolve())
      .catch(() => conn.rollback())
      .then(() => reject())
      .finally(() => conn.release());
  });
}

function putTodo(id, title, content) {
  let conn;

  return new Promise((resolve, reject) => {
    getConnection()
      .then((connection) => (conn = connection))
      .then(() => conn.beginTransaction())
      .then(() => getColumnTitle(conn, id))
      .then(([rows, fields]) =>
        postHistory({
          conn,
          action: 'update',
          todoTitle: title,
          fromColTitle: rows[0].title,
        })
      )
      .then(() =>
        conn.execute(
          `
            update todo
            set title = ?, content = ?
            where id = ?
          `,
          [title, content, id]
        )
      )
      .then(() => conn.commit())
      .then(() => resolve())
      .catch(() => conn.rollback())
      .then(() => reject())
      .finally(() => conn.release());
  });
}

function deleteTodo(id) {
  let conn;

  return new Promise((resolve, reject) => {
    getConnection()
      .then((connection) => (conn = connection))
      .then(() => conn.beginTransaction())
      .then(() => getColumnTitle(conn, id))
      .then(([rows, fields]) =>
        postHistory({
          conn,
          action: 'remove',
          todoId: id,
          fromColTitle: rows[0].title,
        })
      )
      .then(() =>
        conn.execute(
          `
            delete
            from todo
            where id = ?;
          `,
          [id]
        )
      )
      .then(() => conn.commit())
      .then(() => resolve())
      .catch(() => conn.rollback())
      .then(() => reject())
      .finally(() => conn.release());
  });
}

function getColumnTitle(conn, cardId) {
  return conn.execute(
    `
      select title
      from col
      where id = (select col_id from todo where id = ?)
    `,
    [cardId]
  );
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
      .finally(() => conn.release());
  });
}

function postHistory({
  conn,
  action,
  todoId,
  todoTitle,
  fromColTitle,
  toColTitle,
}) {
  switch (action) {
    case 'move':
      return conn.execute(
        `
          insert into hist (act, title, from_col, to_col)
          values (?, (select title from todo where id = ?), ?, ?)
        `,
        [action, todoId, fromColTitle, toColTitle]
      );
    case 'remove':
      return conn.execute(
        `
          insert into hist (act, title, from_col)
          values (?, (select title from todo where id = ?), ?)
        `,
        [action, todoId, fromColTitle]
      );
    case 'add':
      return conn.execute(
        `
          insert into hist (act, title, from_col)
          values (?, ?, ?)
        `,
        [action, todoTitle, fromColTitle]
      );
    case 'update':
      return conn.execute(
        `
          insert into hist (act, title, from_col)
          values (?, ?, ?)
        `,
        [action, todoTitle, fromColTitle]
      );
  }
}

export default {
  getAllColumnsAndTodos,
  postTodo,
  putTodo,
  moveTodo,
  deleteTodo,
  getAllHistory,
  postHistory,
};
