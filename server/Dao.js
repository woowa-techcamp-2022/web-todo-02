import getConnection from '../db.js';

function getColumnHandler() {
  let conn;

  return getConnection()
    .then((connection) => (conn = connection))
    .then(() => getAllColumnsAndTodos(conn))
    .finally(() => conn.release());
}

function postTodoHandler(id, title, content, columnId) {
  let conn;

  return getConnection()
    .then((connection) => (conn = connection))
    .then(() => conn.beginTransaction())
    .then(() => {
      const promises = [
        postTodo(conn, id, title, content, columnId),
        postHistory({
          conn,
          action: 'add',
          todoId: id,
          todoTitle: title,
        }),
      ];

      return Promise.all(promises);
    })
    .then(() => conn.commit())
    .catch(() => conn.rollback())
    .finally(() => conn.release());
}

function putTodoHandler(id, title, content) {
  let conn;

  return getConnection()
    .then((connection) => (conn = connection))
    .then(() => conn.beginTransaction())
    .then(() => {
      const promises = [
        putTodo(conn, id, title, content),
        postHistory({
          conn,
          action: 'update',
          todoId: id,
          todoTitle: title,
        }),
      ];

      return Promise.all(promises);
    })
    .then(() => conn.commit())
    .catch(() => conn.rollback())
    .finally(() => conn.release());
}

function deleteTodoHandler(id) {
  let conn;

  return getConnection()
    .then((connection) => (conn = connection))
    .then(() => conn.beginTransaction())
    .then(() => {
      const promises = [
        postHistory({ conn, action: 'remove', todoId: id }),
        deleteTodo(conn, id),
      ];

      return Promise.all(promises);
    })
    .then(() => conn.commit())
    .catch(() => conn.rollback())
    .finally(() => conn.release());
}

function moveTodoHandler(id, pos, columnId) {
  const position = Number(pos);
  let conn;

  return getConnection()
    .then((connection) => (conn = connection))
    .then(() => conn.beginTransaction())
    .then(() => getOriginalPosAndColumn(conn, id))
    .then(([rows, fields]) => {
      const originPos = rows[0].pos;
      const originColId = rows[0].col_id;
      const promises = [];

      if (originColId !== columnId) {
        // 이동하는 컬럼 카드 조정
        promises.push(plusTodoPostion(conn, columnId, position, null));
        promises.push(minusTodoPostion(conn, originColId, originPos, null));
      } else if (position !== originPos) {
        // 동일 컬럼 카드 조정.
        if (position > originPos)
          promises.push(
            minusTodoPostion(conn, originColId, originPos + 1, position)
          );
        else
          promises.push(
            plusTodoPostion(conn, originColId, position, originPos - 1)
          );
      }

      promises.push(moveTodo(conn, id, position, columnId));
      promises.push(
        postHistory({
          conn,
          action: 'move',
          todoId: id,
          fromColId: originColId,
          toColId: columnId,
        })
      );

      return Promise.all(promises);
    })
    .then(() => conn.commit())
    .catch(() => conn.rollback())
    .finally(() => conn.release());
}

function getHistoryHandler() {
  let conn;

  return getConnection()
    .then((connection) => (conn = connection))
    .then(() => getAllHistory(conn))
    .finally(() => conn.release());
}

function getAllColumnsAndTodos(conn) {
  return conn.execute(
    `
      select c.title as title, c.id as id, t.id as todo_id,
      t.title as todo_title, t.content as todo_content, t.pos as todo_order
      from col c
      left join todo t
      on c.id = t.col_id;
    `
  );
}

function postTodo(conn, id, title, content, columnId) {
  return conn.execute(
    `
      insert into todo (id, title, content, col_id, pos)
      values (?, ?, ?, ?,
        ifnull ((select pos from (select max(pos) as pos from todo where col_id = ?) temp), 0)
      + 1);
    `,
    [id, title, content, columnId, columnId]
  );
}

function moveTodo(conn, id, position, columnId) {
  return conn.execute(
    `
    update todo
    set pos = ?, col_id = ?
    where id = ?;
    `,
    [position, columnId, id]
  );
}

function putTodo(conn, todoId, title, content) {
  return conn.execute(
    `
      update todo
      set title = ?, content = ?
      where id = ?
    `,
    [title, content, todoId]
  );
}

function deleteTodo(conn, todoId) {
  return conn.execute(
    `
      delete
      from todo
      where id = ?;
    `,
    [todoId]
  );
}

function getAllHistory(conn) {
  return conn.execute(
    `
      select *
      from hist
      order by created_time desc;
    `
  );
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
          values (?, (select title from todo where id = ?), (select c.title from col c join todo t on t.col_id = c.id where t.id = ?))
        `,
        [action, todoId, todoId]
      );
    case 'add':
      return conn.execute(
        `
          insert into hist (act, title, from_col)
          values (?, ?, (select c.title from col c join todo t on t.col_id = c.id where t.id = ?))
        `,
        [action, todoTitle, todoId]
      );
    case 'update':
      return conn.execute(
        `
          insert into hist (act, title, from_col)
          values (?, ?, (select c.title from col c join todo t on t.col_id = c.id where t.id = ?))
        `,
        [action, todoTitle, todoId]
      );
  }
}

function getOriginalPosAndColumn(conn, todoId) {
  return conn.execute(`select pos, col_id from todo where id = ?`, [todoId]);
}

function plusTodoPostion(conn, columnId, from, to) {
  if (to) {
    return conn.execute(
      `
        update todo
        set pos = pos + 1
        where col_id = ? and pos > ?;
      `,
      [columnId, from]
    );
  } else {
    return conn.execute(
      `
        update todo
        set pos = pos + 1
        where col_id = ? and pos between ? and ?;
      `,
      [columnId, from, to]
    );
  }
}

function minusTodoPostion(conn, columnId, from, to) {
  if (to) {
    return conn.execute(
      `
        update todo
        set pos = pos - 1
        where col_id = ? and pos > ?;
      `,
      [columnId, from]
    );
  } else {
    return conn.execute(
      `
        update todo
        set pos = pos - 1
        where col_id = ? and pos between ? and ?;
      `,
      [columnId, from, to]
    );
  }
}

export default {
  getColumnHandler,
  postTodoHandler,
  putTodoHandler,
  deleteTodoHandler,
  moveTodoHandler,
  getHistoryHandler,
};
