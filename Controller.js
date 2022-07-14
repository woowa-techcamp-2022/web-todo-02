import dao from './Dao.js';
import getUniqueId from './util/uuid.js';

function getAllColumnsAndTodos(req, res) {
  dao
    .getAllColumnsAndTodos()
    .then((dataArray) => {
      const result = {};
      dataArray.forEach((data) => {
        const {
          title,
          id,
          todo_id: todoId,
          todo_title: todoTitle,
          todo_content: todoContent,
          todo_order: todoOrder,
          todo_pos_updated: orderUpdated,
        } = data;

        if (!result[id]) {
          result[id] = {
            title,
            id,
            todos: [],
          };
        }

        if (todoId) {
          result[id].todos.push({
            id: todoId,
            title: todoTitle,
            content: todoContent,
            order: todoOrder,
            updated: orderUpdated,
          });
        }
        // if (todoId) {
        //   result.get(id).todos.push({
        //     id: todoId,
        //     title: todoTitle,
        //     content: todoContent,
        //     order: todoOrder,
        //     updated: orderUpdated,
        //   });
        // }
      });

      res.status(200).send(Object.values(result));
    })
    .catch(() => {
      res.status(500).send();
    });
}

function postTodo(req, res) {
  const { columnId, title, content } = req.body;
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
  const { cardId: id, title, content } = req.body;
  dao
    .putTodo(id, title, content)
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
  const { cardId: id } = req.body;

  dao
    .deleteTodo(id)
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
