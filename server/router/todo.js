import express from 'express';
import controller from '../Controller.js';

export const todoRouter = express.Router();

todoRouter.post('/', controller.postTodo);
todoRouter.put('/', controller.putTodo);
todoRouter.delete('/', controller.deleteTodo);
todoRouter.put('/move', controller.moveTodo);
