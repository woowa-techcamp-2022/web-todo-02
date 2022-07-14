import express from 'express';
import controller from '../Controller.js';

export const historyRouter = express.Router();

historyRouter.get('/', controller.getAllHistory);
