import dao from '../dao/Dao.js';
import getUniqueId from '../util/uuid.js';

function getAllColumnsAndTodos(req, res) {
  dao
    .getAllColumnsAndTodos()
    .then((datas) => {
      const result = new Map();
      datas.forEach((data) => {
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

      res.status(200).send(Array.from(result.values()));
    })
    .catch(() => {
      res.status(500).send();
    });
}

function postTodo(req, res) {
  const { id: columnId, title, content } = req.body;
  const todoId = getUniqueId();

  dao
    .postTodo(todoId, title, content, columnId)
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
  const { id, title, content, columnId } = req.body;

  dao
    .putTodo(id, title, content, columnId)
    .then(() => {
      res.status(200).send({
        id,
        title,
        content,
        columnId,
      });
    })
    .catch(() => {
      res.status(500).send();
    });
}

function moveTodo(req, res) {
  const { id, position, columnId } = req.body;

  dao
    .moveTodo(id, position, columnId)
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
  const { id, columnId } = req.body;

  dao
    .deleteTodo(id, columnId)
    .then(() => {
      res.status(200).send();
    })
    .catch(() => {
      res.status(500).send();
    });
}

function getAllHistory(req, res) {
  dao
    .getAllHistory()
    .then((datas) => {
      res.status(200).send(datas);
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
