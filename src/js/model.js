export default class {
  constructor() {}

  getColumns(callback) {
    const columns = [
      {
        id: 1,
        title: 'title',
        cards: [
          {
            id: Math.random(),
            title: 'title',
            content: 'cotent',
            author: 'author',
          },
        ],
      },
      {
        id: 2,
        title: 'title',
        cards: [
          {
            id: Math.random(),
            title: 'title',
            content: 'cotent',
            author: 'author',
          },
        ],
      },
    ];
    callback(columns);
  }

  addCard({ title, content }, callback) {
    const card = {
      id: Math.random(),
      title: title,
      content: content,
      author: 'author',
    };
    callback(card);
  }

  deleteCard(callback) {
    callback();
  }
}
