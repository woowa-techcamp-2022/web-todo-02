class Model {
  constructor() {}

  getAllColumns() {
    return fetch('/column').then((res) => res.json());
  }

  addCard(columnId, title, content) {
    return fetch('/todo', {
      headers: {
        'content-type': 'application/json',
      },
      method: 'post',
      body: JSON.stringify({ columnId, title, content }),
    }).then((res) => res.json());
  }

  deleteCard(cardId) {
    return fetch('/todo', {
      headers: {
        'content-type': 'application/json',
      },
      method: 'delete',
      body: JSON.stringify({ cardId }),
    });
  }
}

const model = new Model();
export default model;
