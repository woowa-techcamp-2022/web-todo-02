import view from './view.js';
import model from './model.js';

export default class {
  constructor() {
    this.initAllColumns();
  }

  initAllColumns() {
    model.getAllColumns((columns) => {
      columns.forEach((column) => {
        const { id, title, todos } = column;
        this.addColumn(id, title);
        todos.forEach((todo) => {
          this.addCard(id, todo.id, todo.title, todo.content);
        });
      });
    });
  }

  addColumn(id, title) {
    view.addColumn(id, title);
  }

  addCard(columnId, cardId, title, content) {
    view.addCard(columnId, cardId, title, content);
  }
}
