import getConnection from './db.js';

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
      .then(() => conn.beginTransaction())
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
      .then(() =>
        postHistory({
          conn,
          action: 'add',
          todoTitle: title,
          fromColId: columnId,
        })
      )
      .then(() => conn.commit())
      .then(() => resolve())
      .catch(() => conn.rollback())
      .then(() => reject())
      .finally(() => conn.end());
  });
}

function moveTodo(id, pos, columnId) {
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
        postHistory({
          conn,
          action: 'move',
          todoId: id,
          fromColId: originColId,
          toColId: columnId,
        })
      )
      .then(() => conn.commit())
      .then(() => resolve())
      .catch(() => conn.rollback())
      .then(() => reject())
      .finally(() => conn.end());
  });
}

function putTodo(id, title, content, columnId) {
  let conn;

  return new Promise((resolve, reject) => {
    getConnection()
      .then((connection) => (conn = connection))
      .then(() => conn.beginTransaction())
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
      .then(() =>
        postHistory({
          conn,
          action: 'update',
          todoTitle: title,
          fromColId: columnId,
        })
      )
      .then(() => conn.commit())
      .then(() => resolve())
      .catch(() => conn.rollback())
      .then(() => reject())
      .finally(() => conn.end());
  });
}

function deleteTodo(id, columnId) {
  let conn;

  return new Promise((resolve, reject) => {
    getConnection()
      .then((connection) => (conn = connection))
      .then(() => conn.beginTransaction())
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
      .then(() =>
        postHistory({
          conn,
          action: 'remove',
          todoId: id,
          fromColId: columnId,
        })
      )
      .then(() => conn.commit())
      .then(() => resolve())
      .catch(() => conn.rollback())
      .then(() => reject())
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

function postHistory({ conn, action, todoId, todoTitle, fromColId, toColId }) {
  switch (action) {
    case 'move':
      return conn.execute(
        `
          insert into hist (act, title, from_col, to_col)
          values (?, (select title from todo where id = ?), (select title from col where id = ?), (select title from col where id = ?))
        `,
        [action, todoId, fromColId, toColId]
      );
    case 'remove':
      return conn.execute(
        `
          insert into hist (act, title, from_col)
          values (?, (select title from todo where id = ?), (select title from col where id = ?))
        `,
        [action, todoId, fromColId]
      );
    case 'add':
      return conn.execute(
        `
          insert into hist (act, title, from_col)
          values (?, ?, (select title from col where id = ?))
        `,
        [action, title, fromColId]
      );
    case 'update':
      return conn.execute(
        `
          insert into hist (act, title, from_col)
          values (?, ?, (select title from col where id = ?))
        `,
        [action, todoTitle, fromColId]
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
