import express from 'express';
import controller from '../controller/Controller.js';

export const todoRouter = express.Router();

todoRouter.post('/', controller.addTodo);
