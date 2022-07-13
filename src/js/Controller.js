import view from './view.js';

export default class {
  constructor() {}

  addColumn(id, title) {
    view.addColumn(id, title);
  }

  addCard(columnId, title, content) {
    view.addCard(columnId, title, content);
  }
}
