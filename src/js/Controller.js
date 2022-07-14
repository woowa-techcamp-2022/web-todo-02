import view from './View.js';
import model from './model.js';

class Controller {
  constructor() {}

  init() {
    this.initAllColumns();
  }

  initAllColumns() {
    model.getAllColumns().then((columns) => {
      columns.forEach((column) => {
        const { id: columnId, title, todos } = column;
        view.appendColumn(columnId, title);
        todos.forEach((todo) => {
          view.appendCard(columnId, todo.id, todo.title, todo.content);
        });
        view.setColumnCardsCount(columnId, todos.length);
      });
    });
  }

  addCard(columnId, title, content) {
    return new Promise((resolve, reject) => {
      model.addCard(columnId, title, content).then((todo) => {
        resolve(todo.id);
      });
    });
  }

  deleteCard(cardId) {
    return new Promise((resolve, reject) => {
      model.deleteCard(cardId).then(() => {
        resolve();
      });
    });
  }

  updateCard(cardId, title, content) {
    return new Promise((resolve, reject) => {
      model.updateCard(cardId, title, content).then(() => {
        resolve();
      });
    });
  }

  moveCard(cardId, position, columnId) {
    return new Promise((resolve, reject) => {
      model.moveCard(cardId, position, columnId).then(() => {
        resolve();
      });
    });
  }
}

const controllerInstance = new Controller();
export default controllerInstance;
