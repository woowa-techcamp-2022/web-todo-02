import dao from './Dao.js';
import getUniqueId from '../util/uuid.js';

function getAllColumnsAndTodos(req, res) {
  dao
    .getColumnHandler()
    .then(([rows, fields]) => {
      const result = new Map();

      rows.forEach((data) => {
        const {
          title,
          id,
          todo_id: todoId,
          todo_title: todoTitle,
          todo_content: todoContent,
          todo_order: todoOrder,
          todo_pos_updated: orderUpdated,
        } = data;

        if (!result.has(id)) {
          result.set(id, {
            title,
            id,
            todos: [],
          });
        }

        if (todoId) {
          result.get(id).todos.push({
            id: todoId,
            title: todoTitle,
            content: todoContent,
            order: todoOrder,
            updated: orderUpdated,
          });
        }
      });

      const allColumnsAndTodos = Array.from(result.values());
      allColumnsAndTodos.forEach((column) =>
        column.todos.sort((a, b) => b.order - a.order)
      );
      res.status(200).send(allColumnsAndTodos);
    })
    .catch(() => {
      res.status(500).send();
    });
}

function postTodo(req, res) {
  const { columnId, title, content } = req.body;
  const todoId = getUniqueId();

  dao
    .postTodoHandler(todoId, title, content, columnId)
    .then(() => {
      res.status(200).send({
        id: todoId,
        title,
        content,
        columnId,
      });
    })
    .catch(() => {
      res.status(500).send();
    });
}

function putTodo(req, res) {
  const { cardId: id, title, content } = req.body;
  dao
    .putTodoHandler(id, title, content)
    .then(() => {
      res.status(200).send({
        id,
        title,
        content,
      });
    })
    .catch(() => {
      res.status(500).send();
    });
}

function moveTodo(req, res) {
  const { cardId: id, position, columnId } = req.body;

  dao
    .moveTodoHandler(id, position, columnId)
    .then(() => {
      res.status(200).send({
        id,
        position,
        columnId,
      });
    })
    .catch(() => {
      res.status(500).send();
    });
}

function deleteTodo(req, res) {
  const { cardId: id } = req.body;

  dao
    .deleteTodoHandler(id)
    .then(() => {
      res.status(200).send();
    })
    .catch(() => {
      res.status(500).send();
    });
}

function getAllHistory(req, res) {
  dao
    .getHistoryHandler()
    .then(([rows, fields]) => {
      res.status(200).send(rows);
    })
    .catch(() => {
      res.status(500).send();
    });
}

export default {
  getAllColumnsAndTodos,
  postTodo,
  putTodo,
  moveTodo,
  deleteTodo,
  getAllHistory,
};
