import express from 'express';
import controller from '../controller/Controller.js';

export const columnRouter = express.Router();

columnRouter.get('/', controller.getAllColumnsAndTodos);
