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
        } = data;

        if (!result.has(id)) {
          result.set(id, {
            title,
            id,
            todos: [],
          });
        }

        result
          .get(id)
          .todos.push({ id: todoId, title: todoTitle, content: todoContent });
      });

      res.status(200).send(Array.from(result.values()));
    })
    .catch((e) => {
      console.log(e);
      res.status(500).send(e);
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
    .catch((e) => {
      console.log(e);
      res.status(500).send(e);
    });
}

function putTodo(req, res) {
  const { id, title, content } = req.body;

  dao
    .putTodo(id, title, content)
    .then(() => {
      res.status(200).send({
        id,
        title,
        content,
      });
    })
    .catch((e) => {
      console.log(e);
      res.status(500).send(e);
    });
}

export default { getAllColumnsAndTodos, postTodo, putTodo };
