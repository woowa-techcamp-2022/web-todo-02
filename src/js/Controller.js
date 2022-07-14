import view from './View.js';
import model from './model.js';

class Controller {
  constructor() {}

  init() {
    this.initAllColumns();
  }

  initAllColumns() {
    model.getAllColumns((columns) => {
      columns.forEach((column) => {
        const { id, title, todos } = column;
        view.appendColumn(id, title);
        todos.forEach((todo) => {
          view.appendCard(id, todo.id, todo.title, todo.content);
        });
      });
    });
  }

  addCard(columnId, title, content) {
    return new Promise((resolve, reject) => {
      // model.addCard(columnId, title, content).then((cardId) => {
      // FIXME: id를 서버에서 반환해준 값으로 resolve
      resolve(Date.now());
      // });
    });
  }

  deleteCard(cardId) {
    return new Promise((resolve, reject) => {
      // model.deleteCard(cardId).then(() => {
      resolve();
      // });
    });
  }

  updateCard(cardId, title, content) {
    return new Promise((resolve, reject) => {
      // model.updateCard(cardId, title, content).then(() => {
      resolve();
      // });
    });
  }
}

const controllerInstance = new Controller();
export default controllerInstance;
