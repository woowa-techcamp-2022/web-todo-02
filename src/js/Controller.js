import view from './view.js';
import model from './model.js';

class Controller {
  constructor() {}

  init() {
    this.initAllColumns();
    this.initDefaultEvent();
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

  initDefaultEvent() {
    document.querySelector('#header-menubtn').addEventListener('click', () => {
      view.displaySidebar();
    });
    document
      .querySelector('#aside-history-closebtn')
      .addEventListener('click', () => {
        view.hideSidebar();
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

  getHistory() {
    return new Promise((resolve, reject) => {
      model.getHistory().then((histories) => {
        resolve(histories);
      });
    });
  }
}

const controllerInstance = new Controller();
export default controllerInstance;
