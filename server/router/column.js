import express from 'express';
import controller from '../Controller.js';

export const columnRouter = express.Router();

columnRouter.get('/', controller.getAllColumnsAndTodos);
