import express from 'express';

export const columnRouter = express.Router();

columnRouter.get('/', (req, res) => {
  res.send([
    {
      id: '1',
      title: '해야할 일',
      todos: [
        {
          id: '11',
          title: 'title',
          content: 'content',
        },
      ],
    },
    {
      id: '2',
      title: 'title2',
      todos: [
        {
          id: '11',
          title: 'title',
          content: 'content',
        },
      ],
    },
  ]);
});
